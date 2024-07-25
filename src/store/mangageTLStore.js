import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const teamLeadStore = create(
  persist(
    (set) => ({
      deleteId: '',
      learnerDeleteId: '',
      blockCode: '',
      districtCode: '',
      stateCode: '',
      districtFieldId: 'aecb84c9-fe4c-4960-817f-3d228c0c7300',
      blockFieldId: '02d3868e-9cd1-4088-a6c1-5623daa904a4',
      stateFieldId: '61b5909a-0b45-4282-8721-e614fd36d7bd',
      setCohortDeleteId: (newCohortDeleteId) =>
        set((state) => ({ deleteId: newCohortDeleteId })),
      setCohortLearnerDeleteId: (newCohortLearnerDeleteId) =>
        set((state) => ({ learnerDeleteId: newCohortLearnerDeleteId })),
      setBlockCode: (newBlockCode) => set(() => ({ blockCode: newBlockCode })),
      setDistrictCode: (newDistrictCode) =>
        set(() => ({ districtCode: newDistrictCode })),
      setStateCode: (newStateCode) => set(() => ({ stateCode: newStateCode })),
      setBlockFieldId: (newBlockId) =>
        set(() => ({ blockFieldId: newBlockId })),
      setDistrictFieldId: (newDistrictId) =>
        set(() => ({ districtFieldId: newDistrictId })),
      setStateFieldId: (newStateId) =>
        set(() => ({ stateFieldId: newStateId })),
    }),
    {
      name: 'teamLeadApp',
      getStorage: () => localStorage,
    }
  )
);

export default teamLeadStore;
