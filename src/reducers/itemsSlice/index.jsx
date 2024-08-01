import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiSlice } from "../apiSlice/apiSlice";
import { SUCCESS, FAILED, PENDING, IDLE } from "../constant";

export const createItem = createAsyncThunk(
  "item",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiSlice.post("/createItem", data);
      return response?.payload?.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

export const getItems = createAsyncThunk(
  "getItems",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiSlice.get(
        `/getItems?count=${data.rowsPerPage}&index=${data.page}&search=${data.search}`
      );
      return { items: response?.data?.items, total: response?.data?.total };
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

export const editItem = createAsyncThunk(
  "editItem",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiSlice.patch("/items", data);
      return response?.payload?.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

export const deleteItem = createAsyncThunk(
  "deleteItem",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiSlice.delete(`/items/${data}`);
      return response?.payload?.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

const initialState = {
  itemStatus: IDLE,
  itemStatusError: "",
  itemList: [],
  total: 0,
  itemListStatus: IDLE,
};

const itemsSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    defaultItemStatus: (state) => {
      state.itemStatus = IDLE;
      state.itemStatusError = "";
    },
    defaultItemListStatus: (state) => {
      state.itemList = [];
      state.itemListStatus = IDLE;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createItem.pending, (state) => {
      state.itemStatus = PENDING;
    });
    builder.addCase(createItem.rejected, (state, action) => {
      const { payload } = action;
      state.itemStatus = FAILED;
      state.itemStatusError = payload?.error ? payload.error : payload?.message;
    });
    builder.addCase(createItem.fulfilled, (state) => {
      state.itemStatus = SUCCESS;
    });
    builder.addCase(editItem.pending, (state) => {
      state.itemStatus = PENDING;
    });
    builder.addCase(editItem.rejected, (state, action) => {
      const { payload } = action;
      state.itemStatus = FAILED;
      state.itemStatusError = payload?.error ? payload.error : payload?.message;
    });
    builder.addCase(deleteItem.fulfilled, (state) => {
      state.itemStatus = SUCCESS;
    });
    builder.addCase(deleteItem.pending, (state) => {
      state.itemStatus = PENDING;
    });
    builder.addCase(deleteItem.rejected, (state, action) => {
      const { payload } = action;
      state.itemStatus = FAILED;
      state.itemStatusError = payload?.error ? payload.error : payload?.message;
    });
    builder.addCase(editItem.fulfilled, (state) => {
      state.itemStatus = SUCCESS;
    });
    builder.addCase(getItems.pending, (state) => {
      state.itemListStatus = PENDING;
    });
    builder.addCase(getItems.rejected, (state) => {
      state.itemListStatus = FAILED;
    });
    builder.addCase(getItems.fulfilled, (state, action) => {
      state.itemListStatus = SUCCESS;
      state.itemList = action.payload.items;
      state.total = action.payload.total;
    });
  },
});
export const { defaultItemStatus } = itemsSlice.actions;
export default itemsSlice.reducer;
