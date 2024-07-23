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
      blockId: '',
      districtId: '',
      stateId: '',
      setCohortDeleteId: (newCohortDeleteId) => set((state) => ({ deleteId: newCohortDeleteId })),
      setCohortLearnerDeleteId: (newCohortLearnerDeleteId) => set((state) => ({ learnerDeleteId: newCohortLearnerDeleteId })),
      setBlockCode: (newBlockCode) => set(() => ({ blockCode: newBlockCode })),
      setDistrictCode: (newDistrictCode) => set(() => ({ districtCode: newDistrictCode })),
      setStateCode: (newStateCode) => set(() => ({ stateCode: newStateCode })),
      setBlockId: (newBlockId) => set(() => ({ blockId: newBlockId })),
      setDistrictId: (newDistrictId) => set(() => ({ districtId: newDistrictId })),
      setStateId: (newStateId) => set(() => ({ stateId: newStateId }))
    }),
    {
      name: 'teacherApp',
      getStorage: () => localStorage,
    }
  )
);

export default manageUserStore;
