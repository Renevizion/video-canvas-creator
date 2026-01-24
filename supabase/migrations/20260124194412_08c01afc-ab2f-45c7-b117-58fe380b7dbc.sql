-- Video patterns from analyzed references
CREATE TABLE public.video_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  pattern JSONB NOT NULL,
  thumbnail_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Video plans from user requests
CREATE TABLE public.video_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt TEXT NOT NULL,
  plan JSONB NOT NULL,
  generated_code TEXT,
  status TEXT DEFAULT 'pending',
  reference_pattern_id UUID REFERENCES public.video_patterns(id),
  preview_url TEXT,
  final_video_url TEXT,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Generated assets
CREATE TABLE public.generated_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID REFERENCES public.video_plans(id) ON DELETE CASCADE,
  requirement_id TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.video_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_assets ENABLE ROW LEVEL SECURITY;

-- Public read access for patterns (learning from community)
CREATE POLICY "Anyone can view patterns" ON public.video_patterns FOR SELECT USING (true);
CREATE POLICY "Anyone can insert patterns" ON public.video_patterns FOR INSERT WITH CHECK (true);

-- Public access for video plans (demo mode)
CREATE POLICY "Anyone can view plans" ON public.video_plans FOR SELECT USING (true);
CREATE POLICY "Anyone can create plans" ON public.video_plans FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update plans" ON public.video_plans FOR UPDATE USING (true);

-- Public access for generated assets
CREATE POLICY "Anyone can view assets" ON public.generated_assets FOR SELECT USING (true);
CREATE POLICY "Anyone can create assets" ON public.generated_assets FOR INSERT WITH CHECK (true);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('reference-videos', 'reference-videos', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('generated-assets', 'generated-assets', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('previews', 'previews', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('rendered-videos', 'rendered-videos', true);

-- Storage policies
CREATE POLICY "Public read access for reference videos" ON storage.objects FOR SELECT USING (bucket_id = 'reference-videos');
CREATE POLICY "Public upload for reference videos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'reference-videos');

CREATE POLICY "Public read access for generated assets" ON storage.objects FOR SELECT USING (bucket_id = 'generated-assets');
CREATE POLICY "Public upload for generated assets" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'generated-assets');

CREATE POLICY "Public read access for previews" ON storage.objects FOR SELECT USING (bucket_id = 'previews');
CREATE POLICY "Public upload for previews" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'previews');

CREATE POLICY "Public read access for rendered videos" ON storage.objects FOR SELECT USING (bucket_id = 'rendered-videos');
CREATE POLICY "Public upload for rendered videos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'rendered-videos');