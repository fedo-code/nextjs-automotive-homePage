import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Missing MONGODB_URI environment variable.");
}

const globalWithMongo = global;

let cachedClient = globalWithMongo._mongoClient;
let cachedPromise = globalWithMongo._mongoClientPromise;

export default async function getMongoClient() {
  if (cachedClient) {
    return cachedClient;
  }

  if (!cachedPromise) {
    const client = new MongoClient(uri);

    cachedPromise = client
      .connect()
      .then((connectedClient) => {
        cachedClient = connectedClient;
        globalWithMongo._mongoClient = connectedClient;
        return connectedClient;
      })
      .catch((error) => {
        cachedPromise = undefined;
        globalWithMongo._mongoClientPromise = undefined;
        throw error;
      });

    globalWithMongo._mongoClientPromise = cachedPromise;
  }

  return cachedPromise;
}


