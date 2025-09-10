import { useNavigate, useParams, useLocation } from 'react-router-dom';

import { useDispatch } from '@services/store';
import { clearViewedOrderData } from '@services/slices/orders/ordersSlice';
import { Modal, OrderInfo } from '@components';

export const FeedModal = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { number } = useParams();

  const handleClose = () => {
    dispatch(clearViewedOrderData());
    if (location.state) navigate(-1);
    else navigate('/');
  };

  return (
    <Modal title={`#${number}`} onClose={handleClose}>
      <OrderInfo />
    </Modal>
  );
};
