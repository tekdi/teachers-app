import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const manageUserStore = create(
  persist(
    (set) => ({
      deleteId: '',
      setCohortDeleteId: (newCohortDeleteId) => set((state) => ({ deleteId: newCohortDeleteId })),
    }),
    {
      name: 'teacherApp',
      getStorage: () => localStorage,
    }
  )
);

export default manageUserStore;
