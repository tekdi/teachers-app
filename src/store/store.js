import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      value: '',
      role: '',
      cohorts: [],
      setValue: (newValue) => set((state) => ({ value: newValue })),
      setUserRole: (newRole) => set((state) => ({ userRole: newRole })),
      setCohorts: (newCohorts) => set(() => ({ cohorts: newCohorts })),
    }),
    {
      name: 'teacherApp',
      getStorage: () => localStorage,
    }
  )
);

export default useStore;
