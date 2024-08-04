import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/header/header.tsx';
import { LeftMenu } from '../components/left-menu/left-menu.tsx';
import './layout.css'

export const Layout: FC = () => {

  return (
    <div className="layout">
      <Header />

      <div className="container">
        <LeftMenu />

        <div className="page">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
