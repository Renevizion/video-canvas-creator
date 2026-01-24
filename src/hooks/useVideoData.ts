import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchVideoPlans, fetchPatterns, generateVideoPlan, generateRemotionCode, updatePlanStatus } from '@/lib/api';
import { toast } from 'sonner';

export function useVideoPlans() {
  return useQuery({
    queryKey: ['video-plans'],
    queryFn: fetchVideoPlans,
  });
}

export function usePatterns() {
  return useQuery({
    queryKey: ['patterns'],
    queryFn: fetchPatterns,
  });
}

export function useGenerateVideoPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ prompt, duration, style }: { prompt: string; duration: number; style: string }) =>
      generateVideoPlan(prompt, duration, style),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['video-plans'] });
      toast.success('Video plan generated successfully!');
    },
    onError: (error) => {
      console.error('Failed to generate video plan:', error);
      toast.error('Failed to generate video plan');
    },
  });
}

export function useGenerateRemotionCode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (planId: string) => generateRemotionCode(planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['video-plans'] });
      toast.success('Remotion code generated!');
    },
    onError: (error) => {
      console.error('Failed to generate Remotion code:', error);
      toast.error('Failed to generate Remotion code');
    },
  });
}

export function useUpdatePlanStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ planId, status, additionalFields }: { planId: string; status: string; additionalFields?: Record<string, unknown> }) =>
      updatePlanStatus(planId, status, additionalFields),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['video-plans'] });
    },
  });
}
