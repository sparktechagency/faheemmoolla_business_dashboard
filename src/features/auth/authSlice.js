import { createSlice } from "@reduxjs/toolkit";
import { saveToken, getToken, removeToken } from "./authService";

const initialState = {
  token: getToken(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      saveToken(action.payload);
    },
    logout: (state) => {
      state.token = null;
      removeToken();
    },
  },
});

export const { setToken, logout } = authSlice.actions;
export default authSlice.reducer;
