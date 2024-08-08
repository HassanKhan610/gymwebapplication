import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { userAuthApi } from '../services/userAuthApi'
import authReducer from '../features/authSlice';
import userReducer from '../features/authSlice';
import cartReducer from '../features/cartSlice';
import trainersReducer from '../features/trainerSlice';
import productReducer from '../features/productSlice';
import { trainersApi } from '../services/userAuthApi'; 
import { productsApi } from '../services/userAuthApi';
import orderSlice from '../features/orderSlice';
import { subscriptionApi } from '../services/userAuthApi';


export const store = configureStore({
  reducer: {
    [userAuthApi.reducerPath]: userAuthApi.reducer,
    auth: authReducer,
    user: userReducer,
    cart: cartReducer,
    order: orderSlice,
    trainers: trainersReducer,
    [trainersApi.reducerPath]: trainersApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
    products: productReducer,
    [subscriptionApi.reducerPath]: subscriptionApi.reducer,
    
    
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userAuthApi.middleware).concat(trainersApi.middleware).concat(productsApi.middleware).concat(subscriptionApi.middleware)
})

setupListeners(store.dispatch)