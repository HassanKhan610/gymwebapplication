// // cartSlice.js
// import { createSlice } from '@reduxjs/toolkit';

// const cartSlice = createSlice({
//   name: 'cart',
//   initialState: { items: [] },
//   reducers: {
//     addToCart: (state, action) => {
//       const existingItem = state.items.find(item => item.id === action.payload.id);
//       if (existingItem) {
//         existingItem.quantity += 1;
//       } else {
//         state.items.push({ ...action.payload, quantity: 1 });
//       }
//     },
//     removeFromCart: (state, action) => {
//       state.items = state.items.filter(item => item.id !== action.payload.id);
//     },
//     clearCart: (state) => {
//       state.items = [];
//     },
//     incrementQuantity: (state, action) => {
//       const item = state.items.find(item => item.id === action.payload.id);
//       if (item) {
//         item.quantity += 1;
//       }
//     },
//     decrementQuantity: (state, action) => {
//       const item = state.items.find(item => item.id === action.payload.id);
//       if (item && item.quantity > 1) {
//         item.quantity -= 1;
//       }
//     },
//   },
// });

// export const { addToCart, removeFromCart, clearCart, incrementQuantity, decrementQuantity } = cartSlice.actions;

// export default cartSlice.reducer;
// cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: [], // Initialize cart as an empty array
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existingItemIndex = state.findIndex(item => item.id === product.id);

      if (existingItemIndex !== -1) {
        // If the product is already in the cart, increment its quantity
        state[existingItemIndex].quantity += 1;
      } else {
        // If the product is not in the cart, add it with quantity 1
        state.push({ ...product, quantity: 1 });
      }
    },
    removeFromCart: (state, action) => {
      const productId = action.payload;
      return state.filter(item => item.id !== productId);
    },
    clearCart: (state) => {
      return [];
    },
    incrementQuantity: (state, action) => {
      const productId = action.payload;
      const item = state.find(item => item.id === productId);
      if (item) {
        item.quantity += 1;
      }
    },
    decrementQuantity: (state, action) => {
      const productId = action.payload;
      const item = state.find(item => item.id === productId);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },
  },
});

export const { addToCart, removeFromCart, clearCart, incrementQuantity, decrementQuantity } = cartSlice.actions;
export default cartSlice.reducer;

