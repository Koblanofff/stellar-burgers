import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';

import store, { useDispatch, useSelector } from '@services/store';
import { getUserThunk, userStateSelector, init } from '@slices/user';
import { getIngredientData } from '@services/slices/burger-ingredients';
import { Preloader } from '@ui';
import { Layout, ProtectedRoute } from '@components';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  FeedModal,
  IngredientModal,
  NotFound404
} from '@pages';

import '../../index.css';
import styles from './app.module.css';
import { getCookie } from '@utils/cookie';

const AppContent = () => {
  const location = useLocation();
  const background = location.state?.background;
  const dispatch = useDispatch();
  const { isInit, isLoading } = useSelector(userStateSelector);

  useEffect(() => {
    const accessToken = getCookie('accessToken');

    if (accessToken) {
      dispatch(getUserThunk());
    } else {
      dispatch(init());
    }

    dispatch(getIngredientData());
  }, [dispatch]);

  if (!isInit || isLoading) {
    return <Preloader />;
  }

  return (
    <>
      <Routes location={background || location}>
        <Route element={<Layout />}>
          <Route path='/' element={<ConstructorPage />} />

          <Route path='/feed' element={<Feed />} />
          <Route path='/feed/:number' element={<FeedModal />} />

          <Route
            path='/login'
            element={
              <ProtectedRoute>
                <Login />
              </ProtectedRoute>
            }
          />
          <Route
            path='/register'
            element={
              <ProtectedRoute>
                <Register />
              </ProtectedRoute>
            }
          />
          <Route
            path='/forgot-password'
            element={
              <ProtectedRoute>
                <ForgotPassword />
              </ProtectedRoute>
            }
          />
          <Route
            path='/reset-password'
            element={
              <ProtectedRoute>
                <ResetPassword />
              </ProtectedRoute>
            }
          />

          <Route
            path='/profile'
            element={
              <ProtectedRoute options={{ authIsRequired: true }}>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path='/profile/orders'
            element={
              <ProtectedRoute options={{ authIsRequired: true }}>
                <ProfileOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute options={{ authIsRequired: true }}>
                <FeedModal />
              </ProtectedRoute>
            }
          />

          <Route path='/ingredients/:id' element={<IngredientModal />} />

          <Route path='*' element={<NotFound404 />} />
        </Route>
      </Routes>

      {background && (
        <Routes>
          <Route path='/feed/:number' element={<FeedModal />} />
          <Route path='/ingredients/:id' element={<IngredientModal />} />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute options={{ authIsRequired: true }}>
                <FeedModal />
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </>
  );
};

const App = () => (
  <Provider store={store}>
    <div className={styles.app}>
      <AppContent />
    </div>
  </Provider>
);

export default App;
