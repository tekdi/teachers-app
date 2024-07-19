import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const manageUserStore = create(
  persist(
    (set) => ({
      deleteId: '',
      learnerDeleteId: '',
      setCohortDeleteId: (newCohortDeleteId) => set((state) => ({ deleteId: newCohortDeleteId })),
      setCohortLearnerDeleteId: (newCohortLearnerDeleteId) => set((state) => ({ learnerDeleteId: newCohortLearnerDeleteId })),
    }),
    {
      name: 'teacherApp',
      getStorage: () => localStorage,
    }
  )
);

export default manageUserStore;
