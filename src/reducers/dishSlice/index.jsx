import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiSlice } from "../apiSlice/apiSlice";
import axios from "axios";
import { SUCCESS, FAILED, PENDING, IDLE } from "../constant";

export const createDish = createAsyncThunk(
  "createDish",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiSlice.post("/createDish", data);
      return response?.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

export const editDish = createAsyncThunk(
  "editDish",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiSlice.patch("/editDish", data);
      return response?.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

export const imageUpload = createAsyncThunk(
  "imageUpload",
  async ({ file, id }, { rejectWithValue }) => {
    try {
      const uploadConfig = await apiSlice.get(`/getImageUrl/upload?id=${id}`);

      await axios.put(uploadConfig.data.url, file, {
        headers: {
          "Content-Type": file.type,
        },
      });
      const response = await apiSlice.post("/image/upload", {
        url: uploadConfig.data.url,
        imageKey: uploadConfig.data.imageKey,
        id: id,
      });
      return response?.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

export const getDishes = createAsyncThunk(
  "getDishes",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiSlice.get(
        `/getDishes?index=${data.page}&search=${data.search}&categoryId=${data.categoryId}&count=${data.count}`
      );
      return response?.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

export const getDish = createAsyncThunk(
  "getDish",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiSlice.get(`/getDish/${data.id}`);
      return response?.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

export const deleteDish = createAsyncThunk(
  "deleteDish",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiSlice.delete(`/dish/${data.id}`);
      return response?.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

const initialState = {
  dishesStatus: IDLE,
  dishesStatusError: "",
  dishesList: [],
  dishesListStatus: IDLE,
  uploadStatus: IDLE,
  uploadStatusError: "",
  selectedDish: null,
  selectedDishStatus: IDLE,
  selectedDishError: "",
  dishId: null,
};

const dishesSlice = createSlice({
  name: "dishes",
  initialState,
  reducers: {
    defaultDishStatus: (state) => {
      state.dishesStatus = IDLE;
      state.dishId = null;
      state.dishesStatusError = "";
    },
    defaultDishListStatus: (state) => {
      state.dishesListStatus = IDLE;
      state.dishesList = [];
    },
    defaultUploadStatus: (state) => {
      state.uploadStatus = IDLE;
      state.uploadStatusError = "";
    },
    defaultSelectedDishStatus: (state) => {
      state.selectedDishStatus = IDLE;
      state.selectedDish = null;
      state.selectedDishError = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createDish.pending, (state) => {
      state.dishesStatus = PENDING;
    });
    builder.addCase(createDish.rejected, (state, action) => {
      const { payload } = action;
      state.dishesStatus = FAILED;
      state.dishesStatusError = payload?.error
        ? payload.error
        : payload?.message;
    });
    builder.addCase(createDish.fulfilled, (state, action) => {
      state.dishesStatus = SUCCESS;
      state.dishId = action.payload.id;
    });
    builder.addCase(editDish.pending, (state) => {
      state.dishesStatus = PENDING;
    });
    builder.addCase(editDish.rejected, (state, action) => {
      const { payload } = action;
      state.dishesStatus = FAILED;
      state.dishesStatusError = payload?.error
        ? payload.error
        : payload?.message;
    });
    builder.addCase(editDish.fulfilled, (state, action) => {
      state.dishesStatus = SUCCESS;
      state.dishId = action.payload.id;
    });
    builder.addCase(deleteDish.pending, (state) => {
      state.dishesStatus = PENDING;
    });
    builder.addCase(deleteDish.rejected, (state, action) => {
      const { payload } = action;
      state.dishesStatus = FAILED;
      state.dishesStatusError = payload?.error
        ? payload.error
        : payload?.message;
    });
    builder.addCase(deleteDish.fulfilled, (state, action) => {
      state.dishesStatus = SUCCESS;
      state.dishId = action.payload.id;
    });
    builder.addCase(imageUpload.pending, (state) => {
      state.uploadStatus = PENDING;
    });
    builder.addCase(imageUpload.rejected, (state, action) => {
      const { payload } = action;
      state.uploadStatus = FAILED;
      state.uploadStatusError = payload?.error
        ? payload.error
        : payload?.message;
    });
    builder.addCase(imageUpload.fulfilled, (state) => {
      state.uploadStatus = SUCCESS;
    });
    builder.addCase(getDishes.pending, (state) => {
      state.dishesListStatus = PENDING;
    });
    builder.addCase(getDishes.rejected, (state) => {
      state.dishesListStatus = FAILED;
    });
    builder.addCase(getDishes.fulfilled, (state, action) => {
      state.dishesListStatus = SUCCESS;
      state.totalDishes = action.payload.total;
      state.dishesList = action.payload.dishes;
    });
    builder.addCase(getDish.pending, (state) => {
      state.dishesListStatus = PENDING;
    });
    builder.addCase(getDish.rejected, (state, action) => {
      state.dishesListStatus = FAILED;
      const { payload } = action;
      state.uploadStatusError = payload?.error
        ? payload.error
        : payload?.message;
    });
    builder.addCase(getDish.fulfilled, (state, action) => {
      state.selectedDishStatus = SUCCESS;
      state.selectedDish = action.payload.selectedDish;
    });
  },
});
export const {
  defaultDishStatus,
  defaultSelectedDishStatus,
  defaultUploadStatus,
  defaultDishListStatus,
} = dishesSlice.actions;
export default dishesSlice.reducer;
