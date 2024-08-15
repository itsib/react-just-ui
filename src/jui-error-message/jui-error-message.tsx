import { FC, useEffect, useMemo, useRef } from 'react';
import { ValidationError } from '../validators/types.ts';
import './jui-error-massage.css';

export interface IErrorMessage {
  error?: ValidationError | false;
}

export const ErrorMessage: FC<IErrorMessage> = ({ error }) => {
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
