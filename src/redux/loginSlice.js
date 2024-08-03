import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loginUser: "",
  isLogin: false,
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setLoginUser: (state, action) => {
      state.loginUser = action.payload;
      state.isLogin = true;
    },
    setLogout: (state) => {
      state.isLogin = false;
      state.loginUser = "";
    },
  },
});

export const { setLoginUser, setLogout } = loginSlice.actions;
export default loginSlice.reducer;
