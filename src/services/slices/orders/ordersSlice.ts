import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { orderBurgerApi, getOrdersApi, getOrderByNumberApi } from '@api';
import { TOrder } from '@utils-types';

export const makeNewOrder = createAsyncThunk(
  'order/makeNewOrder',
  async (data: string[]) => orderBurgerApi(data)
);

export const getOrdersHistory = createAsyncThunk('order/getOrders', async () =>
  getOrdersApi()
);

export const getOrderById = createAsyncThunk(
  'order/getOrderById',
  async (id: number) => getOrderByNumberApi(id)
);

interface OrderDetailsState {
  order: TOrder | null;
  name: string;
  success: boolean;
}

const orderInitialState: OrderDetailsState = {
  order: null,
  name: '',
  success: false
};

interface OrderState {
  newOrderData: OrderDetailsState | null;
  ordersHistory: TOrder[];
  modalOrderData: TOrder | null;
  viewedOrderData: TOrder | null;
  orderRequest: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  newOrderData: orderInitialState,
  ordersHistory: [],
  modalOrderData: null,
  viewedOrderData: null,
  orderRequest: false,
  isLoading: false,
  error: null
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearModalData(state) {
      state.modalOrderData = null;
    },
    setModalData(state, action) {
      state.modalOrderData = action.payload;
    },
    clearNewOrderData(state) {
      state.newOrderData = null;
    },
    clearViewedOrderData(state) {
      state.viewedOrderData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(makeNewOrder.pending, (state) => {
        state.orderRequest = true;
        state.isLoading = true;
        state.error = null;
      })
      .addCase(makeNewOrder.fulfilled, (state, action) => {
        state.newOrderData = action.payload;
        state.ordersHistory = [...state.ordersHistory, action.payload.order];
        state.orderRequest = false;
        state.isLoading = false;
      })
      .addCase(makeNewOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.orderRequest = false;
        state.error = action.error.message || 'Ошибка при отправке заказа';
      })
      .addCase(getOrdersHistory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrdersHistory.fulfilled, (state, action) => {
        state.ordersHistory = action.payload;
        state.isLoading = false;
      })
      .addCase(getOrdersHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || 'Ошибка при получении истории заказов';
      })
      .addCase(getOrderById.pending, (state) => {
        state.orderRequest = true;
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.viewedOrderData = action.payload.orders[0];
        state.orderRequest = false;
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.isLoading = false;
        state.orderRequest = false;
        state.error =
          action.error.message || 'Ошибка при запросе данных о заказе';
      });
  },
  selectors: {
    orderSelector: (state) => state,
    ordersHistorySelector: (state) => state.ordersHistory,
    orderDataByIdSelector: (state) => state.viewedOrderData
  }
});

export const { orderSelector, ordersHistorySelector, orderDataByIdSelector } =
  orderSlice.selectors;
export const {
  clearModalData,
  setModalData,
  clearNewOrderData,
  clearViewedOrderData
} = orderSlice.actions;

export default orderSlice.reducer;
