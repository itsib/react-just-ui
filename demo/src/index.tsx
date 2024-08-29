import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom';
import { ROUTES } from './pages/routes.tsx';
import 'react-just-ui/themes/default.css';
import 'react-just-ui/styles.css';
import './i18n';
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={ROUTES} />
  </React.StrictMode>,
)
