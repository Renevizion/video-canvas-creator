import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { VideoProject, StoredPattern, VideoPlan } from '@/types/video';
import { toast } from 'sonner';

// Hook to fetch video plans for the current user
export function useVideoPlans() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['videoPlans', user?.id],
    queryFn: async (): Promise<VideoProject[]> => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('video_plans')
        .select('*')
        .eq('user_id', user.id)
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
    },
    enabled: !!user,
  });
}

// Hook to fetch a single video plan
export function useVideoPlan(planId: string | undefined) {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['videoPlan', planId, user?.id],
    queryFn: async (): Promise<VideoProject | null> => {
      if (!user || !planId) return null;
      
      const { data, error } = await supabase
        .from('video_plans')
        .select('*')
        .eq('id', planId)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      if (!data) return null;
      
      return {
        id: data.id,
        prompt: data.prompt,
        plan: data.plan as unknown as VideoPlan | null,
        generated_code: data.generated_code,
        status: data.status as VideoProject['status'],
        reference_pattern_id: data.reference_pattern_id,
        preview_url: data.preview_url,
        final_video_url: data.final_video_url,
        error: data.error,
        created_at: data.created_at || new Date().toISOString(),
        completed_at: data.completed_at,
      };
    },
    enabled: !!user && !!planId,
  });
}

// Hook to fetch patterns for the current user
export function usePatterns() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['patterns', user?.id],
    queryFn: async (): Promise<StoredPattern[]> => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('video_patterns')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return (data || []).map(item => ({
        id: item.id,
        name: item.name,
        pattern: item.pattern as unknown as StoredPattern['pattern'],
        thumbnail_url: item.thumbnail_url,
        created_at: item.created_at || new Date().toISOString(),
      }));
    },
    enabled: !!user,
  });
}

// Hook to create a new video plan
export function useCreateVideoPlan() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (planData: {
      prompt: string;
      plan: VideoPlan;
      generated_code?: string;
      reference_pattern_id?: string;
    }) => {
      if (!user) throw new Error('User must be authenticated');
      
      const { data, error } = await supabase
        .from('video_plans')
        .insert({
          user_id: user.id,
          prompt: planData.prompt,
          plan: planData.plan as unknown as Record<string, unknown>,
          generated_code: planData.generated_code,
          reference_pattern_id: planData.reference_pattern_id,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videoPlans', user?.id] });
      toast.success('Video plan created successfully');
    },
    onError: (error) => {
      console.error('Error creating video plan:', error);
      toast.error('Failed to create video plan');
    },
  });
}

// Hook to update a video plan
export function useUpdateVideoPlan() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (params: {
      id: string;
      updates: Partial<{
        plan: VideoPlan;
        generated_code: string;
        status: VideoProject['status'];
        preview_url: string;
        final_video_url: string;
        error: string;
        completed_at: string;
      }>;
    }) => {
      if (!user) throw new Error('User must be authenticated');
      
      const { data, error } = await supabase
        .from('video_plans')
        .update(params.updates as Record<string, unknown>)
        .eq('id', params.id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['videoPlans', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['videoPlan', variables.id, user?.id] });
      toast.success('Video plan updated successfully');
    },
    onError: (error) => {
      console.error('Error updating video plan:', error);
      toast.error('Failed to update video plan');
    },
  });
}

// Hook to create a pattern
export function useCreatePattern() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (patternData: {
      name: string;
      pattern: StoredPattern['pattern'];
      thumbnail_url?: string;
    }) => {
      if (!user) throw new Error('User must be authenticated');
      
      const { data, error } = await supabase
        .from('video_patterns')
        .insert({
          user_id: user.id,
          name: patternData.name,
          pattern: patternData.pattern as unknown as Record<string, unknown>,
          thumbnail_url: patternData.thumbnail_url,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patterns', user?.id] });
      toast.success('Pattern created successfully');
    },
    onError: (error) => {
      console.error('Error creating pattern:', error);
      toast.error('Failed to create pattern');
    },
  });
}

// Hook to delete a video plan
export function useDeleteVideoPlan() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (planId: string) => {
      if (!user) throw new Error('User must be authenticated');
      
      const { error } = await supabase
        .from('video_plans')
        .delete()
        .eq('id', planId)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videoPlans', user?.id] });
      toast.success('Video plan deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting video plan:', error);
      toast.error('Failed to delete video plan');
    },
  });
}
