import { Outlet } from 'react-router-dom';
import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '@services/store';
import {
  ordersHistorySelector,
  getOrdersHistory
} from '@services/slices/orders';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOrdersHistory());
  }, [dispatch]);

  const orders: TOrder[] = useSelector(ordersHistorySelector);

  return (
    <>
      <ProfileOrdersUI orders={orders} />;
      <Outlet />
    </>
  );
};
