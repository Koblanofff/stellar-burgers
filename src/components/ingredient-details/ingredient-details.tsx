import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';

import { useSelector } from '@services/store';
import { burgerIngredientsSelector } from '@services/slices/burger-ingredients';

export const IngredientDetails: FC = () => {
  const { id } = useParams();
  const ingredientData = useSelector(burgerIngredientsSelector).data.find(
    (item) => item._id === id
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
