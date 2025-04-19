import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Member } from '@/types/member';

const initialState: Member = {} as Member;

const memberSlice = createSlice({
  name: 'member',
  initialState,
  reducers: {
    addMember: (state, action: PayloadAction<Member>) => {
      return { ...action.payload };
    },
    clearMember: () => initialState,
  },
});

export const { addMember, clearMember } = memberSlice.actions;
export default memberSlice.reducer;