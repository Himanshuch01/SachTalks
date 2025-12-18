import { mongodb } from "@/lib/mongodb";

export interface Blog {
  _id?: { $oid: string };
  id?: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  image_url?: string | null;
  // Optional inline image data (when admin uploads directly)
  image_data?: string | null;
  image_mime?: string | null;
  category?: string | null;
  published: boolean;
  // Soft-delete flag so removed blogs stay out of the site
  deleted?: boolean;
  createdAt?: string;
  created_at?: string;
}

const COLLECTION = "blogs";

/**
 * Extracts the ID from a MongoDB document in various formats
 */
function extractId(doc: any): string | undefined {
  // If id already exists, use it
  if (doc.id) {
    return String(doc.id);
  }
  
  // Handle _id in various formats
  if (doc._id) {
    if (typeof doc._id === 'string') {
      return doc._id;
    } else if (doc._id.$oid) {
      // BSON extended JSON format: { $oid: "..." }
      return String(doc._id.$oid);
    } else if (typeof doc._id.toString === 'function') {
      // ObjectId object: call toString()
      return doc._id.toString();
    } else {
      // Fallback: try to stringify
      return String(doc._id);
    }
  }
  
  return undefined;
}

function mapBlog(doc: any): Blog {
  const createdAt = doc.created_at || doc.createdAt || new Date().toISOString();
  const id = extractId(doc);

  if (!id) {
    console.warn("Blog document missing ID:", doc);
  }

  return {
    ...doc,
    id: id,
    created_at: createdAt,
  };
}

export async function getPublishedBlogs(limit?: number): Promise<Blog[]> {
  const options: Record<string, unknown> = {
    sort: { createdAt: -1 },
  };

  if (limit) {
    options.limit = limit;
  }

  // Only show blogs that are published and not soft-deleted
  const docs = await mongodb.find<Blog>(
    COLLECTION,
    { published: true, deleted: { $ne: true } },
    options
  );
  return docs.map(mapBlog);
}

export async function getAllBlogs(): Promise<Blog[]> {
  const docs = await mongodb.find<Blog>(COLLECTION, {}, { sort: { createdAt: -1 } });
  return docs.map(mapBlog);
}

export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  const doc = await mongodb.findOne<Blog>(COLLECTION, {
    slug,
    published: true,
    deleted: { $ne: true },
  });
  return doc ? mapBlog(doc) : null;
}

type BlogInput = Omit<Blog, "id" | "_id" | "createdAt" | "created_at">;

export async function createBlog(data: BlogInput): Promise<Blog> {
  const now = new Date().toISOString();
  const docToInsert = {
    ...data,
    createdAt: now,
  };

  const inserted = await mongodb.insertOne<Blog>(COLLECTION, docToInsert);
  return mapBlog({ ...docToInsert, ...inserted });
}

export async function updateBlog(id: string, data: Partial<Blog>): Promise<void> {
  // Ensure published field is explicitly set if provided
  const updateData: Record<string, unknown> = { ...data };
  
  // Explicitly handle published field to ensure it's set correctly
  if (data.published !== undefined) {
    updateData.published = data.published;
  }
  
  // Remove id/_id from update data as it shouldn't be updated
  delete updateData.id;
  delete updateData._id;
  
  const result = await mongodb.updateOne(
    COLLECTION,
    { _id: { $oid: id } },
    updateData
  );
  
  // Verify the update succeeded (MongoDB updateOne returns { acknowledged, modifiedCount, matchedCount })
  if (result && typeof result === 'object') {
    const updateResult = result as { modifiedCount?: number; matchedCount?: number; acknowledged?: boolean };
    // Check if the document was matched (exists)
    if (updateResult.matchedCount === 0) {
      throw new Error(`Blog with id ${id} was not found`);
    }
    // Note: modifiedCount can be 0 if the update didn't change any fields (same values)
    // This is acceptable, so we don't throw an error for modifiedCount === 0
  }
}

export async function deleteBlog(id: string): Promise<void> {
  const result = await mongodb.deleteOne(COLLECTION, { _id: { $oid: id } });
  
  // Verify the delete succeeded (MongoDB deleteOne returns { acknowledged, deletedCount })
  if (result && typeof result === 'object') {
    const deleteResult = result as { deletedCount?: number; acknowledged?: boolean };
    if (deleteResult.deletedCount === 0) {
      throw new Error(`Blog with id ${id} was not found or already deleted`);
    }
    // If acknowledged is false, the operation didn't complete
    if (deleteResult.acknowledged === false) {
      throw new Error(`Delete operation was not acknowledged by MongoDB`);
    }
  }
}


