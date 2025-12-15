import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { MongoClient } from "https://deno.land/x/mongo@v0.32.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const mongoUri = Deno.env.get('MONGODB_URI');
  
  if (!mongoUri) {
    console.error('MONGODB_URI not configured');
    return new Response(
      JSON.stringify({ error: 'MongoDB connection not configured' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  let client: MongoClient | null = null;

  try {
    const { action, collection, data, query, options } = await req.json();
    
    console.log(`MongoDB API called with action: ${action}, collection: ${collection}`);

    client = new MongoClient();
    await client.connect(mongoUri);
    
    const db = client.database(); // Uses default database from connection string
    const coll = db.collection(collection);

    let result;

    switch (action) {
      case 'find':
        result = await coll.find(query || {}, options || {}).toArray();
        break;
      
      case 'findOne':
        result = await coll.findOne(query || {});
        break;
      
      case 'insertOne':
        result = await coll.insertOne(data);
        break;
      
      case 'insertMany':
        result = await coll.insertMany(data);
        break;
      
      case 'updateOne':
        result = await coll.updateOne(query, { $set: data }, options);
        break;
      
      case 'updateMany':
        result = await coll.updateMany(query, { $set: data }, options);
        break;
      
      case 'deleteOne':
        result = await coll.deleteOne(query);
        break;
      
      case 'deleteMany':
        result = await coll.deleteMany(query);
        break;
      
      case 'count':
        result = await coll.countDocuments(query || {});
        break;

      default:
        return new Response(
          JSON.stringify({ error: `Unknown action: ${action}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    console.log(`MongoDB ${action} completed successfully`);

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('MongoDB API error:', errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } finally {
    if (client) {
      try {
        client.close();
      } catch (e) {
        console.error('Error closing MongoDB connection:', e);
      }
    }
  }
});
