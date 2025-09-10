import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { Outlet } from 'react-router-dom';

import { useDispatch, useSelector } from '@services/store';
import { getFeedsData, feedsSelector, stateSelector } from '@slices/feeds';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  const { isInit, isLoading } = useSelector(stateSelector);
  const orders: TOrder[] = useSelector(feedsSelector);

  useEffect(() => {
    if (!isInit) dispatch(getFeedsData());
  }, [dispatch, isInit]);

  if (!isInit || isLoading) {
    return <Preloader />;
  }

  const handleGetFeeds = () => {
    dispatch(getFeedsData());
  };

  return (
    <>
      <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
      <Outlet />
    </>
  );
};
