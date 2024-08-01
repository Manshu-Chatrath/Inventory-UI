import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import categoriesSlice from "./categoriesSlice";
import itemsSlice from "./itemsSlice";
import dishSlice from "./dishSlice";
export const store = configureStore({
  reducer: {
    auth: authSlice,
    categories: categoriesSlice,
    items: itemsSlice,
    dishes: dishSlice,
  },
});
