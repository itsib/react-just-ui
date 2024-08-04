import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import './left-menu.css'

export interface ILeftMenu {

}

export const LeftMenu: FC<ILeftMenu> = () => {
  useTranslation();

  return (
    <nav className="left-menu">
      <NavLink to="/" className="nav-link">
        <div className="nav-icon">
          <i className="icon icon-home"/>
        </div>
        <span className="label">
          <Trans i18nKey="home"/>
        </span>
      </NavLink>

      <h4 className="caption">
        <Trans i18nKey="components"/>
      </h4>

      <NavLink to="/input" className="nav-link">
        <div className="nav-icon">
          <i className="icon icon-input" />
        </div>
        <span className="label">
          <Trans i18nKey="input"/>
        </span>
      </NavLink>
      <NavLink to="/otp-input" className="nav-link">
        <div className="nav-icon">
          <i className="icon icon-key"/>
        </div>
        <span className="label">
          <Trans i18nKey="otp_input"/>
        </span>
      </NavLink>
      <NavLink to="/select" className="nav-link">
        <div className="nav-icon">
          <i className="icon icon-select"/>
        </div>
        <span className="label">
          <Trans i18nKey="select"/>
        </span>
      </NavLink>
      <NavLink to="/textarea" className="nav-link">
        <div className="nav-icon">
          <i className="icon icon-textarea"/>
        </div>
        <span className="label">
          <Trans i18nKey="textarea"/>
        </span>
      </NavLink>
      <NavLink to="/switch" className="nav-link">
        <div className="nav-icon">
          <i className="icon icon-switch"/>
        </div>
        <span className="label">
          <Trans i18nKey="switch"/>
        </span>
      </NavLink>
      <NavLink to="/checkbox" className="nav-link">
        <div className="nav-icon">
          <i className="icon icon-checkbox"/>
        </div>
        <span className="label">
          <Trans i18nKey="checkbox"/>
        </span>
      </NavLink>
      <NavLink to="/tooltip" className="nav-link">
        <div className="nav-icon">
          <i className="icon icon-tooltip"/>
        </div>
        <span className="label">
          <Trans i18nKey="tooltip"/>
        </span>
      </NavLink>
    </nav>
  );
};
