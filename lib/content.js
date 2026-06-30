import crypto from "crypto";
import getMongoClient from "./mongodb";

let indexesReady = false;

async function getDb() {
  const client = await getMongoClient();
  const dbName = process.env.MONGODB_DB || "veichle_homepage";
  return client.db(dbName);
}

async function getFeaturedVehiclesCollection(db, session) {
  const query = db
    .collection("featuredVehicles")
    .find({}, { projection: { _id: 0 } })
    .sort({ order: 1, createdAt: 1 });

  if (session) {
    query.session(session);
  }

  return query.toArray();
}

function parseNumber(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function parseOrderInput(value) {
  if (value === undefined || value === null || String(value).trim() === "") {
    return null;
  }

  return parseNumber(value, 0);
}

async function getGalleryPhotosCollection(db, session) {
  const query = db
    .collection("galleryPhotos")
    .find({}, { projection: { _id: 0 } })
    .sort({ order: 1, createdAt: 1 });

  if (session) {
    query.session(session);
  }

  return query.toArray();
}

function normalizeVehicleInput(input, { isCreate }) {
  const id = String(input?.id || "").trim();
  const name = String(input?.name || "").trim();
  const category = String(input?.category || "").trim();
  const price = String(input?.price || "").trim();
  const description = String(input?.description || "").trim();
  const image = String(input?.image || "").trim();

  if (isCreate && (!name || !category || !price || !description || !image)) {
    return { error: "name, category, price, description, and image are required." };
  }

  const fullDescription = String(input?.fullDescription || "").trim();
  const images = Array.isArray(input?.images)
    ? input.images.map((item) => String(item || "").trim()).filter(Boolean)
    : [];
  const features = Array.isArray(input?.features)
    ? input.features.map((item) => String(item || "").trim()).filter(Boolean)
    : [];

  const specs = input?.specs && typeof input.specs === "object" && !Array.isArray(input.specs)
    ? Object.entries(input.specs).reduce((accumulator, [key, value]) => {
        const normalizedKey = String(key || "").trim();
        if (!normalizedKey) {
          return accumulator;
        }
        accumulator[normalizedKey] = String(value || "").trim();
        return accumulator;
      }, {})
    : {};

  return {
    value: {
      ...(id ? { id } : {}),
      ...(name ? { name } : {}),
      ...(category ? { category } : {}),
      ...(price ? { price } : {}),
      ...(description ? { description } : {}),
      ...(image ? { image } : {}),
      fullDescription,
      images,
      features,
      specs,
      order: parseNumber(input?.order, 0),
      updatedAt: new Date(),
    },
  };
}

function normalizeGalleryInput(input, { isCreate }) {
  const id = String(input?.id || "").trim();
  const patch = {};

  if (input?.imageUrl !== undefined) {
    patch.imageUrl = String(input?.imageUrl || "").trim();
  }

  if (input?.title !== undefined) {
    patch.title = String(input?.title || "").trim();
  }

  const order = parseOrderInput(input?.order);

  if (isCreate && !patch.imageUrl) {
    return { error: "imageUrl is required." };
  }

  return {
    value: {
      ...(id ? { id } : {}),
      ...patch,
      updatedAt: new Date(),
    },
    order,
  };
}

function withDefaults(vehicle) {
  return {
    fullDescription: "",
    specs: {},
    images: [],
    features: [],
    ...vehicle,
  };
}

function reorderGalleryPhotos(currentPhotos, movingId, targetOrder, movingPhoto = null) {
  const remainingPhotos = currentPhotos.filter((photo) => photo.id !== movingId);
  const boundedTargetOrder = Math.max(0, Math.min(targetOrder, remainingPhotos.length));
  const nextPhotos = [
    ...remainingPhotos.slice(0, boundedTargetOrder),
    movingPhoto || currentPhotos.find((photo) => photo.id === movingId),
    ...remainingPhotos.slice(boundedTargetOrder),
  ].filter(Boolean);

  return nextPhotos.map((photo, index) => ({
    ...photo,
    order: index,
  }));
}

function isTransactionError(error) {
  const message = String(error?.message || "");
  return message.includes("Transaction numbers are only allowed") || message.includes("replica set");
}

async function resequenceFeaturedVehicles(db, vehicles, session) {
  const collection = db.collection("featuredVehicles");
  const tempBase = -(vehicles.length + 1);

  const tempOperations = vehicles.map((vehicle, index) => ({
    updateOne: {
      filter: { id: vehicle.id },
      update: { $set: { ...vehicle, order: tempBase - index } },
    },
  }));

  const finalOperations = vehicles.map((vehicle, index) => ({
    updateOne: {
      filter: { id: vehicle.id },
      update: { $set: { ...vehicle, order: index } },
    },
  }));

  const options = { ordered: true };
  if (session) {
    options.session = session;
  }

  if (tempOperations.length > 0) {
    await collection.bulkWrite(tempOperations, options);
    await collection.bulkWrite(finalOperations, options);
  }
}

async function resequenceGalleryPhotos(db, photos, session) {
  const collection = db.collection("galleryPhotos");
  const tempBase = -(photos.length + 1);

  const tempOperations = photos.map((photo, index) => ({
    updateOne: {
      filter: { id: photo.id },
      update: { $set: { ...photo, order: tempBase - index } },
    },
  }));

  const finalOperations = photos.map((photo, index) => ({
    updateOne: {
      filter: { id: photo.id },
      update: { $set: { ...photo, order: index } },
    },
  }));

  const options = { ordered: true };
  if (session) {
    options.session = session;
  }

  if (tempOperations.length > 0) {
    await collection.bulkWrite(tempOperations, options);
    await collection.bulkWrite(finalOperations, options);
  }
}

async function withGalleryMutation(db, mutate) {
  const client = await getMongoClient();
  const session = client.startSession();

  try {
    let result = null;

    try {
      await session.withTransaction(async () => {
        result = await mutate(session);
      });
      return result || { success: true };
    } catch (error) {
      if (!isTransactionError(error)) {
        throw error;
      }

      return await mutate(null);
    }
  } finally {
    await session.endSession();
  }
}

async function ensureGalleryOrderSequence(db) {
  const galleryPhotos = await getGalleryPhotosCollection(db);
  if (galleryPhotos.length === 0) {
    return;
  }

  const orderedPhotos = galleryPhotos.map((photo, index) => ({
    ...photo,
    order: index,
  }));

  await resequenceGalleryPhotos(db, orderedPhotos);
}

async function ensureIndexes(db) {
  if (indexesReady) {
    return;
  }

  await db.collection("featuredVehicles").createIndex({ id: 1 }, { unique: true });
  await db.collection("featuredVehicles").createIndex({ order: 1 });
  await db.collection("galleryPhotos").createIndex({ id: 1 }, { unique: true });
  await db.collection("galleryPhotos").createIndex({ order: 1 });

  await ensureGalleryOrderSequence(db);

  indexesReady = true;
}

export async function getHomeContent() {
  const db = await getDb();
  await ensureIndexes(db);

  const [vehicles, gallery] = await Promise.all([
    getFeaturedVehiclesCollection(db),
    getGalleryPhotosCollection(db),
  ]);

  return {
    vehicles: vehicles.map(withDefaults),
    gallery,
  };
}

export async function getVehicleById(id) {
  const db = await getDb();
  await ensureIndexes(db);

  const vehicle = await db.collection("featuredVehicles").findOne(
    { id: String(id || "").trim() },
    { projection: { _id: 0 } }
  );

  return vehicle ? withDefaults(vehicle) : null;
}

export async function listFeaturedVehicles() {
  const db = await getDb();
  await ensureIndexes(db);

  const vehicles = await getFeaturedVehiclesCollection(db);

  return vehicles.map(withDefaults);
}

export async function createFeaturedVehicle(input) {
  const db = await getDb();
  await ensureIndexes(db);

  const normalized = normalizeVehicleInput(input, { isCreate: true });
  if (normalized.error) {
    return { error: normalized.error };
  }

  const now = new Date();
  const createdId = normalized.value.id || crypto.randomUUID();
  const collection = db.collection("featuredVehicles");

  // If Add Vehicle is used with an existing id, treat it as append/update.
  if (normalized.value.id) {
    const existingVehicle = await collection.findOne(
      { id: normalized.value.id },
      { projection: { _id: 0 } }
    );

    if (existingVehicle) {
      const existingImages = Array.isArray(existingVehicle.images)
        ? existingVehicle.images.map((item) => String(item || "").trim()).filter(Boolean)
        : [];
      const incomingImages = Array.isArray(normalized.value.images)
        ? normalized.value.images.map((item) => String(item || "").trim()).filter(Boolean)
        : [];
      const mergedImages = [...new Set([...existingImages, ...incomingImages])];

      const mergedPayload = {
        id: existingVehicle.id,
        name: normalized.value.name || existingVehicle.name || "",
        category: normalized.value.category || existingVehicle.category || "",
        price: normalized.value.price || existingVehicle.price || "",
        description: normalized.value.description || existingVehicle.description || "",
        image: normalized.value.image || incomingImages[0] || existingVehicle.image || mergedImages[0] || "",
        fullDescription: normalized.value.fullDescription || existingVehicle.fullDescription || "",
        order: Number.isFinite(Number(normalized.value.order))
          ? Number(normalized.value.order)
          : Number(existingVehicle.order || 0),
        images: mergedImages,
        features: Array.isArray(normalized.value.features) && normalized.value.features.length > 0
          ? normalized.value.features
          : Array.isArray(existingVehicle.features)
          ? existingVehicle.features
          : [],
        specs: normalized.value.specs && Object.keys(normalized.value.specs).length > 0
          ? normalized.value.specs
          : existingVehicle.specs && typeof existingVehicle.specs === "object"
          ? existingVehicle.specs
          : {},
      };

      const updateResult = await updateFeaturedVehicle(existingVehicle.id, mergedPayload);
      if (updateResult?.error) {
        return updateResult;
      }

      return { success: true, id: existingVehicle.id, merged: true };
    }
  }

  const currentCount = await collection.countDocuments();
  const targetOrder = Math.max(0, Math.min(parseNumber(normalized.value.order, 0), currentCount));

  try {
    // Make room for the new vehicle at its requested order.
    await collection.updateMany(
      { order: { $gte: targetOrder } },
      { $inc: { order: 1 } }
    );

    await collection.insertOne({
      ...normalized.value,
      order: targetOrder,
      createdAt: now,
      id: createdId,
    });
  } catch (error) {
    if (error?.code === 11000) {
      return { error: "Vehicle id already exists." };
    }
    throw error;
  }

  return { success: true, id: createdId };
}

export async function updateFeaturedVehicle(id, input) {
  const db = await getDb();
  await ensureIndexes(db);

  const normalized = normalizeVehicleInput(input, { isCreate: false });
  if (normalized.error) {
    return { error: normalized.error };
  }

  const collection = db.collection("featuredVehicles");
  const vehicleId = String(id || "").trim();

  const existingVehicle = await collection.findOne(
    { id: vehicleId },
    { projection: { _id: 0 } }
  );

  if (!existingVehicle) {
    return { error: "Vehicle not found." };
  }

  const currentOrder = parseNumber(existingVehicle.order, 0);
  const totalCount = await collection.countDocuments();
  const maxOrder = Math.max(0, totalCount - 1);
  const requestedOrder = parseNumber(normalized.value.order, currentOrder);
  const targetOrder = Math.max(0, Math.min(requestedOrder, maxOrder));

  if (targetOrder < currentOrder) {
    await collection.updateMany(
      { id: { $ne: vehicleId }, order: { $gte: targetOrder, $lt: currentOrder } },
      { $inc: { order: 1 } }
    );
  } else if (targetOrder > currentOrder) {
    await collection.updateMany(
      { id: { $ne: vehicleId }, order: { $gt: currentOrder, $lte: targetOrder } },
      { $inc: { order: -1 } }
    );
  }

  await collection.updateOne(
    { id: vehicleId },
    {
      $set: {
        ...normalized.value,
        order: targetOrder,
      },
    }
  );

  return { success: true };
}

export async function deleteFeaturedVehicle(id) {
  const db = await getDb();
  await ensureIndexes(db);

  const collection = db.collection("featuredVehicles");
  const vehicleId = String(id || "").trim();
  const existingVehicle = await collection.findOne(
    { id: vehicleId },
    { projection: { _id: 0 } }
  );

  if (!existingVehicle) {
    return { error: "Vehicle not found." };
  }

  const deletedOrder = parseNumber(existingVehicle.order, 0);

  await collection.deleteOne({
    id: vehicleId,
  });

  // Close the order gap after deletion.
  await collection.updateMany(
    { order: { $gt: deletedOrder } },
    { $inc: { order: -1 } }
  );

  return { success: true };
}

export async function deleteAllFeaturedVehicles() {
  const db = await getDb();
  await ensureIndexes(db);

  const result = await db.collection("featuredVehicles").deleteMany({});
  return { success: true, deletedCount: result.deletedCount || 0 };
}

export async function listGalleryPhotos() {
  const db = await getDb();
  await ensureIndexes(db);

  return getGalleryPhotosCollection(db);
}

export async function createGalleryPhoto(input) {
  const db = await getDb();
  await ensureIndexes(db);

  const normalized = normalizeGalleryInput(input, { isCreate: true });
  if (normalized.error) {
    return { error: normalized.error };
  }

  const now = new Date();
  const createdId = normalized.value.id || crypto.randomUUID();
  const collection = db.collection("galleryPhotos");
  const currentCount = await collection.countDocuments();
  const requestedOrder = normalized.order === null ? currentCount : normalized.order;
  const targetOrder = Math.max(0, Math.min(parseNumber(requestedOrder, 0), currentCount));

  try {
    // Make room for the new photo at its requested order.
    await collection.updateMany(
      { order: { $gte: targetOrder } },
      { $inc: { order: 1 } }
    );

    await collection.insertOne({
      ...normalized.value,
      order: targetOrder,
      createdAt: now,
      updatedAt: now,
      id: createdId,
    });
  } catch (error) {
    if (error?.code === 11000) {
      return { error: "Gallery photo id already exists." };
    }
    throw error;
  }

  return { success: true, id: createdId };
}

export async function updateGalleryPhoto(id, input) {
  const db = await getDb();
  await ensureIndexes(db);

  const normalized = normalizeGalleryInput(input, { isCreate: false });
  if (normalized.error) {
    return { error: normalized.error };
  }

  const collection = db.collection("galleryPhotos");
  const galleryId = String(id || "").trim();

  const existingPhoto = await collection.findOne(
    { id: galleryId },
    { projection: { _id: 0 } }
  );

  if (!existingPhoto) {
    return { error: "Gallery photo not found." };
  }

  const currentOrder = parseNumber(existingPhoto.order, 0);
  const totalCount = await collection.countDocuments();
  const maxOrder = Math.max(0, totalCount - 1);
  const requestedOrder = normalized.order === null ? currentOrder : normalized.order;
  const targetOrder = Math.max(0, Math.min(parseNumber(requestedOrder, currentOrder), maxOrder));

  if (targetOrder < currentOrder) {
    await collection.updateMany(
      { id: { $ne: galleryId }, order: { $gte: targetOrder, $lt: currentOrder } },
      { $inc: { order: 1 } }
    );
  } else if (targetOrder > currentOrder) {
    await collection.updateMany(
      { id: { $ne: galleryId }, order: { $gt: currentOrder, $lte: targetOrder } },
      { $inc: { order: -1 } }
    );
  }

  await collection.updateOne(
    { id: galleryId },
    {
      $set: {
        ...normalized.value,
        order: targetOrder,
      },
    }
  );

  return { success: true };
}

export async function deleteGalleryPhoto(id) {
  const db = await getDb();
  await ensureIndexes(db);

  const collection = db.collection("galleryPhotos");
  const galleryId = String(id || "").trim();
  const existingPhoto = await collection.findOne(
    { id: galleryId },
    { projection: { _id: 0 } }
  );

  if (!existingPhoto) {
    return { error: "Gallery photo not found." };
  }

  const deletedOrder = parseNumber(existingPhoto.order, 0);

  await collection.deleteOne({
    id: galleryId,
  });

  // Close the order gap after deletion.
  await collection.updateMany(
    { order: { $gt: deletedOrder } },
    { $inc: { order: -1 } }
  );

  return { success: true };
}

export async function deleteAllGalleryPhotos() {
  const db = await getDb();
  await ensureIndexes(db);

  const result = await db.collection("galleryPhotos").deleteMany({});
  return { success: true, deletedCount: result.deletedCount || 0 };
}
