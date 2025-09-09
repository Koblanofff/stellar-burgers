import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

interface BurgerConstructorState {
  bun: TIngredient | null;
  ingredients: TIngredient[];
}

const initialState: BurgerConstructorState = {
  bun: null,
  ingredients: []
};

export const BurgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addBun(state, action: PayloadAction<TIngredient>) {
      state.bun = action.payload;
    },
    removeBun(state) {
      state.bun = null;
    },
    addIngredient(state, action: PayloadAction<TIngredient>) {
      state.ingredients = [...state.ingredients, action.payload];
    },
    removeIngredient(state, action: PayloadAction<string>) {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient._id !== action.payload
      );
    },
    clearAllIngredients(state) {
      state.ingredients = [];
      state.bun = null;
    }
  },
  selectors: {
    ingredientsSelector: (state) => state
  }
});

export const { ingredientsSelector } = BurgerConstructorSlice.selectors;
export const {
  addBun,
  removeBun,
  addIngredient,
  removeIngredient,
  clearAllIngredients
} = BurgerConstructorSlice.actions;

export default BurgerConstructorSlice.reducer;
