import { FC, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';

import { useSelector, useDispatch } from '@services/store';
import { burgerIngredientsSelector } from '@services/slices/burger-ingredients';
import { orderDataByIdSelector, getOrderById } from '@services/slices/orders';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const { number } = useParams();
  const id = Number(number);

  const viewedOrderData = useSelector(orderDataByIdSelector);

  useEffect(() => {
    if (id && !isNaN(id)) {
      dispatch(getOrderById(id));
    }
  }, [dispatch]);

  const ingredients: TIngredient[] = useSelector(
    burgerIngredientsSelector
  ).data;

  const orderInfo = useMemo(() => {
    if (!viewedOrderData || !ingredients.length) return null;

    const date = new Date(viewedOrderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = viewedOrderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...viewedOrderData,
      ingredientsInfo,
      date,
      total
    };
  }, [viewedOrderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
