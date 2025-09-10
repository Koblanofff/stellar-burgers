import { useNavigate, useLocation } from 'react-router-dom';

import { Modal, IngredientDetails } from '@components';

export const IngredientModal = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClose = () => {
    if (location.state) navigate(-1);
    else navigate('/');
  };

  return (
    <Modal title='Детали ингредиента' onClose={handleClose}>
      <IngredientDetails />
    </Modal>
  );
};
