import { Member } from '@/models/member';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: Member = {} as Member;

const memberSlice = createSlice({
  name: 'member',
  initialState,
  reducers: {
    addMember: (state: any, action: PayloadAction<Member>) => {
      return { ...action.payload };
    },
    clearMember: () => initialState,
  },
});

export const { addMember, clearMember } = memberSlice.actions;
export default memberSlice.reducer;