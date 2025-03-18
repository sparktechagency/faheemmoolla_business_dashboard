// src/features/ids/idSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  shopId: null,
  mealId: null,
  userId: null,
};

const idSlice = createSlice({
  name: "ids",
  initialState,
  reducers: {
    setShopId: (state, action) => {
      state.shopId = action.payload;
    },
    setMealId: (state, action) => {
      state.mealId = action.payload;
    },
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    resetIds: () => initialState, // Reset all IDs
  },
});

export const { setShopId, setMealId, setUserId, resetIds } = idSlice.actions;
export default idSlice.reducer;
