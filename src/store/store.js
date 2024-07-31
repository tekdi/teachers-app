/* eslint-disable no-unused-vars */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      value: '',
      cohorts: [],
      userRole: '',
      pairs: [],
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
