import { configureStore } from '@reduxjs/toolkit';
import statistikaReducer from './features/statistikaSlice';

const store = configureStore({
  reducer: {
    statistika: statistikaReducer
  }
});

export default store;