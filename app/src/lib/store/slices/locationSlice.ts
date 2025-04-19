import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LocationState {
  location: string;
}

const initialState: LocationState = {
  location: '',
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setLocation: (state, action: PayloadAction<string>) => {
      state.location = action.payload;
    },
    clearLocation: () => initialState,
  },
});

export const { setLocation, clearLocation } = locationSlice.actions;
export default locationSlice.reducer;