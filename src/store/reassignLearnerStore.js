/* eslint-disable no-unused-vars */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const reassignLearnerStore = create(
  persist(
    (set) => ({
      reassignId: '',
      cohortId: '',
      removeCohortId: '',
      setReassignId: (newReassignId) => set((state) => ({ reassignId: newReassignId })),
      setCohortId: (newCohortId) => set((state) => ({ cohortId: newCohortId })),
      setRemoveCohortId: (newRemoveCohortId) => set((state) => ({ removeCohortId: newRemoveCohortId })),
    }),
    {
      name: 'teacherApp',
      getStorage: () => localStorage,
    }
  )
);

export default reassignLearnerStore;
