import { useQuery } from '@tanstack/react-query';
import { getUserDetails } from './ProfileService';
import { cohortList } from './CohortServices';
import { refetchInterval } from '@/utils/app.constant';

export function useProfileInfo(
  userId: string | string[],
  fieldValue: boolean
  // reload: boolean
) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: () => getUserDetails(userId, fieldValue),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export function useCohortList(limit: any, offset: any, filters: any) {
  return useQuery({
    queryKey: ['cohort'],
    queryFn: () => cohortList({ limit, offset, filters }),
    refetchInterval: refetchInterval,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
