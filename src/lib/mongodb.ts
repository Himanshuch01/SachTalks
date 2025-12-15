interface MongoDBResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

const API_BASE_URL = import.meta.env.VITE_MONGODB_API_URL as string | undefined;

async function callMongo<T = unknown>(body: Record<string, unknown>): Promise<MongoDBResponse<T>> {
  if (!API_BASE_URL) {
    throw new Error("VITE_MONGODB_API_URL is not configured");
  }

  const res = await fetch(`${API_BASE_URL}/mongodb-api`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `MongoDB API request failed with status ${res.status}`);
  }

  return (await res.json()) as MongoDBResponse<T>;
}

export const mongodb = {
  async find<T = unknown>(collection: string, query: Record<string, unknown> = {}, options?: Record<string, unknown>): Promise<T[]> {
    const data = await callMongo<T[]>({ action: "find", collection, query, options });
    if (!data?.success) throw new Error(data?.error || "Unknown error");
    return data.data || [];
  },

  async findOne<T = unknown>(collection: string, query: Record<string, unknown> = {}): Promise<T | null> {
    const data = await callMongo<T>({ action: "findOne", collection, query });
    if (!data?.success) throw new Error(data?.error || "Unknown error");
    return data.data || null;
  },

  async insertOne<T = unknown>(collection: string, document: Record<string, unknown>): Promise<T> {
    const data = await callMongo<T>({ action: "insertOne", collection, data: document });
    if (!data?.success) throw new Error(data?.error || "Unknown error");
    return data.data as T;
  },

  async updateOne(collection: string, query: Record<string, unknown>, update: Record<string, unknown>, options?: Record<string, unknown>) {
    const data = await callMongo({ action: "updateOne", collection, query, data: update, options });
    if (!data?.success) throw new Error(data?.error || "Unknown error");
    return data.data;
  },

  async deleteOne(collection: string, query: Record<string, unknown>) {
    const data = await callMongo({ action: "deleteOne", collection, query });
    if (!data?.success) throw new Error(data?.error || "Unknown error");
    return data.data;
  },

  async count(collection: string, query: Record<string, unknown> = {}): Promise<number> {
    const data = await callMongo<number>({ action: "count", collection, query });
    if (!data?.success) throw new Error(data?.error || "Unknown error");
    return data.data || 0;
  }
};
