/* eslint-disable no-unused-vars */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCourseStore = create(
  persist(
    (set) => ({
      resources: '',
      subject:'',
      setResources: (newResources) => set(() => ({ resources: newResources })),
      setSubject: (newSubject) => set(() => ({ subject: newSubject })),
    }),
    {
      name: 'resources',
      getStorage: () => localStorage,
    }
  )
);

export default useCourseStore;
