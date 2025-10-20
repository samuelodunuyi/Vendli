import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface Lead {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  status?: string;
  source?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  // Add other lead properties as needed
}

type LeadState = {
  selectedLead: Lead | null;
  type: string | null;
};

const initialState: LeadState = {
  selectedLead: null,
  type: null,
};

const leadSlice = createSlice({
  name: 'lead',
  initialState,
  reducers: {
    setSelectedLead: (state, action: PayloadAction<Lead>) => {
      return { ...state, selectedLead: action.payload };
    },
    clearSelectedLead: (state) => {
      return { ...state, selectedLead: null };
    },
    setType: (state, action: PayloadAction<string>) => {
      return { ...state, type: action.payload };
    },
  },
});

export const { setSelectedLead, clearSelectedLead, setType } =
  leadSlice.actions;
export default leadSlice.reducer;
