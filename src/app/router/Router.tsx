import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';

import RootLayout from '../layout/RootLayout';
import HomePage from '../../pages/home/Home';
import LoginPage from '../../pages/login/Login';
import PrivateRoute from './PrivateRoute';
import UsersPage from '../../pages/users/Users';
import SpacePage from '../../pages/space/Space';
import CalendarPage from '../../pages/calendar/CalendarPage';
import { Profile } from '../../pages/profile';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<RootLayout />}>
        <Route
          index
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <UsersPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/spaces"
          element={
            <PrivateRoute>
              <SpacePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <PrivateRoute>
              <CalendarPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
      </Route>
      <Route path="/login" element={<LoginPage />} />
    </>,
  ),
);

export default router;
