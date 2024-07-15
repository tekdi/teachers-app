import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      value: '',
      role: '',
      pairs: [],
      setValue: (newValue) => set((state) => ({ value: newValue })),
      setUserRole: (newRole) => set((state) => ({ userRole: newRole })),
      setPairs: (newPairs) => set(() => ({ pairs: newPairs })),
    }),
    {
      name: 'teacherApp',
      getStorage: () => localStorage,
    }
  )
);

export default useStore;
