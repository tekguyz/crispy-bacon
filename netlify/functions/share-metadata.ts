import { createClient } from '@supabase/supabase-js';

export const handler = async (event: any) => {
  const slug = event.queryStringParameters?.slug;
  if (!slug) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: "Missing required slug parameter." })
    };
  }

  // Supabase Configuration Check
  const supabaseUrl = process.env.VITE_SUPABASE_DATABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: "System Configuration Error: Supabase credentials missing." })
    };
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data: insight, error } = await supabase
    .from('shared_links')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !insight) {
    return {
      statusCode: 404,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: "Shared note not found or has expired." })
    };
  }

  // Return standard JSON representation
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      slug: insight.slug,
      title: insight.title || 'Untitled',
      summary: insight.summary || '',
      highlights: insight.highlights || [],
      action_items: insight.action_items || [],
      tone: insight.sentiment || 'NEUTRAL',
      site_name: insight.site_name || 'Crispy Bacon',
      audio_url: insight.audio_url,
      created_at: insight.created_at,
      expires_at: insight.expires_at,
      is_collaborative: !!insight.is_collaborative,
      completed_indices: insight.completed_indices || []
    })
  };
};
