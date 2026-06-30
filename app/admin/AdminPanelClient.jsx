"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const initialVehicleForm = {
  id: "",
  name: "",
  category: "",
  price: "",
  description: "",
  image: "",
  fullDescription: "",
  order: "0",
  imagesCsv: "",
  featuresCsv: "",
  specsJson: "{}",
};

const initialGalleryForm = {
  id: "",
  imageUrl: "",
  title: "",
  order: "0",
};

function toVehicleForm(vehicle) {
  return {
    id: vehicle.id || "",
    name: vehicle.name || "",
    category: vehicle.category || "",
    price: vehicle.price || "",
    description: vehicle.description || "",
    image: vehicle.image || "",
    fullDescription: vehicle.fullDescription || "",
    order: String(vehicle.order ?? 0),
    imagesCsv: Array.isArray(vehicle.images) ? vehicle.images.join(", ") : "",
    featuresCsv: Array.isArray(vehicle.features) ? vehicle.features.join(", ") : "",
    specsJson: JSON.stringify(vehicle.specs || {}, null, 2),
  };
}

function toGalleryForm(photo) {
  return {
    id: photo.id || "",
    imageUrl: photo.imageUrl || "",
    title: photo.title || "",
    order: String(photo.order ?? 0),
  };
}

function parseVehiclePayload(form) {
  const images = form.imagesCsv
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  let specs = {};
  try {
    specs = form.specsJson.trim() ? JSON.parse(form.specsJson) : {};
  } catch {
    throw new Error("Specs JSON must be valid JSON.");
  }

  return {
    id: form.id.trim(),
    name: form.name.trim(),
    category: form.category.trim(),
    price: form.price.trim(),
    description: form.description.trim(),
    image: form.image.trim() || images[0] || "",
    fullDescription: form.fullDescription.trim(),
    order: Number(form.order || 0),
    images,
    features: form.featuresCsv
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    specs,
  };
}

function parseGalleryPayload(form) {
  return {
    id: form.id.trim(),
    imageUrl: form.imageUrl.trim(),
    title: form.title.trim(),
    order: Number(form.order || 0),
  };
}

