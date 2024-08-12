import { FC } from 'react';
import { createBrowserRouter as createRouter, isRouteErrorResponse, Navigate, useRouteError } from 'react-router-dom';
import { HomePage } from './home/home.page.tsx';
import { Layout } from './layout.tsx';
import { InputPage } from './input/input.page.tsx';
import { SelectPage } from './select/select.page.tsx';
import { TextareaPage } from './textarea/textarea.page.tsx';
import { OptInputPage } from './opt-input/opt-input.page.tsx';
import { SwitchPage } from './switch/switch.page.tsx';
import { CheckboxPage } from './checkbox/checkbox.page.tsx';
import { TooltipPage } from './tooltip/tooltip.page.tsx';
import { RadioPage } from './radio/radio.page.tsx';

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
          Component: HomePage
        },
        {
          path: 'input',
          Component: InputPage
        },
        {
          path: 'otp-input',
          Component: OptInputPage
        },
        {
          path: 'select',
          Component: SelectPage
        },
        {
          path: 'textarea',
          Component: TextareaPage
        },
        {
          path: 'switch',
          Component: SwitchPage
        },
        {
          path: 'checkbox',
          Component: CheckboxPage
        },
        {
          path: 'radio',
          Component: RadioPage
        },
        {
          path: 'tooltip',
          Component: TooltipPage
        },
      ]
    },
  ],
  { basename: '/' }
);
