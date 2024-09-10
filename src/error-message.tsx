import { useEffect, useRef } from 'react';
import { ValidationError } from './types';
import './error-message.css';

export interface IErrorMessage {
  error?: ValidationError | false;
}

export const ErrorMessage = ({ error }: IErrorMessage) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const message = error && error.message || null;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const div = element.firstChild as HTMLDivElement;

    if (message) {
      div.innerHTML = message;
      element.classList.add('active');
    } else {
      const timer = setTimeout(() => (div.innerHTML = ''), 200);
      element.classList.remove('active');

      return () => {
        div.innerHTML = '';
        clearTimeout(timer);
      };
    }
  }, [message]);

  return (
    <div className="jui jui-error-message" role="alert" ref={ref}>
      <div />
    </div>
  )
};
