import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      value: '',
      role: '',
      setValue: (newValue) => set((state) => ({ value: newValue })),
      setUserRole: (newRole) => set((state) => ({ userRole: newRole })),
    }),
    {
      name: 'teacherApp',
      getStorage: () => localStorage,
    }
  )
);

export default useStore;
