import { FC, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ValidationError } from '../types';
import './jui-error.css';

export interface IControlError {
  error?: ValidationError | false;
}

export const JuiError: FC<IControlError> = ({ error }) => {
  const { t } = useTranslation();
  const messageRef = useRef<string | undefined>();

  const message = useMemo(() => {
    if (!error || !error.message) {
      return null;
    }
    return t(error.message);
  }, [error, t]);

  useEffect(() => {
    if (message) {
      messageRef.current = message;
    }
  }, [message]);

  return error === false ? null : (
    <div className={`jui jui-error ${message ? 'active' : ''}`} role="alert">
      <div>{message || messageRef.current}</div>
    </div>
  );
};
