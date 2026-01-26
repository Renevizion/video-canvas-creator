const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ success: false, error: 'URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!apiKey) {
      console.error('FIRECRAWL_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'Firecrawl connector not configured. Enable it in Settings → Connectors.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Format URL
    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    console.log('Extracting brand from URL:', formattedUrl);

    // Use Firecrawl's branding extraction
    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: formattedUrl,
        formats: ['branding', 'markdown', 'screenshot'],
        onlyMainContent: false,
        waitFor: 2000,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Firecrawl API error:', data);
      return new Response(
        JSON.stringify({ success: false, error: data.error || `Request failed with status ${response.status}` }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract brand data
    const branding = data.data?.branding || data.branding || {};
    const markdown = data.data?.markdown || data.markdown || '';
    const screenshot = data.data?.screenshot || data.screenshot || '';
    const metadata = data.data?.metadata || data.metadata || {};

    // Parse and structure the brand data
    const brandData = {
      success: true,
      domain: formattedUrl,
      title: metadata.title || '',
      description: metadata.description || '',
      colors: {
        primary: branding.colors?.primary || '#3b82f6',
        secondary: branding.colors?.secondary || '#1e293b',
        accent: branding.colors?.accent || '#06b6d4',
        background: branding.colors?.background || '#0f172a',
        text: branding.colors?.textPrimary || '#ffffff',
      },
      fonts: {
        primary: branding.typography?.fontFamilies?.primary || 'Inter',
        heading: branding.typography?.fontFamilies?.heading || 'Inter',
        code: branding.typography?.fontFamilies?.code || 'JetBrains Mono',
      },
      logo: branding.images?.logo || branding.logo || '',
      favicon: branding.images?.favicon || '',
      ogImage: branding.images?.ogImage || metadata.ogImage || '',
      screenshot,
      copywriting: extractKeyCopy(markdown),
      colorScheme: branding.colorScheme || 'dark',
    };

    console.log('Brand extraction successful:', brandData.title);

    return new Response(
      JSON.stringify(brandData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error extracting brand:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to extract brand';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Extract key copywriting from markdown
function extractKeyCopy(markdown: string): { headlines: string[]; taglines: string[]; ctas: string[] } {
  const lines = markdown.split('\n').filter(line => line.trim());
  
  const headlines: string[] = [];
  const taglines: string[] = [];
  const ctas: string[] = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Headlines (h1, h2)
    if (trimmed.startsWith('# ') || trimmed.startsWith('## ')) {
      const text = trimmed.replace(/^#+\s*/, '');
      if (text.length > 5 && text.length < 100) {
        headlines.push(text);
      }
    }
    
    // CTAs (common patterns)
    const ctaPatterns = /\b(get started|sign up|try|start|join|download|learn more|contact|book|schedule|buy now|subscribe)\b/i;
    if (ctaPatterns.test(trimmed) && trimmed.length < 50) {
      ctas.push(trimmed.replace(/[\[\]()]/g, '').trim());
    }
    
    // Taglines (short impactful sentences)
    if (!trimmed.startsWith('#') && trimmed.length > 20 && trimmed.length < 120) {
      if (trimmed.includes('.') || trimmed.includes('—') || trimmed.includes('|')) {
        taglines.push(trimmed);
      }
    }
  }
  
  return {
    headlines: headlines.slice(0, 5),
    taglines: taglines.slice(0, 3),
    ctas: [...new Set(ctas)].slice(0, 3),
  };
}
