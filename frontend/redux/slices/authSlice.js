import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// pending / fullfiled / rejected
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (data, thunkAPI) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/register",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (data, thunkAPI) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/login",
        data
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const updateUser = createAsyncThunk(
  "auth/updateUser",
  async (formData, thunkAPI) => {
    console.log(formData._id);
    try {
      const response = await axios.put(
        `http://localhost:8000/api/auth/update_user/${formData.get("_id")}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

let initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  token: null,
  account_created: false,
  msg: null,
  accounted_updated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    logout: (state) => {
      return (state = initialState);
    },
    resetAuthMessages: (state) => {
      state.error = null;
      state.msg = null;
      state.account_created = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.error) {
          state.error = action.payload.error;
        } else {
          state.user = action.payload.user;
          state.account_created = true;
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        (state.token = null), (state.msg = null);
        state.isAuthenticated = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.error) {
          state.error = action.payload.error;
        } else {
          state.user = action.payload.user;
          state.isAuthenticated = true;
          state.token = action.payload.token;
          state.msg = action.payload.msg;
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.account_created = false;
        state.accounted_updated = false;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.loading = false;
        if (action.payload.error) {
          state.error = action.payload.error;
        } else {
          state.user = action.payload;
          state.false = true;
          state.accounted_updated = true;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, resetAuthMessages } = authSlice.actions;

export default authSlice.reducer;
