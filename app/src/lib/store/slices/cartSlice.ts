import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartState {
  items: any[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<any>) => {
      const existingItem = state.items.find((product) => product.sku === action.payload.sku);
      if (existingItem) {
        state.items = state.items.map((product) =>
          product.sku === action.payload.sku 
            ? { ...product, quantity: action.payload.quantity } 
            : product
        );
      } else {
        state.items.push(action.payload);
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.sku !== action.payload);
    },
    clearCart: () => initialState,
  },
});

export const { addItem, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;