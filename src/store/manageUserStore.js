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
      blockId: 'a717bb68-5c8a-45cb-b6dd-376caa605736',
      districtId: 'aecb84c9-fe4c-4960-817f-3d228c0c7300',
      stateId: '61b5909a-0b45-4282-8721-e614fd36d7bd',
      setUserId: (newUserId) =>
      set((state) => ({ userId: newUserId })),
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
    }),
    {
      name: 'teacherApp',
      getStorage: () => localStorage,
    }
  )
);

export default manageUserStore;
