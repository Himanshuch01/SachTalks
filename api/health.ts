// Simple health check for Vercel serverless.
// Useful for uptime checks and debugging environment configuration.

export default async function handler(_req: any, res: any) {
  return res.status(200).json({ status: "ok" });
}


