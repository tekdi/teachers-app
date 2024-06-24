import { useQuery } from "@tanstack/react-query";
import { getUserDetails } from "./ProfileService";
import { cohortList } from "./CohortServices";

export function useProfileInfo(userId: string | string[], fieldValue: boolean) {
  return useQuery({
    
    queryKey: ['profile', userId], 
    queryFn: () => getUserDetails(userId, fieldValue),
    refetchInterval: 5 * 60 * 1000, 
    gcTime: 10 * 60 * 1000
  });
}

export function useCohortList( limit: any, page: any, filters: any) {
    return useQuery({
      queryKey: ['cohort'], 
      queryFn: () => cohortList({limit , page, filters}),
      refetchInterval: 5 * 60 * 1000, 
      gcTime: 10 * 60 * 1000
    });
  }
  
