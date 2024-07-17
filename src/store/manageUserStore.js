import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const manageUserStore = create(
  persist(
    (set) => ({
      deleteId: '',
      setDeleteId: (newDeleteId) => set((state) => ({ deleteId: newDeleteId })),
    }),
    {
      name: 'teacherApp',
      getStorage: () => localStorage,
    }
  )
);

export default manageUserStore;
