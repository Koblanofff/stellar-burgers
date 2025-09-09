import { useNavigate, useParams, useLocation } from 'react-router-dom';

import { Modal, OrderInfo } from '@components';

export const FeedModal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { number } = useParams();

  const handleClose = () => {
    if (location.state) navigate(-1);
    else navigate('/');
  };

  return (
    <Modal title={`#${number}`} onClose={handleClose}>
      <OrderInfo />
    </Modal>
  );
};
