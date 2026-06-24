import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

export const handler = async (event: any) => {
  // Extract slug
  const slug = event.queryStringParameters?.slug;
  if (!slug) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8'
      },
      body: "Bad Request: Missing slug parameter"
    };
  }

  // Supabase connection
  const supabaseUrl = process.env.VITE_SUPABASE_DATABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8'
      },
      body: "Internal Server Error: Database configuration missing"
    };
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data: insight, error } = await supabase
    .from('shared_links')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !insight) {
    console.error("[SEO-Engine] Share link lookup failed for slug:", slug, error);
    return {
      statusCode: 404,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8'
      },
      body: `Shared link "${slug}" not found or has expired.`
    };
  }

  // Read index.html compiled template from disk
  let html = '';
  const possiblePaths = [
    path.join(process.cwd(), 'dist/index.html'),
    path.join(process.cwd(), 'index.html'),
    path.join(__dirname, 'dist/index.html'),
    path.join(__dirname, '../dist/index.html'),
    path.join(__dirname, '../../dist/index.html'),
  ];

  for (const p of possiblePaths) {
    try {
      if (fs.existsSync(p)) {
        html = fs.readFileSync(p, 'utf-8');
        break;
      }
    } catch (e) {
      console.warn("[SEO-Engine] Skipped index.html location:", p);
    }
  }

  if (!html) {
    // Return a robust, clean default fallback shell which loads the React apps anyway
    console.error("[SEO-Engine] Could not locate fallback template on filesystem.");
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8'
      },
      body: "System initialization pending. Please reload shortly."
    };
  }

  // Pre-process presentation fields
  const pageTitle = `${insight.title || 'Research Note'} | Crispy Bacon Preview`;
  const baseSummary = insight.summary || 'Shared secure research partner intelligence note.';
  
  // Format key takeaways list as summary text
  let dynamicDetails = '';
  if (insight.highlights && Array.isArray(insight.highlights) && insight.highlights.length > 0) {
    dynamicDetails += ' | Highlights: ' + insight.highlights.slice(0, 3).map((item: string) => `• ${item}`).join(' ');
  }
  
  if (insight.action_items && Array.isArray(insight.action_items) && insight.action_items.length > 0) {
    dynamicDetails += ' | Actions: ' + insight.action_items.slice(0, 3).map((item: string) => `[ ] ${item}`).join(' ');
  }

  const cleanDescription = (baseSummary + dynamicDetails).replace(/[\r\n]+/g, ' ').substring(0, 280).trim() + '...';

  // Social Preview Images
  const ogImage = `https://crispy-bacon.netlify.app/favicon.svg`; 

  // Dynamically substitute metadata tags
  html = html.replace(/<title>.*?<\/title>/gi, `<title>${pageTitle}</title>`);
  
  // Replace standard description tag if present, or add it
  if (html.includes('name="description"')) {
    html = html.replace(/<meta name="description" content=".*?"\/?>/gi, `<meta name="description" content="${cleanDescription}">`);
  } else {
    html = html.replace('</head>', `<meta name="description" content="${cleanDescription}">\n</head>`);
  }

  // Inject beautiful M3-styled dynamic OG-graph parameters right before </head>
  const ogMetaTags = `
    <!-- Dynamic Social Graph Matrix (M3 Engineered) -->
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${pageTitle.replace(/"/g, '&quot;')}" />
    <meta property="og:description" content="${cleanDescription.replace(/"/g, '&quot;')}" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:url" content="https://crispy-bacon.netlify.app/share/${slug}" />
    <meta property="og:site_name" content="Crispy Bacon" />
    <meta property="article:published_time" content="${insight.created_at || new Date().toISOString()}" />

    <!-- Twitter Platform Metas -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${pageTitle.replace(/"/g, '&quot;')}" />
    <meta name="twitter:description" content="${cleanDescription.replace(/"/g, '&quot;')}" />
    <meta name="twitter:image" content="${ogImage}" />
    <meta name="twitter:site" content="@crispybacon" />
  `;

  html = html.replace('</head>', `${ogMetaTags}\n</head>`);

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8'
    },
    body: html
  };
};
