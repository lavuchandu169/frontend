import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  username: "",
  password: "",
  confirmPassword: "",
};

const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    setFormData: (state, action) => {
      state[action.payload.name] = action.payload.value;
    },
    resetForm: () => initialState,
  },
});

export const { setFormData, resetForm } = registerSlice.actions;
export default registerSlice.reducer;
