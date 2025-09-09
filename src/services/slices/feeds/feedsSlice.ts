import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getFeedsApi, TFeedsResponse } from '@api';
import { TOrder } from '@utils-types';

export const getFeedsData = createAsyncThunk(
  'feeds/getData',
  async () => await getFeedsApi()
);

interface FeedsSTate {
  feeds: TFeedsResponse;
  isInit: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialFeedsState: TFeedsResponse = {
  success: false,
  orders: [],
  total: 0,
  totalToday: 0
};

const initialState: FeedsSTate = {
  feeds: initialFeedsState,
  isInit: false,
  isLoading: false,
  error: null
};

export const feedsSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(getFeedsData.pending, (state) => {
        state.isInit = true;
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFeedsData.fulfilled, (state, action) => {
        state.feeds = action.payload;
        state.isLoading = false;
      })
      .addCase(getFeedsData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка запроса списка заказов';
      }),
  selectors: {
    stateSelector: (state) => state,
    feedsSelector: (state) => state.feeds.orders
  }
});

export const { stateSelector, feedsSelector } = feedsSlice.selectors;

export default feedsSlice.reducer;
