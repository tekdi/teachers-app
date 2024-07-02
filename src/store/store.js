
import {create} from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(persist((set) => ({
    value: '',
    setValue: (newValue) => set((state) => ({ value: newValue })),
}), {
name: 'teacherZustand',
getStorage: () => localStorage,
}));

export default useStore ;
