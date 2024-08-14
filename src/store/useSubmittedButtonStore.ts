import { create } from 'zustand';

const useSubmittedButtonStore = create((set) => ({
  submittedButtonStatus: false,
  setSubmittedButtonStatus: (status: boolean) =>
    set({ submittedButtonStatus: status }),
}));

export default useSubmittedButtonStore;
