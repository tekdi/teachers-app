import { useQuery } from '@tanstack/react-query';
import { getUserDetails } from './ProfileService';
import { cohortList } from './CohortServices';
import { refetchInterval, gcTime } from '@/utils/app.constant';

export function useProfileInfo(
  userId: string | string[],
  fieldValue: boolean,
  reload: boolean
) {
  return useQuery({
    queryKey: ['profile', userId, reload],
    queryFn: () => getUserDetails(userId, fieldValue),
    refetchInterval: refetchInterval,
    gcTime: gcTime,
  });
}

export function useCohortList(limit: any, page: any, filters: any) {
  return useQuery({
    queryKey: ['cohort'],
    queryFn: () => cohortList({ limit, page, filters }),
    refetchInterval: refetchInterval,
    gcTime: gcTime,
  });
}
