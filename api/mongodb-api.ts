import { MongoClient, ObjectId } from "mongodb";

// Vercel serverless function for MongoDB operations.
// This replaces any long-running Express server and is safe for serverless.

const mongoUri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

if (!mongoUri) {
  console.warn("MONGODB_URI is not set. /api/mongodb-api will fail until configured.");
}

if (!dbName) {
  console.warn("DB_NAME is not set. /api/mongodb-api will fail until configured.");
}

// In a serverless environment, we cache the client on the global object so
// subsequent invocations reuse the same connection instead of opening new ones.
let cachedClientPromise: Promise<MongoClient> | null = null;

async function getDb() {
  if (!mongoUri || !dbName) {
    throw new Error("MONGODB_URI or DB_NAME is not configured");
  }

  if (!cachedClientPromise) {
    cachedClientPromise = MongoClient.connect(mongoUri);
  }

  const client = await cachedClientPromise;
  return client.db(dbName);
}

interface MongoRequestBody {
  action: "find" | "findOne" | "insertOne" | "updateOne" | "deleteOne" | "count";
  collection: string;
  query?: Record<string, unknown>;
  data?: Record<string, unknown>;
  options?: Record<string, unknown>;
}

function normalizeIdInQuery(query: any): any {
  if (!query || typeof query !== "object") return query;

  const cloned: any = Array.isArray(query) ? [...query] : { ...query };

  if (cloned._id && typeof cloned._id === "string") {
    cloned._id = new ObjectId(cloned._id);
  }

  if (cloned._id && typeof cloned._id === "object" && typeof cloned._id.$oid === "string") {
    cloned._id = new ObjectId(cloned._id.$oid);
  }

  return cloned;
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const body = req.body as MongoRequestBody;

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
        result = await collection.find(query, options).toArray();
        break;
      case "findOne":
        result = await collection.findOne(query, options);
        break;
      case "insertOne":
        if (!body.data) throw new Error("Missing data for insertOne");
        const insertOneResult = await collection.insertOne(body.data);
        result = { _id: insertOneResult.insertedId, ...body.data };
        break;
      case "updateOne":
        if (!body.data) throw new Error("Missing data for updateOne");
        result = await collection.updateOne(query, { $set: body.data }, options);
        break;
      case "deleteOne":
        result = await collection.deleteOne(query, options);
        break;
      case "count":
        result = await collection.countDocuments(query, options);
        break;
      default:
        return res.status(400).json({
          success: false,
          error: `Unknown action: ${body.action}`,
        });
    }

    return res.status(200).json({
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
}


