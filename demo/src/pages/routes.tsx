import { FC } from 'react';
import { createBrowserRouter as createRouter, isRouteErrorResponse, Navigate, useRouteError } from 'react-router-dom';
import { Home } from './home/home.tsx';
import { Layout } from './layout.tsx';
import { Input } from './input/input.tsx';
import { Select } from './select/select.tsx';
import { Textarea } from './textarea/textarea.tsx';
import { OptInput } from './opt-input/opt-input.tsx';
import { Switch } from './switch/switch.tsx';
import { Checkbox } from './checkbox/checkbox.tsx';
import { Tooltip } from './tooltip/tooltip.tsx';

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
      Component: Layout,
      ErrorBoundary,
      children: [
        {
          index: true,
          Component: Home
        },
        {
          path: 'input',
          Component: Input
        },
        {
          path: 'otp-input',
          Component: OptInput
        },
        {
          path: 'select',
          Component: Select
        },
        {
          path: 'textarea',
          Component: Textarea
        },
        {
          path: 'switch',
          Component: Switch
        },
        {
          path: 'checkbox',
          Component: Checkbox
        },
        {
          path: 'tooltip',
          Component: Tooltip
        },
      ]
    },
  ],
  { basename: '/' }
);
