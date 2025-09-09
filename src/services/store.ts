import { configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import userReducer from '@slices/user/userSlice';
import burgerIngredientsReducer from '@slices/burger-ingredients/burgerIngredientsSlice';
import burgerConstructorReducer from '@slices/burger-constructor/burgerConstructorSlice';
import feedsReducer from '@slices/feeds/feedsSlice';
import orderReducer from '@slices/orders/ordersSlice';

const rootReducer = {
  user: userReducer,
  burgerIngredients: burgerIngredientsReducer,
  burgerConstructor: burgerConstructorReducer,
  feeds: feedsReducer,
  order: orderReducer
};

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = dispatchHook;
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
