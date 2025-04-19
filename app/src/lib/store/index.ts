import { configureStore } from '@reduxjs/toolkit';
import memberReducer from './slices/memberSlice';
import cartReducer from './slices/cartSlice';
import locationReducer from './slices/locationSlice';

export const store = configureStore({
  reducer: {
    member: memberReducer,
    cart: cartReducer,
    location: locationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;