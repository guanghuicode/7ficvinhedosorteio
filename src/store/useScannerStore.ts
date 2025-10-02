import { create } from 'zustand';

interface ScannerState {
  isOpen: boolean;
  openScanner: () => void;
  closeScanner: () => void;
}

export const useScannerStore = create<ScannerState>((set) => ({
  isOpen: false,
  openScanner: () => set({ isOpen: true }),
  closeScanner: () => set({ isOpen: false }),
}));

