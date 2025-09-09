import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { setCookie } from '@utils/cookie';
import { TAuthResponse } from '@api';

import {
  registerUserApi,
  loginUserApi,
  getUserApi,
  updateUserApi,
  forgotPasswordApi,
  resetPasswordApi,
  TRegisterData,
  TLoginData,
  TUserResponse
} from '@api';
import { TUser } from '@utils-types';

interface userState {
  userData: TUser | null;
  isAuthed: boolean;
  isLoading: boolean;
  isInit: boolean;
  error: string | null;
}

const initialState: userState = {
  userData: null,
  isAuthed: false,
  isLoading: false,
  isInit: false,
  error: null
};

const setJWT = (serverResponseData: TAuthResponse) => {
  const { accessToken, refreshToken } = serverResponseData;
  setCookie('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

export const registerUser = createAsyncThunk(
  'user/register',
  async (formData: TRegisterData) => {
    const res = await registerUserApi(formData);
    setJWT(res);
    return res;
  }
);

export const loginUser = createAsyncThunk(
  'user/login',
  async (formData: TLoginData) => {
    const res = await loginUserApi(formData);
    setJWT(res);
    return res;
  }
);

export const getUserThunk = createAsyncThunk(
  'user/getUser',
  async () => await getUserApi()
);

export const updateUserThunk = createAsyncThunk(
  'user/updateData',
  async (newData: Partial<TRegisterData>) => await updateUserApi(newData)
);

export const forgotPassword = createAsyncThunk(
  'user/forgotPassword',
  async (data: { email: string }) => await forgotPasswordApi(data)
);

export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async (data: { password: string; token: string }) =>
    await resetPasswordApi(data)
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    init(state) {
      state.isInit = true;
    },
    logout(state) {
      state.userData = null;
      state.isAuthed = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.userData = action.payload.user;
        state.isAuthed = true;
        state.isLoading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || 'Ошибка при регистрации пользователя';
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.userData = action.payload.user;
        state.isLoading = false;
        state.isAuthed = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || 'Ошибка аутентификации пользователя';
      })
      .addCase(getUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getUserThunk.fulfilled,
        (state, action: PayloadAction<TUserResponse>) => {
          state.userData = action.payload.user;
          state.isAuthed = true;
          state.isLoading = false;
          state.isInit = true;
        }
      )
      .addCase(getUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || 'Ошибка загрузки данных пользователя';
        state.isInit = true;
      })
      .addCase(updateUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userData = action.payload.user;
      })
      .addCase(updateUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || 'Ошибка обновления данных пользователя';
      })
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка при отправке запроса';
      });
  },
  selectors: {
    userStateSelector: (state) => state,
    userDataSelector: (state) => state.userData
  }
});

export const { userStateSelector, userDataSelector } = userSlice.selectors;
export const { init, logout } = userSlice.actions;

export default userSlice.reducer;
