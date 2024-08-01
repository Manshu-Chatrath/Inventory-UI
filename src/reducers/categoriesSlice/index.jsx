import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiSlice } from "../apiSlice/apiSlice";
import { SUCCESS, FAILED, PENDING, IDLE } from "../constant";

export const createCategory = createAsyncThunk(
  "categories",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiSlice.post("/createCategory", data);
      return response?.payload?.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

export const editCategory = createAsyncThunk(
  "editCategory",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiSlice.patch("/category", data);
      return response?.payload?.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "deleteCategory",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiSlice.delete(`/category/${data}`);
      return response?.payload?.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);
export const getCategories = createAsyncThunk(
  "getCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiSlice.get("/categories");
      return response?.data?.categories;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

const initialState = {
  categoryStatus: IDLE,
  categoryStatusError: "",
  categoriesList: [],
  categoriesListStatus: IDLE,
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    defaultCategoryStatus: (state) => {
      state.categoryStatus = IDLE;
      state.categoryStatusError = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createCategory.pending, (state) => {
      state.categoryStatus = PENDING;
    });
    builder.addCase(createCategory.rejected, (state, action) => {
      const { payload } = action;
      state.categoryStatus = FAILED;
      state.categoryStatusError = payload?.error
        ? payload.error
        : payload?.message;
    });
    builder.addCase(createCategory.fulfilled, (state) => {
      state.categoryStatus = SUCCESS;
    });
    builder.addCase(editCategory.pending, (state) => {
      state.categoryStatus = PENDING;
    });
    builder.addCase(editCategory.rejected, (state, action) => {
      const { payload } = action;
      state.categoryStatus = FAILED;
      state.categoryStatusError = payload?.error
        ? payload.error
        : payload?.message;
    });
    builder.addCase(editCategory.fulfilled, (state) => {
      state.categoryStatus = SUCCESS;
    });

    builder.addCase(deleteCategory.pending, (state) => {
      state.categoryStatus = PENDING;
    });
    builder.addCase(deleteCategory.rejected, (state, action) => {
      const { payload } = action;
      state.categoryStatus = FAILED;
      state.categoryStatusError = payload?.error
        ? payload.error
        : payload?.message;
    });
    builder.addCase(deleteCategory.fulfilled, (state) => {
      state.categoryStatus = SUCCESS;
    });
    builder.addCase(getCategories.pending, (state) => {
      state.categoriesListStatus = PENDING;
    });
    builder.addCase(getCategories.rejected, (state) => {
      state.categoriesListStatus = FAILED;
    });
    builder.addCase(getCategories.fulfilled, (state, action) => {
      state.categoriesList = action.payload;
      state.categoriesListStatus = SUCCESS;
    });
  },
});
export const { defaultCategoryStatus } = categorySlice.actions;
export default categorySlice.reducer;
