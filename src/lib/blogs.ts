import { mongodb } from "@/lib/mongodb";

export interface Blog {
  _id?: { $oid: string };
  id?: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  image_url?: string | null;
  category?: string | null;
  published: boolean;
  // Soft-delete flag so removed blogs stay out of the site
  deleted?: boolean;
  createdAt?: string;
  created_at?: string;
}

const COLLECTION = "blogs";

function mapBlog(doc: any): Blog {
  const createdAt = doc.created_at || doc.createdAt || new Date().toISOString();

  return {
    ...doc,
    id: doc._id?.$oid || doc.id,
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
  await mongodb.updateOne(
    COLLECTION,
    { _id: { $oid: id } },
    {
      ...data,
    }
  );
}

export async function deleteBlog(id: string): Promise<void> {
  await mongodb.deleteOne(COLLECTION, { _id: { $oid: id } });
}


