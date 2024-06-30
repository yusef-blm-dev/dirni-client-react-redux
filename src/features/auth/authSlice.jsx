import { createSlice } from "@reduxjs/toolkit";
const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    token: null,
    userId: null,
  },
  reducers: {
    setCredentials: (state, action) => {
      const { token, userId } = action.payload;
      state.isLoggedIn = true;
      state.token = token;
      state.userId = userId;
    },

    logOut: (state) => {
      state.isLoggedIn = false;
      state.token = null;
      state.userId = null;
    },
  },
});
export const { setCredentials, logOut } = authSlice.actions;
export default authSlice.reducer;
export const selectCurrentToken = (state) => state.auth.token;
export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectUserId = (state) => state.auth.userId;
