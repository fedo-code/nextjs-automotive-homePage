import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Missing MONGODB_URI environment variable.");
}

const globalWithMongoose = global;

let cachedConnection = globalWithMongoose._mongooseConnection;
let cachedPromise = globalWithMongoose._mongoosePromise;

export default async function connectMongoose() {
  if (cachedConnection) {
    return cachedConnection;
  }

  if (!cachedPromise) {
    cachedPromise = mongoose
      .connect(uri, {
        dbName: process.env.MONGODB_DB || "veichle_homepage",
      })
      .then((connection) => {
        cachedConnection = connection;
        globalWithMongoose._mongooseConnection = connection;
        return connection;
      })
      .catch((error) => {
        cachedPromise = undefined;
        globalWithMongoose._mongoosePromise = undefined;
        throw error;
      });

    globalWithMongoose._mongoosePromise = cachedPromise;
  }

  return cachedPromise;
}
