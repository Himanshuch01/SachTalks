import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const YOUTUBE_API_KEY = Deno.env.get('YOUTUBE_API_KEY');
const CHANNEL_ID = 'UCQTJfE6cW4s3qVGg9UJiK5g'; // Sach Talks Official

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const maxResults = url.searchParams.get('maxResults') || '12';

    console.log('Fetching YouTube videos for channel:', CHANNEL_ID);

    // First get channel uploads playlist
    const channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${YOUTUBE_API_KEY}`
    );
    const channelData = await channelResponse.json();

    if (!channelData.items || channelData.items.length === 0) {
      console.error('Channel not found:', channelData);
      return new Response(
        JSON.stringify({ error: 'Channel not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;

    // Get videos from uploads playlist
    const videosResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${uploadsPlaylistId}&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}`
    );
    const videosData = await videosResponse.json();

    if (!videosData.items) {
      console.error('No videos found:', videosData);
      return new Response(
        JSON.stringify({ videos: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get video statistics
    const videoIds = videosData.items.map((item: any) => item.contentDetails.videoId).join(',');
    const statsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${videoIds}&key=${YOUTUBE_API_KEY}`
    );
    const statsData = await statsResponse.json();

    // Combine data
    const videos = videosData.items.map((item: any) => {
      const stats = statsData.items?.find((s: any) => s.id === item.contentDetails.videoId);
      const duration = stats?.contentDetails?.duration || 'PT0S';
      
      // Parse ISO 8601 duration
      const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
      const hours = parseInt(match?.[1] || '0');
      const minutes = parseInt(match?.[2] || '0');
      const seconds = parseInt(match?.[3] || '0');
      const formattedDuration = hours > 0 
        ? `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        : `${minutes}:${seconds.toString().padStart(2, '0')}`;

      // Format view count
      const viewCount = parseInt(stats?.statistics?.viewCount || '0');
      const formattedViews = viewCount >= 1000000 
        ? `${(viewCount / 1000000).toFixed(1)}M`
        : viewCount >= 1000 
          ? `${(viewCount / 1000).toFixed(0)}K`
          : viewCount.toString();

      // Format date
      const publishedAt = new Date(item.snippet.publishedAt);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - publishedAt.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      let formattedDate = '';
      if (diffDays < 1) formattedDate = 'Today';
      else if (diffDays === 1) formattedDate = 'Yesterday';
      else if (diffDays < 7) formattedDate = `${diffDays} days ago`;
      else if (diffDays < 30) formattedDate = `${Math.floor(diffDays / 7)} weeks ago`;
      else if (diffDays < 365) formattedDate = `${Math.floor(diffDays / 30)} months ago`;
      else formattedDate = `${Math.floor(diffDays / 365)} years ago`;

      return {
        id: item.contentDetails.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.maxres?.url || item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
        views: formattedViews,
        duration: formattedDuration,
        date: formattedDate,
        publishedAt: item.snippet.publishedAt,
      };
    });

    console.log(`Successfully fetched ${videos.length} videos`);

    return new Response(
      JSON.stringify({ videos }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
