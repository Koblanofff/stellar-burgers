import { FC, useMemo } from 'react';
import { useEffect } from 'react';
import { BurgerConstructorUI } from '@ui';

import { useSelector, useDispatch } from '@services/store';
import { ingredientsSelector } from '@slices/burger-constructor';
import {
  makeNewOrder,
  orderSelector,
  setModalData,
  clearModalData
} from '@services/slices/orders';
import { clearAllIngredients } from '@services/slices/burger-constructor/burgerConstructorSlice';
import { userStateSelector } from '@services/slices/user';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const constructorItems = useSelector(ingredientsSelector);
  const { isAuthed } = useSelector(userStateSelector);
  const orderIngredientsIds = [
    constructorItems.bun?._id ?? '',
    ...constructorItems.ingredients.map((item) => item._id)
  ];

  const orderRequest = useSelector(orderSelector).orderRequest;
  let orderModalData = useSelector(orderSelector).modalOrderData;

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest || !isAuthed) return;

    dispatch(makeNewOrder(orderIngredientsIds))
      .unwrap()
      .then((res) => {
        dispatch(setModalData(res.order));
      });
  };
  const closeOrderModal = () => {
    dispatch(clearModalData());
    dispatch(clearAllIngredients());
  };

  const price = useMemo(() => {
    const bunPrice = constructorItems.bun ? constructorItems.bun.price * 2 : 0;

    const ingredientsPrice = constructorItems.ingredients.reduce(
      (s, i) => s + i.price,
      0
    );

    return bunPrice + ingredientsPrice;
  }, [constructorItems]);

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
