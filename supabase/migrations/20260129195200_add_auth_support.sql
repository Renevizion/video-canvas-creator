-- Add user_id columns to existing tables
ALTER TABLE public.video_patterns ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
ALTER TABLE public.video_plans ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS video_patterns_user_id_idx ON public.video_patterns(user_id);
CREATE INDEX IF NOT EXISTS video_plans_user_id_idx ON public.video_plans(user_id);

-- Drop existing public policies
DROP POLICY IF EXISTS "Anyone can view patterns" ON public.video_patterns;
DROP POLICY IF EXISTS "Anyone can insert patterns" ON public.video_patterns;
DROP POLICY IF EXISTS "Anyone can view plans" ON public.video_plans;
DROP POLICY IF EXISTS "Anyone can create plans" ON public.video_plans;
DROP POLICY IF EXISTS "Anyone can update plans" ON public.video_plans;
DROP POLICY IF EXISTS "Anyone can view assets" ON public.generated_assets;
DROP POLICY IF EXISTS "Anyone can create assets" ON public.generated_assets;

-- Create authenticated user policies for video_patterns
CREATE POLICY "Users can view their own patterns" ON public.video_patterns
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own patterns" ON public.video_patterns
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own patterns" ON public.video_patterns
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own patterns" ON public.video_patterns
  FOR DELETE USING (auth.uid() = user_id);

-- Create authenticated user policies for video_plans
CREATE POLICY "Users can view their own plans" ON public.video_plans
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own plans" ON public.video_plans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own plans" ON public.video_plans
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own plans" ON public.video_plans
  FOR DELETE USING (auth.uid() = user_id);

-- Create authenticated user policies for generated_assets (based on plan ownership)
CREATE POLICY "Users can view assets for their plans" ON public.generated_assets
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.video_plans
      WHERE video_plans.id = generated_assets.plan_id
      AND video_plans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert assets for their plans" ON public.generated_assets
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.video_plans
      WHERE video_plans.id = generated_assets.plan_id
      AND video_plans.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete assets for their plans" ON public.generated_assets
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.video_plans
      WHERE video_plans.id = generated_assets.plan_id
      AND video_plans.user_id = auth.uid()
    )
  );

-- Update storage policies to be user-specific
DROP POLICY IF EXISTS "Public read access for reference videos" ON storage.objects;
DROP POLICY IF EXISTS "Public upload for reference videos" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for generated assets" ON storage.objects;
DROP POLICY IF EXISTS "Public upload for generated assets" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for previews" ON storage.objects;
DROP POLICY IF EXISTS "Public upload for previews" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for rendered videos" ON storage.objects;
DROP POLICY IF EXISTS "Public upload for rendered videos" ON storage.objects;

-- Create user-specific storage policies
CREATE POLICY "Users can read their own reference videos" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'reference-videos' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can upload their own reference videos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'reference-videos' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can read their own generated assets" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'generated-assets' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can upload their own generated assets" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'generated-assets' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can read their own previews" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'previews' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can upload their own previews" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'previews' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can read their own rendered videos" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'rendered-videos' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can upload their own rendered videos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'rendered-videos' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete their own reference videos" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'reference-videos' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete their own generated assets" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'generated-assets' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete their own previews" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'previews' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete their own rendered videos" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'rendered-videos' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );
