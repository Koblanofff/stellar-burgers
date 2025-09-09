import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';

export const getIngredientData = createAsyncThunk(
  'burgerIngredients/getData',
  async () => {
    const res = await getIngredientsApi();
    return res;
  }
);

interface IngredientsState {
  data: TIngredient[];
  isIngredientsLoading: boolean;
  isInit: boolean;
  error: string | null;
}

const initialState: IngredientsState = {
  data: [],
  isIngredientsLoading: false,
  isInit: false,
  error: null
};

export const burgerIngredientsSlice = createSlice({
  name: 'burgerIngredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getIngredientData.pending, (state) => {
        state.isIngredientsLoading = true;
        state.error = null;
      })
      .addCase(getIngredientData.rejected, (state, action) => {
        state.isIngredientsLoading = false;
        state.error =
          action.error.message || 'Ошибка загрузки данных об ингредиентах';
        state.isInit = false;
      })
      .addCase(
        getIngredientData.fulfilled,
        (state, action: PayloadAction<TIngredient[]>) => {
          state.isIngredientsLoading = false;
          state.data = action.payload;
          state.isInit = true;
        }
      );
  },
  selectors: {
    burgerIngredientsSelector: (state) => state
  }
});

export default burgerIngredientsSlice.reducer;
export const { burgerIngredientsSelector } = burgerIngredientsSlice.selectors;