async function toJson(response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

function modeButtonClass(active) {
  if (active) {
    return "rounded-full bg-amber-400 px-4 py-2 text-sm font-semibold text-black";
  }
  return "rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-zinc-200 hover:border-amber-300";
}

function formatDateTime(value) {
  if (!value) {
    return "-";
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return "-";
  }

  return parsed.toLocaleString();
}

const SESSION_REVALIDATION_INTERVAL_MS = 10000;

export default function AdminPanelClient({ initialAdmin = null }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingFeaturedCover, setUploadingFeaturedCover] = useState(false);
  const [uploadingFeaturedGalleryImage, setUploadingFeaturedGalleryImage] = useState(false);
  const [uploadingGalleryImage, setUploadingGalleryImage] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [adminProfile, setAdminProfile] = useState(initialAdmin);
  const [vehicles, setVehicles] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [activeVehicleId, setActiveVehicleId] = useState("");
  const [activeGalleryId, setActiveGalleryId] = useState("");
  const [vehicleForm, setVehicleForm] = useState(initialVehicleForm);
  const [galleryForm, setGalleryForm] = useState(initialGalleryForm);
  const [vehicleMode, setVehicleMode] = useState("edit");
  const [galleryMode, setGalleryMode] = useState("edit");

  const activeVehicle = useMemo(
    () => vehicles.find((vehicle) => vehicle.id === activeVehicleId) || null,
    [vehicles, activeVehicleId]
  );

  const activeGallery = useMemo(
    () => gallery.find((photo) => photo.id === activeGalleryId) || null,
    [gallery, activeGalleryId]
  );

  const handleSessionExpired = () => {
    setError("Session expired. Please login again to continue.");

    if (typeof window !== "undefined") {
      window.location.replace("/admin?session=expired");
    }
  };

  const loadAdminData = async ({ selectVehicleId = null, selectGalleryId = null } = {}) => {
    setError("");

    const [adminResponse, vehiclesResponse, galleryResponse] = await Promise.all([
      fetch("/api/admin/me", { credentials: "include", cache: "no-store" }),
      fetch("/api/admin/featured-vehicles", { credentials: "include", cache: "no-store" }),
      fetch("/api/admin/gallery", { credentials: "include", cache: "no-store" }),
    ]);

    if (
      adminResponse.status === 401
      || vehiclesResponse.status === 401
      || galleryResponse.status === 401
    ) {
      handleSessionExpired();
      return;
    }

    const adminBody = await toJson(adminResponse);
    const vehiclesBody = await toJson(vehiclesResponse);
    const galleryBody = await toJson(galleryResponse);

    if (!adminResponse.ok) {
      setError(adminBody.error || "Failed to load admin profile.");
      return;
    }

    setAdminProfile(adminBody?.admin || null);

    if (!vehiclesResponse.ok) {
      setError(vehiclesBody.error || "Failed to load vehicles.");
      return;
    }

    if (!galleryResponse.ok) {
      setError(galleryBody.error || "Failed to load gallery.");
      return;
    }

    const vehiclesData = Array.isArray(vehiclesBody.vehicles) ? vehiclesBody.vehicles : [];
    const galleryData = Array.isArray(galleryBody.photos)
      ? [...galleryBody.photos].sort((left, right) => {
          const leftOrder = Number(left?.order ?? 0);
          const rightOrder = Number(right?.order ?? 0);
          if (leftOrder !== rightOrder) {
            return leftOrder - rightOrder;
          }
          return String(left?.id || "").localeCompare(String(right?.id || ""));
        })
      : [];

    setVehicles(vehiclesData);
    setGallery(galleryData);

    if (vehiclesData.length > 0) {
      const target = (selectVehicleId && vehiclesData.find((v) => v.id === selectVehicleId))
        || vehiclesData[0];
      setActiveVehicleId(target.id);
      setVehicleForm(toVehicleForm(target));
      setVehicleMode("edit");
    } else {
      setActiveVehicleId("");
      setVehicleForm(initialVehicleForm);
    }

    if (galleryData.length > 0) {
      const target = (selectGalleryId && galleryData.find((g) => g.id === selectGalleryId))
        || galleryData[0];
      setActiveGalleryId(target.id);
      setGalleryForm(toGalleryForm(target));
      setGalleryMode("edit");
    } else {
      setActiveGalleryId("");
      setGalleryForm(initialGalleryForm);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        await loadAdminData();
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        const response = await fetch("/api/admin/me", {
          credentials: "include",
          cache: "no-store",
        });

        if (response.status === 401) {
          handleSessionExpired();
        }
      } catch {
        // Ignore transient network issues; regular data calls still surface errors.
      }
    }, SESSION_REVALIDATION_INTERVAL_MS);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const handleVehicleSelect = (id) => {
    const vehicle = vehicles.find((item) => item.id === id);
    setActiveVehicleId(id);
    if (vehicle) {
      setVehicleForm(toVehicleForm(vehicle));
    }
    if (vehicleMode === "add") {
      setVehicleMode("edit");
    }
    setNotice("");
    setError("");
  };

  const handleGallerySelect = (id) => {
    const photo = gallery.find((item) => item.id === id);
    setActiveGalleryId(id);
    if (photo) {
      setGalleryForm(toGalleryForm(photo));
    }
    if (galleryMode === "add") {
      setGalleryMode("edit");
    }
    setNotice("");
    setError("");
  };

  const uploadImageFromSystem = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/admin/upload", {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    const body = await toJson(response);

    if (response.status === 401) {
      return { unauthorized: true };
    }

    if (!response.ok) {
      return { error: body.error || "Failed to upload image." };
    }

    return { url: body.url || "" };
  };

  const handleFeaturedCoverUpload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) {
      return;
    }

    setError("");
    setNotice("");
    setUploadingFeaturedCover(true);

    try {
      const result = await uploadImageFromSystem(file);

      if (result.unauthorized) {
        handleSessionExpired();
        return;
      }

      if (result.error) {
        setError(result.error);
        return;
      }

      setVehicleForm((previous) => ({
        ...previous,
        image: result.url,
      }));
      setNotice("Featured cover image uploaded.");
    } finally {
      setUploadingFeaturedCover(false);
    }
  };

  const handleFeaturedGalleryImageUpload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) {
      return;
    }

    setError("");
    setNotice("");
    setUploadingFeaturedGalleryImage(true);

    try {
      const result = await uploadImageFromSystem(file);

      if (result.unauthorized) {
        handleSessionExpired();
        return;
      }

      if (result.error) {
        setError(result.error);
        return;
      }

      setVehicleForm((previous) => {
        const existingImages = previous.imagesCsv
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);

        const nextImages = [...existingImages, result.url];

        return {
          ...previous,
          imagesCsv: nextImages.join(", "),
          image: previous.image.trim() || result.url,
        };
      });

      setNotice("Featured gallery image uploaded.");
    } finally {
      setUploadingFeaturedGalleryImage(false);
    }
  };

  const handleGalleryImageUpload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) {
      return;
    }

    setError("");
    setNotice("");
    setUploadingGalleryImage(true);

    try {
      const result = await uploadImageFromSystem(file);

      if (result.unauthorized) {
        handleSessionExpired();
        return;
      }

      if (result.error) {
        setError(result.error);
        return;
      }

      setGalleryForm((previous) => ({
        ...previous,
        imageUrl: result.url,
      }));
      setNotice("Gallery image uploaded.");
    } finally {
      setUploadingGalleryImage(false);
    }
  };

  const handleSaveVehicle = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");
    setSaving(true);

    try {
      if (vehicleMode === "delete") {
        if (!activeVehicleId) {
          setError("Select a vehicle first.");
          return;
        }

        const response = await fetch(`/api/admin/featured-vehicles/${activeVehicleId}`, {
          method: "DELETE",
          credentials: "include",
        });

        const body = await toJson(response);

        if (response.status === 401) {
          handleSessionExpired();
          return;
        }

        if (!response.ok) {
          setError(body.error || "Failed to delete vehicle.");
          return;
        }

        setNotice("Vehicle deleted and saved.");
        await loadAdminData();
        return;
      }

      let payload;
      try {
        payload = parseVehiclePayload(vehicleForm);
      } catch (parseError) {
        setError(parseError.message);
        return;
      }

      if (vehicleMode === "add") {
        const existingVehicle = payload.id
          ? vehicles.find((vehicle) => vehicle.id === payload.id)
          : null;

        if (existingVehicle) {
          const existingImages = Array.isArray(existingVehicle.images)
            ? existingVehicle.images.map((item) => String(item || "").trim()).filter(Boolean)
            : [];
          const incomingImages = Array.isArray(payload.images)
            ? payload.images.map((item) => String(item || "").trim()).filter(Boolean)
            : [];

          const mergedImages = [...existingImages, ...incomingImages];
          const dedupedImages = [...new Set(mergedImages)];
          const coverImage = payload.image
            || incomingImages[0]
            || existingVehicle.image
            || dedupedImages[0]
            || "";

          const hasIncomingSpecs = payload.specs && Object.keys(payload.specs).length > 0;

          const mergedPayload = {
            id: existingVehicle.id,
            name: payload.name || existingVehicle.name || "",
            category: payload.category || existingVehicle.category || "",
            price: payload.price || existingVehicle.price || "",
            description: payload.description || existingVehicle.description || "",
            image: coverImage,
            fullDescription: payload.fullDescription || existingVehicle.fullDescription || "",
            order: Number.isFinite(Number(payload.order))
              ? Number(payload.order)
              : Number(existingVehicle.order || 0),
            images: dedupedImages,
            features: payload.features.length > 0
              ? payload.features
              : Array.isArray(existingVehicle.features)
              ? existingVehicle.features
              : [],
            specs: hasIncomingSpecs
              ? payload.specs
              : existingVehicle.specs && typeof existingVehicle.specs === "object"
              ? existingVehicle.specs
              : {},
          };

          const updateResponse = await fetch(`/api/admin/featured-vehicles/${existingVehicle.id}`, {
            method: "PATCH",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(mergedPayload),
          });

          const updateBody = await toJson(updateResponse);

          if (updateResponse.status === 401) {
            handleSessionExpired();
            return;
          }

          if (!updateResponse.ok) {
            setError(updateBody.error || "Failed to append photos to vehicle.");
            return;
          }

          setNotice("Photos added to the existing vehicle and saved.");
          await loadAdminData({ selectVehicleId: existingVehicle.id });
          return;
        }

        const response = await fetch("/api/admin/featured-vehicles", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const body = await toJson(response);

        if (response.status === 401) {
          handleSessionExpired();
          return;
        }

        if (!response.ok) {
          setError(body.error || "Failed to add vehicle.");
          return;
        }

        setNotice("Vehicle added and saved. It will appear on the homepage.");
        await loadAdminData({ selectVehicleId: body.id || payload.id });
        return;
      }

      if (!activeVehicleId) {
        setError("Select a vehicle first.");
        return;
      }

      const response = await fetch(`/api/admin/featured-vehicles/${activeVehicleId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const body = await toJson(response);

      if (response.status === 401) {
        handleSessionExpired();
        return;
      }

      if (!response.ok) {
        setError(body.error || "Failed to update vehicle.");
        return;
      }

      setNotice("Vehicle edited and saved. Homepage is updated.");
      if (typeof window !== "undefined") {
        window.alert("Featured vehicle edit saved successfully.");
      }
      await loadAdminData({ selectVehicleId: activeVehicleId });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveGallery = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");
    setSaving(true);

    try {
      if (galleryMode === "delete") {
        if (!activeGalleryId) {
          setError("Select a gallery photo first.");
          return;
        }

        const response = await fetch(`/api/admin/gallery/${activeGalleryId}`, {
          method: "DELETE",
          credentials: "include",
        });

        const body = await toJson(response);

        if (response.status === 401) {
          handleSessionExpired();
          return;
        }

        if (!response.ok) {
          setError(body.error || "Failed to delete gallery photo.");
          return;
        }

        setNotice("Gallery photo deleted and saved.");
        await loadAdminData();
        return;
      }

      const payload = parseGalleryPayload(galleryForm);

      if (galleryMode === "add") {
        const response = await fetch("/api/admin/gallery", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const body = await toJson(response);

        if (response.status === 401) {
          handleSessionExpired();
          return;
        }

        if (!response.ok) {
          setError(body.error || "Failed to add gallery photo.");
          return;
        }

        setNotice("Gallery photo added and saved. It will appear on the homepage.");
        await loadAdminData({ selectGalleryId: body.id || payload.id });
        return;
      }

      if (!activeGalleryId) {
        setError("Select a gallery photo first.");
        return;
      }

      const response = await fetch(`/api/admin/gallery/${activeGalleryId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const body = await toJson(response);

      if (response.status === 401) {
        handleSessionExpired();
        return;
      }

      if (!response.ok) {
        setError(body.error || "Failed to update gallery photo.");
        return;
      }

      setNotice("Gallery photo edited and saved. Homepage is updated.");
      if (typeof window !== "undefined") {
        window.alert("Gallery photo edit saved successfully.");
      }
      await loadAdminData({ selectGalleryId: activeGalleryId });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAllVehicles = async () => {
    setError("");
    setNotice("");

    const confirmed = window.confirm("Delete all featured vehicles?");
    if (!confirmed) {
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/admin/featured-vehicles", {
        method: "DELETE",
        credentials: "include",
      });
      const body = await toJson(response);

      if (response.status === 401) {
        handleSessionExpired();
        return;
      }

      if (!response.ok) {
        setError(body.error || "Failed to delete all featured vehicles.");
        return;
      }

      setActiveVehicleId("");
      setVehicleForm(initialVehicleForm);
      setVehicleMode("edit");
      setNotice(`Deleted ${body.deletedCount ?? 0} featured vehicles.`);
      await loadAdminData();
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAllGallery = async () => {
    setError("");
    setNotice("");

    const confirmed = window.confirm("Delete all gallery photos?");
    if (!confirmed) {
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/admin/gallery", {
        method: "DELETE",
        credentials: "include",
      });
      const body = await toJson(response);

      if (response.status === 401) {
        handleSessionExpired();
        return;
      }

      if (!response.ok) {
        setError(body.error || "Failed to delete all gallery photos.");
        return;
      }

      setActiveGalleryId("");
      setGalleryForm(initialGalleryForm);
      setGalleryMode("edit");
      setNotice(`Deleted ${body.deletedCount ?? 0} gallery photos.`);
      await loadAdminData();
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <p className="text-lg">Loading admin data...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
        <div className="flex items-center justify-between border-b border-white/10 pb-5">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-amber-300">Admin Panel</p>
            <h1 className="mt-2 text-3xl font-bold text-white">Content Management</h1>
          </div>
          <Link
            href="/"
            className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-zinc-200 hover:border-amber-300 hover:text-amber-200"
          >
            Back to Homepage
          </Link>
        </div>

        {adminProfile && (
          <section className="mt-6 rounded-2xl border border-amber-300/25 bg-amber-400/5 p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-amber-300">Admin Profile</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">{adminProfile.name || "Admin"}</h2>
            <div className="mt-3 grid gap-2 text-sm text-zinc-200 sm:grid-cols-2">
              <p><span className="text-zinc-400">Email:</span> {adminProfile.email || "-"}</p>
              <p><span className="text-zinc-400">Role:</span> {adminProfile.role || "admin"}</p>
            </div>
          </section>
        )}

        {error && (
          <div className="mt-6 rounded-xl border border-red-300/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {notice && (
          <div className="mt-6 rounded-xl border border-emerald-300/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            {notice}
          </div>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-white/10 bg-black/25 p-5">
            <h2 className="text-xl font-semibold text-white">Featured Vehicles</h2>
            <p className="mt-1 text-sm text-zinc-300">Choose mode, update fields, then click Save.</p>

            <button
              type="button"
              onClick={handleDeleteAllVehicles}
              disabled={saving || vehicles.length === 0}
              className="mt-4 rounded-full border border-red-300/40 bg-red-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-red-200 hover:border-red-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Delete All Featured Vehicles
            </button>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                className={modeButtonClass(vehicleMode === "add")}
                onClick={() => {
                  setVehicleMode("add");
                  setActiveVehicleId("");
                  setVehicleForm(initialVehicleForm);
                  setError("");
                  setNotice("");
                }}
              >
                Add Vehicle
              </button>
              <button
                type="button"
                className={modeButtonClass(vehicleMode === "edit")}
                onClick={() => {
                  setVehicleMode("edit");
                  if (activeVehicle) {
                    setVehicleForm(toVehicleForm(activeVehicle));
                  }
                  setError("");
                  setNotice("");
                }}
              >
                Edit Vehicle
              </button>
              <button
                type="button"
                className={modeButtonClass(vehicleMode === "delete")}
                onClick={() => {
                  setVehicleMode("delete");
                  if (activeVehicle) {
                    setVehicleForm(toVehicleForm(activeVehicle));
                  }
                  setError("");
                  setNotice("");
                }}
              >
                Delete Vehicle
              </button>
            </div>

            <div className="mt-4 mb-6 space-y-2 max-h-52 overflow-auto pr-1">
              {vehicles.map((vehicle) => (
                <button
                  key={vehicle.id}
                  type="button"
                  onClick={() => handleVehicleSelect(vehicle.id)}
                  className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${
                    vehicle.id === activeVehicleId
                      ? "border-amber-300 bg-amber-400/10 text-amber-100"
                      : "border-white/10 bg-white/5 text-zinc-200 hover:border-white/25"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold">{vehicle.name}</span>
                    <span className="text-xs text-zinc-300">{vehicle.id}</span>
                  </div>
                </button>
              ))}
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Details</p>
            </div>

            <form className="mt-3 space-y-3" onSubmit={handleSaveVehicle}>
              <input
                value={vehicleForm.id}
                onChange={(event) => setVehicleForm((previous) => ({ ...previous, id: event.target.value }))}
                placeholder="Vehicle ID"
                className="w-full rounded-lg border border-white/15 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-amber-300"
                disabled={vehicleMode !== "add"}
              />
              <input
                value={vehicleForm.name}
                onChange={(event) => setVehicleForm((previous) => ({ ...previous, name: event.target.value }))}
                placeholder="Name"
                className="w-full rounded-lg border border-white/15 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-amber-300"
              />
              <input
                value={vehicleForm.category}
                onChange={(event) => setVehicleForm((previous) => ({ ...previous, category: event.target.value }))}
                placeholder="Category"
                className="w-full rounded-lg border border-white/15 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-amber-300"
              />
              <input
                value={vehicleForm.price}
                onChange={(event) => setVehicleForm((previous) => ({ ...previous, price: event.target.value }))}
                placeholder="Price"
                className="w-full rounded-lg border border-white/15 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-amber-300"
              />
              <input
                value={vehicleForm.image}
                onChange={(event) => setVehicleForm((previous) => ({ ...previous, image: event.target.value }))}
                placeholder="Cover Image URL"
                className="w-full rounded-lg border border-white/15 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-amber-300"
              />
              <div className="rounded-xl border border-amber-300/30 bg-linear-to-br from-amber-400/10 via-white/5 to-transparent px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                <label className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-200/90">
                  Upload Cover Image From System
                </label>
                <p className="mt-1 text-xs text-zinc-400">JPG, PNG, WEBP, AVIF, or GIF (max 8MB)</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFeaturedCoverUpload}
                  disabled={saving || uploadingFeaturedCover}
                  className="mt-3 block w-full rounded-lg border border-white/15 bg-black/20 px-2 py-2 text-xs text-zinc-200 transition file:mr-3 file:rounded-full file:border file:border-amber-300/60 file:bg-amber-400/20 file:px-4 file:py-1.5 file:text-xs file:font-semibold file:uppercase file:tracking-[0.08em] file:text-amber-100 hover:border-amber-300/40 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
              <textarea
                value={vehicleForm.description}
                onChange={(event) => setVehicleForm((previous) => ({ ...previous, description: event.target.value }))}
                placeholder="Short description"
                rows={3}
                className="w-full rounded-lg border border-white/15 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-amber-300"
              />
              <textarea
                value={vehicleForm.fullDescription}
                onChange={(event) => setVehicleForm((previous) => ({ ...previous, fullDescription: event.target.value }))}
                placeholder="Full description"
                rows={4}
                className="w-full rounded-lg border border-white/15 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-amber-300"
              />
              <input
                value={vehicleForm.imagesCsv}
                onChange={(event) => setVehicleForm((previous) => ({ ...previous, imagesCsv: event.target.value }))}
                placeholder="Gallery images (comma separated URLs)"
                className="w-full rounded-lg border border-white/15 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-amber-300"
              />
              <div className="rounded-xl border border-amber-300/30 bg-linear-to-br from-amber-400/10 via-white/5 to-transparent px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                <label className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-200/90">
                  Upload Gallery Image For This Vehicle
                </label>
                <p className="mt-1 text-xs text-zinc-400">Uploaded image URL is appended automatically.</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFeaturedGalleryImageUpload}
                  disabled={saving || uploadingFeaturedGalleryImage}
                  className="mt-3 block w-full rounded-lg border border-white/15 bg-black/20 px-2 py-2 text-xs text-zinc-200 transition file:mr-3 file:rounded-full file:border file:border-amber-300/60 file:bg-amber-400/20 file:px-4 file:py-1.5 file:text-xs file:font-semibold file:uppercase file:tracking-[0.08em] file:text-amber-100 hover:border-amber-300/40 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
              <input
                value={vehicleForm.featuresCsv}
                onChange={(event) => setVehicleForm((previous) => ({ ...previous, featuresCsv: event.target.value }))}
                placeholder="Features (comma separated)"
                className="w-full rounded-lg border border-white/15 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-amber-300"
              />
              <textarea
                value={vehicleForm.specsJson}
                onChange={(event) => setVehicleForm((previous) => ({ ...previous, specsJson: event.target.value }))}
                placeholder='Specs JSON, example: {"engine":"3.0L"}'
                rows={5}
                className="w-full rounded-lg border border-white/15 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-amber-300"
              />
              <input
                type="number"
                value={vehicleForm.order}
                onChange={(event) => setVehicleForm((previous) => ({ ...previous, order: event.target.value }))}
                placeholder="Order"
                className="w-full rounded-lg border border-white/15 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-amber-300"
              />
              {vehicleMode === "delete" && (
                <p className="rounded-lg border border-red-300/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                  Deletion is pending. Click Save Changes to permanently delete the selected vehicle.
                </p>
              )}
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="submit"
                  disabled={saving || (vehicleMode !== "add" && !activeVehicleId)}
                  className="rounded-full bg-amber-400 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : vehicleMode === "add"
                    ? "Save Add"
                    : vehicleMode === "delete"
                    ? "Save Delete"
                    : "Save Edit"}
                </button>
              </div>
            </form>
          </section>

          <section className="rounded-3xl border border-white/10 bg-black/25 p-5">
            <h2 className="text-xl font-semibold text-white">Gallery Photos</h2>
            <p className="mt-1 text-sm text-zinc-300">Choose mode, update fields, then click Save.</p>

            <button
              type="button"
              onClick={handleDeleteAllGallery}
              disabled={saving || gallery.length === 0}
              className="mt-4 rounded-full border border-red-300/40 bg-red-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-red-200 hover:border-red-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Delete All Gallery Photos
            </button>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                className={modeButtonClass(galleryMode === "add")}
                onClick={() => {
                  setGalleryMode("add");
                  setActiveGalleryId("");
                  setGalleryForm(initialGalleryForm);
                  setError("");
                  setNotice("");
                }}
              >
                Add Photo
              </button>
              <button
                type="button"
                className={modeButtonClass(galleryMode === "edit")}
                onClick={() => {
                  setGalleryMode("edit");
                  if (activeGallery) {
                    setGalleryForm(toGalleryForm(activeGallery));
                  }
                  setError("");
                  setNotice("");
                }}
              >
                Edit Photo
              </button>
              <button
                type="button"
                className={modeButtonClass(galleryMode === "delete")}
                onClick={() => {
                  setGalleryMode("delete");
                  if (activeGallery) {
                    setGalleryForm(toGalleryForm(activeGallery));
                  }
                  setError("");
                  setNotice("");
                }}
              >
                Delete Photo
              </button>
            </div>

            <div className="mt-4 mb-6 space-y-2 max-h-52 overflow-auto pr-1">
              {gallery.map((photo) => (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => handleGallerySelect(photo.id)}
                  className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${
                    photo.id === activeGalleryId
                      ? "border-amber-300 bg-amber-400/10 text-amber-100"
                      : "border-white/10 bg-white/5 text-zinc-200 hover:border-white/25"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold">{photo.title || photo.id}</span>
                    <span className="text-xs text-zinc-300">{photo.id}</span>
                  </div>
                </button>
              ))}
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Details</p>
            </div>

            <form className="mt-3 space-y-3" onSubmit={handleSaveGallery}>
              <input
                value={galleryForm.id}
                onChange={(event) => setGalleryForm((previous) => ({ ...previous, id: event.target.value }))}
                placeholder="Photo ID"
                className="w-full rounded-lg border border-white/15 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-amber-300"
                disabled={galleryMode !== "add"}
              />
              <input
                value={galleryForm.title}
                onChange={(event) => setGalleryForm((previous) => ({ ...previous, title: event.target.value }))}
                placeholder="Title"
                className="w-full rounded-lg border border-white/15 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-amber-300"
              />
              <input
                value={galleryForm.imageUrl}
                onChange={(event) => setGalleryForm((previous) => ({ ...previous, imageUrl: event.target.value }))}
                placeholder="Image URL"
                className="w-full rounded-lg border border-white/15 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-amber-300"
              />
              <div className="rounded-xl border border-amber-300/30 bg-linear-to-br from-amber-400/10 via-white/5 to-transparent px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                <label className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-200/90">
                  Upload Gallery Image From System
                </label>
                <p className="mt-1 text-xs text-zinc-400">Use high-quality images for homepage gallery display.</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleGalleryImageUpload}
                  disabled={saving || uploadingGalleryImage}
                  className="mt-3 block w-full rounded-lg border border-white/15 bg-black/20 px-2 py-2 text-xs text-zinc-200 transition file:mr-3 file:rounded-full file:border file:border-amber-300/60 file:bg-amber-400/20 file:px-4 file:py-1.5 file:text-xs file:font-semibold file:uppercase file:tracking-[0.08em] file:text-amber-100 hover:border-amber-300/40 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
              <input
                type="number"
                value={galleryForm.order}
                onChange={(event) => setGalleryForm((previous) => ({ ...previous, order: event.target.value }))}
                placeholder="Order"
                className="w-full rounded-lg border border-white/15 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-amber-300"
              />
              {activeGallery?.imageUrl && (
                <img
                  src={activeGallery.imageUrl}
                  alt={activeGallery.title || activeGallery.id}
                  className="h-32 w-full rounded-xl border border-white/10 object-cover"
                />
              )}
              {galleryMode === "delete" && (
                <p className="rounded-lg border border-red-300/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                  Deletion is pending. Click Save Changes to permanently delete the selected photo.
                </p>
              )}
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="submit"
                  disabled={saving || (galleryMode !== "add" && !activeGalleryId)}
                  className="rounded-full bg-amber-400 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : galleryMode === "add"
                    ? "Save Add"
                    : galleryMode === "delete"
                    ? "Save Delete"
                    : "Save Edit"}
                </button>
              </div>
            </form>
          </section>
        </div>

        <p className="mt-6 text-xs text-zinc-400">
          After clicking Save, data is persisted to the database. Homepage and product pages will reflect updates on refresh or re-open.
        </p>
      </div>
    </main>
  );
}
