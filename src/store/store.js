/* eslint-disable no-unused-vars */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      accessToken: '',
      value: '',
      block: '',
      cohorts: [],
      userRole: '',
      pairs: [],
      isActiveYearSelected: '',
      cohortFacilitatorsCount:0,
      setCohortFacilitatorsCount: (newValue) => set((state) => ({ cohortFacilitatorsCount: newValue })),
      cohortLearnerCount:0,
      setCohortLearnerCount: (newValue) => set((state) => ({ cohortLearnerCount: newValue })),
      setValue: (newValue) => set((state) => ({ value: newValue })),
      setBlock: (newBlock) => set((state) => ({ block: newBlock })),
      setUserRole: (newRole) => set((state) => ({ userRole: newRole })),
      setCohorts: (newCohorts) => set(() => ({ cohorts: newCohorts })),
      setAccessToken: (newAccessToken) => set((state) => ({accessToken: newAccessToken})),
      setIsActiveYearSelected: (newYear) => set(() => ({ isActiveYearSelected: newYear })),
    }),
    {
      name: 'teacherApp',
      getStorage: () => localStorage
      // storage: typeof window !== 'undefined' ? localStorage : undefined,
    }
  )
);

export default useStore;
