import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { v4 as uuid4 } from 'uuid';

interface BurgerConstructorState {
  bun: TIngredient | null;
  ingredients: (TIngredient & { id: string })[];
}

const initialState: BurgerConstructorState = {
  bun: null,
  ingredients: []
};

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addBun(state, action: PayloadAction<TIngredient>) {
      state.bun = action.payload;
    },
    removeBun(state) {
      state.bun = null;
    },
    addIngredient: {
      reducer: (state, action: PayloadAction<TIngredient & { id: string }>) => {
        state.ingredients.push(action.payload);
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: uuid4() }
      })
    },
    removeIngredient(state, action: PayloadAction<string>) {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload
      );
    },
    moveIngredientUp(state, action: PayloadAction<number>) {
      const index = action.payload;
      if (index <= 0 || index >= state.ingredients.length) return;
      [state.ingredients[index - 1], state.ingredients[index]] = [
        state.ingredients[index],
        state.ingredients[index - 1]
      ];
    },
    moveIngredientDown(state, action: PayloadAction<number>) {
      const index = action.payload;
      if (index < 0 || index >= state.ingredients.length - 1) return;
      [state.ingredients[index], state.ingredients[index + 1]] = [
        state.ingredients[index + 1],
        state.ingredients[index]
      ];
    },
    clearAllIngredients(state) {
      state.bun = null;
      state.ingredients = [];
    }
  },
  selectors: {
    ingredientsSelector: (state) => state
  }
});

export const {
  addBun,
  removeBun,
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearAllIngredients
} = burgerConstructorSlice.actions;

export const { ingredientsSelector } = burgerConstructorSlice.selectors;

export default burgerConstructorSlice.reducer;
