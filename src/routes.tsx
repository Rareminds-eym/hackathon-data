import { RouteObject } from 'react-router-dom';
import LoginScreen from './components/LoginScreen';
import NotFoundScreen from './components/NotFoundScreen';

const routes: RouteObject[] = [
  // DashboardScreen route is handled in App.tsx with all required props
  {
    path: '/login',
    element: <LoginScreen onLogin={() => {}} />,
  },
  {
    path: '*',
    element: <NotFoundScreen />,
  },
];

export default routes;
