import "dotenv/config";
import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";

// This file implements the single backend entry point for MongoDB access.
// It enforces the API contract the frontend expects and keeps all DB logic on the server.

const app = express();
const port = process.env.PORT || 4000;

// CORS is enabled so the Vite frontend (localhost:8080 or your domain) can call this API.
app.use(
  cors({
    origin: "*", // In production, restrict to your real frontend origin.
  })
);

// Parse JSON request bodies.
app.use(express.json());

const mongoUri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

if (!mongoUri) {
  console.warn("MONGODB_URI is not set. Backend will fail to handle DB requests.");
}

if (!dbName) {
  console.warn("DB_NAME is not set. Backend will fail to handle DB requests.");
}

// Reuse a single MongoClient across requests to avoid connection overhead.
let cachedClient: MongoClient | null = null;

async function getDb() {
  if (!mongoUri || !dbName) {
    throw new Error("MONGODB_URI or DB_NAME is not configured");
  }

  if (!cachedClient) {
    cachedClient = new MongoClient(mongoUri);
    await cachedClient.connect();
  }

  return cachedClient.db(dbName);
}

// Shared response shape for all MongoDB operations.
interface MongoRequestBody {
  action: "find" | "findOne" | "insertOne" | "updateOne" | "deleteOne" | "count";
  collection: string;
  query?: Record<string, unknown>;
  data?: Record<string, unknown>;
  options?: Record<string, unknown>;
}

// Helper to convert any string `_id` in the query into a real ObjectId.
function normalizeIdInQuery(query: any): any {
  // If query is not an object, return as is.
  if (!query || typeof query !== "object") return query;

  const cloned: any = Array.isArray(query) ? [...query] : { ...query };

  // If query has a top-level _id as a string, convert it.
  if (cloned._id && typeof cloned._id === "string") {
    cloned._id = new ObjectId(cloned._id);
  }

  // If we receive Mongo-style `{ _id: { $oid: "..." } }` from the frontend, normalize that too.
  if (cloned._id && typeof cloned._id === "object" && typeof cloned._id.$oid === "string") {
    cloned._id = new ObjectId(cloned._id.$oid);
  }

  return cloned;
}

// Single MongoDB API endpoint that supports all required actions.
app.post("/mongodb-api", async (req, res) => {
  const body = req.body as MongoRequestBody;

  // Validate basic shape early to return clear errors.
  if (!body || !body.action || !body.collection) {
    return res.status(400).json({
      success: false,
      error: "Missing required fields: action, collection",
    });
  }

  try {
    const db = await getDb();
    const collection = db.collection(body.collection);
    const query = normalizeIdInQuery(body.query || {});
    const options = body.options || {};

    let result: unknown;

    switch (body.action) {
      case "find":
        // Find returns an array of documents matching the query.
        result = await collection.find(query, options).toArray();
        break;

      case "findOne":
        // Returns a single matching document or null.
        result = await collection.findOne(query, options);
        break;

      case "insertOne":
        // Inserts a single document and returns the inserted id plus original data.
        if (!body.data) throw new Error("Missing data for insertOne");
        const insertOneResult = await collection.insertOne(body.data);
        result = {
          _id: insertOneResult.insertedId,
          ...body.data,
        };
        break;

      case "updateOne":
        // Updates a single document matching query using $set and returns the raw result.
        if (!body.data) throw new Error("Missing data for updateOne");
        result = await collection.updateOne(query, { $set: body.data }, options);
        break;

      case "deleteOne":
        // Deletes a single document matching query and returns the raw result.
        result = await collection.deleteOne(query, options);
        break;

      case "count":
        // Counts documents matching query.
        result = await collection.countDocuments(query, options);
        break;

      default:
        return res.status(400).json({
          success: false,
          error: `Unknown action: ${body.action}`,
        });
    }

    return res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("MongoDB API error:", error);
    return res.status(500).json({
      success: false,
      error: error?.message || "Internal server error",
    });
  }
});

// Basic health check endpoint to quickly verify the server is running.
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`MongoDB API server listening on port ${port}`);
});


