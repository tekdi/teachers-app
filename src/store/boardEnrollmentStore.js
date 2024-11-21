/* eslint-disable no-unused-vars */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const boardEnrollmentStore = create(
  persist(
    (set) => ({
      boardEnrollmentData: '',
      setBoardEnrollmentData: (newBoardEnrollmentData) => set(() => ({ boardEnrollmentData: newBoardEnrollmentData })),
    }),
    {
      name: 'boardEnrollment',
      getStorage: () => localStorage
      // storage: typeof window !== 'undefined' ? localStorage : undefined,
    }
  )
);

export default boardEnrollmentStore;
