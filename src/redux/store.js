import { configureStore } from "@reduxjs/toolkit";
import registerReducer from "./registerSlice";
import loginReducer from "./loginSlice";
import documentsReducer from "./documentsSlice";

const store = configureStore({
  reducer: {
    register: registerReducer,
    login: loginReducer,
    documents: documentsReducer,
  },
});

export default store;
