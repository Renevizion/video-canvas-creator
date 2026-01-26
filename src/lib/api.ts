import { supabase } from '@/integrations/supabase/client';
import type { VideoProject, StoredPattern, VideoPlan } from '@/types/video';

export async function fetchVideoPlans(): Promise<VideoProject[]> {
  const { data, error } = await supabase
    .from('video_plans')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  return (data || []).map(item => ({
    id: item.id,
    prompt: item.prompt,
    plan: item.plan as unknown as VideoPlan | null,
    generated_code: item.generated_code,
    status: item.status as VideoProject['status'],
    reference_pattern_id: item.reference_pattern_id,
    preview_url: item.preview_url,
    final_video_url: item.final_video_url,
    error: item.error,
    created_at: item.created_at || new Date().toISOString(),
    completed_at: item.completed_at,
  }));
}

export async function fetchPatterns(): Promise<StoredPattern[]> {
  const { data, error } = await supabase
    .from('video_patterns')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  return (data || []).map(item => ({
    id: item.id,
    name: item.name,
    pattern: item.pattern as unknown as StoredPattern['pattern'],
    thumbnail_url: item.thumbnail_url,
    created_at: item.created_at || new Date().toISOString(),
  }));
}

export async function generateVideoPlan(
  prompt: string, 
  duration: number, 
  style: string, 
  brandData?: Record<string, unknown>,
  aspectRatio: 'landscape' | 'portrait' | 'square' = 'landscape'
) {
  const { data, error } = await supabase.functions.invoke('generate-video-plan', {
    body: { prompt, duration, style, brandData, aspectRatio },
  });

  if (error) throw error;
  return data;
}

export async function analyzeVideo(fileName: string, filePath: string) {
  const { data, error } = await supabase.functions.invoke('analyze-video', {
    body: { fileName, filePath },
  });

  if (error) throw error;
  return data;
}

export async function generateRemotionCode(planId: string) {
  const { data, error } = await supabase.functions.invoke('generate-remotion-code', {
    body: { planId },
  });

  if (error) throw error;
  return data;
}

export async function generateAsset(
  assetId: string,
  description: string,
  width: number,
  height: number,
  style: string
) {
  const { data, error } = await supabase.functions.invoke('generate-asset', {
    body: { assetId, description, width, height, style },
  });

  if (error) throw error;
  return data;
}

export async function updatePlanStatus(planId: string, status: string, additionalFields?: Record<string, unknown>) {
  const { error } = await supabase
    .from('video_plans')
    .update({ status, ...additionalFields })
    .eq('id', planId);

  if (error) throw error;
}

export async function renderVideo(planId: string) {
  const { data, error } = await supabase.functions.invoke('render-video', {
    body: { planId },
  });

  if (error) throw error;
  return data;
}
