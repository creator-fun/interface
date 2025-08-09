import { create } from 'zustand';

export type videoInterface = {
    isMute: boolean;
};

type State = {
    isMute: boolean;
};

type Actions = {
    setIsMute: (isMute: boolean) => void;
    reset: () => void;
};

const initialState: State = {
    isMute: false,
};

const useVideoStore = create<State & Actions>()((set) => ({
    ...initialState,
    setIsMute: (isMute) => set({ isMute }),
    reset: () => set(initialState),
}));

export default useVideoStore;
