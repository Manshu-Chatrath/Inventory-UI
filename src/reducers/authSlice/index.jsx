import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiSlice } from "../apiSlice/apiSlice";
import { SUCCESS, FAILED, PENDING, IDLE } from "../constant";

export const initiateSignUp = createAsyncThunk(
  "signUp",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiSlice.post("/initiateSignup", data);
      return response?.payload?.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue({
        ...err.response.data,
        statusCode: err.response.status,
      });
    }
  }
);

export const finalSignUp = createAsyncThunk(
  "finalSignUp",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiSlice.post("/finalSignup", data);
      return response?.payload?.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue({
        ...err.response.data,
        statusCode: err.response.status,
      });
    }
  }
);

export const login = createAsyncThunk(
  "login",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiSlice.post("/login", data);
      apiSlice.defaults.headers.common["Authorization"] =
        response?.data?.token?.accessToken;
      localStorage.setItem(
        "user",
        JSON.stringify({
          token: response?.data?.token?.accessToken,
          id: response?.data?.user?.id,
          email: response?.data?.user?.email,
        })
      );
      return response?.payload?.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue({
        ...err.response.data,
        statusCode: err.response.status,
      });
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "forgotPassword",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiSlice.post("/forgotPassword", data);
      return response?.payload?.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue({
        ...err.response.data,
        statusCode: err.response.status,
      });
    }
  }
);
export const newPassword = createAsyncThunk(
  "newPassword",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiSlice.post("/newPassword", data);
      return response?.payload?.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue({
        ...err.response.data,
        statusCode: err.response.status,
      });
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "verifyOtp",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiSlice.post("/verifyOtp", data);
      return response?.payload?.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue({
        ...err.response.data,
        statusCode: err.response.status,
      });
    }
  }
);

const initialState = {
  initiateSignUpStatus: IDLE,
  forgotPasswordStatus: IDLE,
  forgotPasswordStatusError: "",
  initiateSignUpStatusError: "",
  finalSignUpStatus: IDLE,
  finalSignUpStatusError: "",
  verifyOtpStatus: IDLE,
  verifyOtpStatusError: "",
  loginStatusError: "",
  loginStatus: IDLE,
  newPasswordStatus: IDLE,
  newPasswordStatusError: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    defaultInitiateSignupStatus: (state) => {
      state.initiateSignUpStatus = IDLE;
      state.initiateSignUpStatusError = "";
    },
    defaultFinalSignupStatus: (state) => {
      state.finalSignUpStatus = IDLE;
      state.finalSignUpStatusError = "";
    },
    defaultLoginStatus: (state) => {
      state.loginStatus = IDLE;
      state.loginStatusError = "";
    },
    defaultForgotPasswordStatus: (state) => {
      state.forgotPasswordStatus = IDLE;
      state.forgotPasswordStatusError = "";
    },
    userLogOut: (state) => {
      localStorage.removeItem("user");
      state.loginStatus = null;
      state.loginStatusError = "";
    },
    defaultVerifyOtpStatus: (state) => {
      state.verifyOtpStatus = IDLE;
      state.verifyOtpStatusError = "";
    },
    defaultNewPasswordStatus: (state) => {
      state.newPasswordStatus = IDLE;
      state.newPasswordStatusError = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(initiateSignUp.pending, (state) => {
      state.initiateSignUpStatus = PENDING;
    });
    builder.addCase(initiateSignUp.rejected, (state, action) => {
      const { payload } = action;
      state.initiateSignUpStatus = FAILED;
      state.initiateSignUpStatusError = payload?.error
        ? payload.error
        : payload?.message;
    });
    builder.addCase(initiateSignUp.fulfilled, (state) => {
      state.initiateSignUpStatus = SUCCESS;
    });

    builder.addCase(finalSignUp.pending, (state) => {
      state.finalSignUpStatus = PENDING;
    });
    builder.addCase(finalSignUp.rejected, (state, action) => {
      const { payload } = action;
      state.finalSignUpStatus = FAILED;
      state.finalSignUpStatusError = payload?.error
        ? payload.error
        : payload?.message;
    });
    builder.addCase(finalSignUp.fulfilled, (state) => {
      state.finalSignUpStatus = SUCCESS;
    });

    builder.addCase(login.pending, (state) => {
      state.loginStatus = PENDING;
    });
    builder.addCase(login.rejected, (state, action) => {
      const { payload } = action;
      state.loginStatus = FAILED;
      state.loginStatusError = payload?.error
        ? payload.error
        : payload?.message;
    });
    builder.addCase(login.fulfilled, (state) => {
      state.loginStatus = SUCCESS;
    });
    builder.addCase(forgotPassword.pending, (state) => {
      state.forgotPasswordStatus = PENDING;
    });
    builder.addCase(forgotPassword.rejected, (state, action) => {
      const { payload } = action;
      state.forgotPasswordStatus = FAILED;
      state.forgotPasswordStatusError = payload?.error
        ? payload.error
        : payload?.message;
    });
    builder.addCase(forgotPassword.fulfilled, (state) => {
      state.forgotPasswordStatus = SUCCESS;
    });
    builder.addCase(verifyOtp.pending, (state) => {
      state.verifyOtpStatus = PENDING;
    });
    builder.addCase(verifyOtp.rejected, (state, action) => {
      const { payload } = action;
      state.verifyOtpStatus = FAILED;
      state.verifyOtpStatusError = payload?.error
        ? payload.error
        : payload?.message;
    });
    builder.addCase(verifyOtp.fulfilled, (state) => {
      state.verifyOtpStatus = SUCCESS;
    });
    builder.addCase(newPassword.pending, (state) => {
      state.newPasswordStatus = PENDING;
    });
    builder.addCase(newPassword.rejected, (state, action) => {
      const { payload } = action;
      state.newPasswordStatus = FAILED;
      state.newPasswordStatusError = payload?.error
        ? payload.error
        : payload?.message;
    });
    builder.addCase(newPassword.fulfilled, (state) => {
      state.newPasswordStatus = SUCCESS;
    });
  },
});
export const {
  defaultLoginStatus,
  defaultInitiateSignupStatus,
  defaultVerifyOtpStatus,
  userLogOut,
  defaultForgotPasswordStatus,
  defaultFinalSignupStatus,
  defaultNewPasswordStatus,
} = authSlice.actions;
export default authSlice.reducer;
