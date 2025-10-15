
import { create } from 'zustand';

type Role = 'donor' | 'receiver';

interface RoleState {
  role: Role | null;
  donorFormOpen: boolean;
  justSignedUp: boolean; // To track if the user just completed sign-up
  setRole: (role: Role | null) => void;
  setDonorFormOpen: (isOpen: boolean) => void;
  setJustSignedUp: (justSignedUp: boolean) => void;
}

export const useRoleStore = create<RoleState>((set) => ({
  role: null,
  donorFormOpen: false,
  justSignedUp: false,
  setRole: (role) => set({ role }),
  setDonorFormOpen: (isOpen) => set({ donorFormOpen: isOpen }),
  setJustSignedUp: (justSignedUp) => set({ justSignedUp }),
}));
