/* eslint-disable no-unused-vars */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCourseStore = create(
  persist(
    (set) => ({
      resources: '',
      selectedResource: '',
      subject: '',
      setResources: (newResources) => set(() => ({ resources: newResources })),
      setSelectedResource: (newSelectedResource) =>
        set(() => ({ selectedResource: newSelectedResource })),
      setSubject: (newSubject) => set(() => ({ subject: newSubject })),
    }),
    {
      name: 'resources',
      getStorage: () => localStorage,
      // storage: typeof window !== 'undefined' ? localStorage : undefined,
    }
  )
);

export default useCourseStore;
