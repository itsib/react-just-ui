import { FC, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from '../_inner/react-i18next.resolved.ts';
import { ValidationError } from '../types';
import './jui-error-massage.css';

export interface IErrorMessage {
  error?: ValidationError | false;
}

export const ErrorMessage: FC<IErrorMessage> = ({ error }) => {
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

  return (
    <div className={`jui jui-error-message ${message ? 'active' : ''}`} role="alert">
      <div>{message || messageRef.current}</div>
    </div>
  )
};
