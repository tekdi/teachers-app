/* eslint-disable no-unused-vars */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const reassignLearnerStore = create(
  persist(
    (set) => ({
      reassignFacilitatorUserId: '',
      reassignId: '',
      cohortId: '',
      removeCohortId: '',
      setReassignFacilitatorUserId: (newReassignFacilitatorUserId) =>
        set((state) => ({
          reassignFacilitatorUserId: newReassignFacilitatorUserId,
        })),
      setReassignId: (newReassignId) =>
        set((state) => ({ reassignId: newReassignId })),
      setCohortId: (newCohortId) => set((state) => ({ cohortId: newCohortId })),
      setRemoveCohortId: (newRemoveCohortId) =>
        set((state) => ({ removeCohortId: newRemoveCohortId })),
    }),
    {
      name: 'teacherApp',
      getStorage: () => localStorage
      // storage: typeof window !== 'undefined' ? localStorage : undefined,
    }
  )
);

export default reassignLearnerStore;
