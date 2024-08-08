// trainersSlice.js
import { createSlice } from '@reduxjs/toolkit';

const trainersSlice = createSlice({
  name: 'trainers',
  initialState: { trainers: [], status: 'idle', error: null },
  reducers: {
    trainersLoading: (state) => {
      state.status = 'loading';
    },
    trainersReceived: (state, action) => {
      state.status = 'succeeded';
      state.trainers = action.payload;
    },
    trainersError: (state, action) => {
      state.status = 'failed';
      state.error = action.payload;
    },
  },
});

export const { trainersLoading, trainersReceived, trainersError } = trainersSlice.actions;

export default trainersSlice.reducer;
