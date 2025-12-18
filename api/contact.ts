// Serverless function for contact form submissions on Vercel

interface ContactRequestBody {
  name: string;
  mobile: string;
  email: string;
  address?: string | null;
  message: string;
}

interface SuccessResponse {
  success: true;
  message: string;
  id: string;
}

interface ErrorResponse {
  success: false;
  error: string;
}

export default async function handler(req: any, res: any) {
  // Only allow POST
  if (req.method && req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed. Use POST /api/contact" });
  }

  try {
    const body = req.body as ContactRequestBody;

    // Validate required fields
    if (!body.name || !body.mobile || !body.email || !body.message) {
      const errorResponse: ErrorResponse = {
        success: false,
        error: "Missing required fields: name, mobile, email, and message are required",
      };
      return res.status(400).json(errorResponse);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      const errorResponse: ErrorResponse = {
        success: false,
        error: "Invalid email address format",
      };
      return res.status(400).json(errorResponse);
    }

    // Validate mobile number (should be at least 10 digits)
    const mobileRegex = /^\+?[0-9]{10,15}$/;
    if (!mobileRegex.test(body.mobile.replace(/\s/g, ""))) {
      const errorResponse: ErrorResponse = {
        success: false,
        error: "Invalid mobile number format",
      };
      return res.status(400).json(errorResponse);
    }

    // Prepare submission data
    const submissionData = {
      name: body.name.trim(),
      mobile: body.mobile.trim(),
      email: body.email.trim().toLowerCase(),
      address: body.address?.trim() || null,
      message: body.message.trim(),
      read: false,
      createdAt: new Date().toISOString(),
    };

    // Use MongoDB directly (same pattern as other API routes)
    const { MongoClient, ObjectId } = await import("mongodb");
    const mongoUri = process.env.MONGODB_URI;
    const dbName = process.env.DB_NAME;

    if (!mongoUri || !dbName) {
      const errorResponse: ErrorResponse = {
        success: false,
        error: "MongoDB is not configured",
      };
      return res.status(500).json(errorResponse);
    }

    const client = await MongoClient.connect(mongoUri, {
      tls: true,
      serverSelectionTimeoutMS: 5000,
    });
    const db = client.db(dbName);
    const result = await db.collection("contact_submissions").insertOne(submissionData);
    await client.close();

    const insertedId = result.insertedId.toString();

    const successResponse: SuccessResponse = {
      success: true,
      message: "Your message has been received. We'll get back to you soon!",
      id: insertedId,
    };

    return res.status(200).json(successResponse);
  } catch (error) {
    console.error("Contact API server error:", error);
    const errorResponse: ErrorResponse = {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    };
    return res.status(500).json(errorResponse);
  }
}
