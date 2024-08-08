// // productSlice.js

// import { createSlice } from '@reduxjs/toolkit';

// const productReducer = createSlice({
//   name: 'products',
//   initialState: {
//     products: [],
//   },
//   reducers: {
//     addProduct: (state, action) => {
//       state.products.push(action.payload);
//     },
//     removeProduct: (state, action) => {
//       state.products = state.products.filter(product => product.id !== action.payload);
//     },
//     updateProduct: (state, action) => {
//       const { id, updatedProduct } = action.payload;
//       const productIndex = state.products.findIndex(product => product.id === id);
//       if (productIndex !== -1) {
//         state.products[productIndex] = { ...state.products[productIndex], ...updatedProduct };
//       }
//     },
//   },
// });

// export const { addProduct, removeProduct, updateProduct } = productReducer.actions;

// export default productReducer.reducer;
import { createSlice } from '@reduxjs/toolkit';

export const productSlice = createSlice({
  name: 'products',
  initialState: {
    list: [],
  },
  reducers: {
    setProducts: (state, action) => {
      state.list = action.payload;
    },
  },
});

export const { setProducts } = productSlice.actions;
export default productSlice.reducer; // Add this line
