import { FC } from 'react';
import { createBrowserRouter as createRouter, isRouteErrorResponse, Navigate, useRouteError } from 'react-router-dom';
import { Home } from './home/home.tsx';

const ErrorBoundary: FC = () => {
  const error = useRouteError();
  console.error(error);
  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return <Navigate to="/error-404" replace />;
    }
  }
  return <div>{error?.toString()}</div>;
};

export const ROUTES = createRouter(
  [
    {
      path: '/',
      element: <Home />,
      ErrorBoundary,
    },
  ],
  { basename: '/' }
);
