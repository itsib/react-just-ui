import { FC, useEffect, useRef } from 'react';
import { ValidationError } from './types';
import './subscript.scss';
import { prefixedCN } from './intermal/css-class';

export interface ISubscript {
  error?: ValidationError | false;
  hint?: string;
}

export const Subscript: FC<ISubscript> = ({ error }) => {
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
    <div className={prefixedCN('subscript')} role="alert" ref={ref}>
      <div />
    </div>
  )
};
