import { mongodb } from "@/lib/mongodb";

export interface ContactSubmission {
  _id?: { $oid: string };
  id?: string;
  name: string;
  mobile: string;
  email: string;
  address?: string | null;
  message: string;
  read?: boolean;
  createdAt?: string;
  created_at?: string;
}

const COLLECTION = "contact_submissions";

/**
 * Extracts the ID from a MongoDB document in various formats
 */
function extractId(doc: any): string | undefined {
  if (doc.id) {
    return String(doc.id);
  }
  
  if (doc._id) {
    if (typeof doc._id === 'string') {
      return doc._id;
    } else if (doc._id.$oid) {
      return String(doc._id.$oid);
    } else if (typeof doc._id.toString === 'function') {
      return doc._id.toString();
    } else {
      return String(doc._id);
    }
  }
  
  return undefined;
}

function mapContact(doc: any): ContactSubmission {
  const createdAt = doc.created_at || doc.createdAt || new Date().toISOString();
  const id = extractId(doc);

  return {
    ...doc,
    id: id,
    created_at: createdAt,
    read: doc.read || false,
  };
}

/**
 * Save a contact form submission
 */
export async function createContactSubmission(data: {
  name: string;
  mobile: string;
  email: string;
  address?: string | null;
  message: string;
}): Promise<ContactSubmission> {
  const now = new Date().toISOString();
  const docToInsert = {
    ...data,
    read: false,
    createdAt: now,
  };

  const inserted = await mongodb.insertOne<ContactSubmission>(COLLECTION, docToInsert);
  return mapContact({ ...docToInsert, ...inserted });
}

/**
 * Get all contact submissions (for admin)
 */
export async function getAllContactSubmissions(): Promise<ContactSubmission[]> {
  const docs = await mongodb.find<ContactSubmission>(
    COLLECTION,
    {},
    { sort: { createdAt: -1 } }
  );
  return docs.map(mapContact);
}

/**
 * Get unread contact submissions count (for admin)
 */
export async function getUnreadCount(): Promise<number> {
  const count = await mongodb.count(COLLECTION, { read: { $ne: true } });
  return count;
}

/**
 * Mark a submission as read
 */
export async function markAsRead(id: string): Promise<void> {
  const result = await mongodb.updateOne(
    COLLECTION,
    { _id: { $oid: id } },
    { read: true }
  );
  
  if (result && typeof result === 'object') {
    const updateResult = result as { matchedCount?: number };
    if (updateResult.matchedCount === 0) {
      throw new Error(`Contact submission with id ${id} was not found`);
    }
  }
}

/**
 * Mark a submission as unread
 */
export async function markAsUnread(id: string): Promise<void> {
  const result = await mongodb.updateOne(
    COLLECTION,
    { _id: { $oid: id } },
    { read: false }
  );
  
  if (result && typeof result === 'object') {
    const updateResult = result as { matchedCount?: number };
    if (updateResult.matchedCount === 0) {
      throw new Error(`Contact submission with id ${id} was not found`);
    }
  }
}

/**
 * Delete a contact submission
 */
export async function deleteContactSubmission(id: string): Promise<void> {
  const result = await mongodb.deleteOne(COLLECTION, { _id: { $oid: id } });
  
  if (result && typeof result === 'object') {
    const deleteResult = result as { deletedCount?: number; acknowledged?: boolean };
    if (deleteResult.deletedCount === 0) {
      throw new Error(`Contact submission with id ${id} was not found or already deleted`);
    }
    if (deleteResult.acknowledged === false) {
      throw new Error(`Delete operation was not acknowledged by MongoDB`);
    }
  }
}
