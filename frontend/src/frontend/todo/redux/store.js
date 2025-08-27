import { configureStore } from "@reduxjs/toolkit";
import { authenticateReducer } from "./authReducer";

const store = configureStore({
  reducer: {
    auth: authenticateReducer,
  },
});

export default store;
