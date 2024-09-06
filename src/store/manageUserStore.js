/* eslint-disable no-unused-vars */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const manageUserStore = create(
  persist(
    (set) => ({
      userId: '',
      deleteId: '',
      learnerDeleteId: '',
      blockCode: '',
      districtCode: '',
      stateCode: '',
      stateId: '',
      districtId: '',
      blockId: '',
      districtName: '',
      blockName: '',
      stateName: '',
      setUserId: (newUserId) => set((state) => ({ userId: newUserId })),
      setCohortDeleteId: (newCohortDeleteId) =>
        set((state) => ({ deleteId: newCohortDeleteId })),
      setCohortLearnerDeleteId: (newCohortLearnerDeleteId) =>
        set((state) => ({ learnerDeleteId: newCohortLearnerDeleteId })),
      setBlockCode: (newBlockCode) => set(() => ({ blockCode: newBlockCode })),
      setDistrictCode: (newDistrictCode) =>
        set(() => ({ districtCode: newDistrictCode })),
      setStateCode: (newStateCode) => set(() => ({ stateCode: newStateCode })),
      setBlockId: (newBlockId) => set(() => ({ blockId: newBlockId })),
      setDistrictId: (newDistrictId) =>
        set(() => ({ districtId: newDistrictId })),
      setStateId: (newStateId) => set(() => ({ stateId: newStateId })),
      setDistrictName: (newDistrictName) =>
        set(() => ({ districtName: newDistrictName })),
      setBlockName: (newBlockName) => set(() => ({ blockName: newBlockName })),
      setStateName: (newStateName) => set(() => ({ stateName: newStateName })),
    }),
    {
      name: 'fieldData',
      getStorage: () => localStorage,
    }
  )
);

export default manageUserStore;
