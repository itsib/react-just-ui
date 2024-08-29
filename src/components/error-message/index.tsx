import { useEffect, useMemo, useRef } from 'react';
import type { ValidationError } from '@types';
import './styles.css';

export interface IErrorMessage {
  error?: ValidationError | false;
}

export const ErrorMessage = ({ error }: IErrorMessage) => {
  const messageRef = useRef<string | undefined>();

  const message = useMemo(() => {
    if (!error || !error.message) {
      return null;
    }
    return error.message;
  }, [error]);

  useEffect(() => {
    if (message) {
      messageRef.current = message;
    }
  }, [message]);

  return (
    <div className={`jui jui-error-message ${error ? 'active' : ''}`} role="alert">
      <div>{message || messageRef.current}</div>
    </div>
  )
};
