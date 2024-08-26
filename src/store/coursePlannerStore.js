/* eslint-disable no-unused-vars */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCourseStore = create(
  persist(
    (set) => ({
      resources: '',
      setResources: (newResources) => set(() => ({ resources: newResources })),
    }),
    {
      name: 'resources',
      getStorage: () => localStorage,
    }
  )
);

export default useCourseStore;
