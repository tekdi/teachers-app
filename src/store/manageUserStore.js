import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const manageUserStore = create(
  persist(
    (set) => ({
      deleteId: '',
      learnerDeleteId: '',
      blockCode: '',
      districtCode: '',
      stateCode: '',
      setCohortDeleteId: (newCohortDeleteId) => set((state) => ({ deleteId: newCohortDeleteId })),
      setCohortLearnerDeleteId: (newCohortLearnerDeleteId) => set((state) => ({ learnerDeleteId: newCohortLearnerDeleteId })),
      setBlockCode: (newBlockCode) => set(() => ({ blockCode: newBlockCode })),
      setDistrictCode: (newDistrictCode) => set(() => ({ districtCode: newDistrictCode })),
      setStateCode: (newStateCode) => set(() => ({ stateCode: newStateCode }))
    }),
    {
      name: 'teacherApp',
      getStorage: () => localStorage,
    }
  )
);

export default manageUserStore;
