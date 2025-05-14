import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: null,
  error: null
};

const statistikaSlice = createSlice({
  name: 'statistika',
  initialState,
  reducers: {
    fetchStatistikaSuccess(state, action) {
      state.data = action.payload;
    },
    clearStatistika(state) {
      state.data = null;
      state.error = null;
    }
  }
});

export const {
  fetchStatistikaStart,
  fetchStatistikaSuccess,
  fetchStatistikaFailure,
  clearStatistika
} = statistikaSlice.actions;

export default statistikaSlice.reducer;