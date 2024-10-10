import { FC, useEffect, useRef, useState } from 'react';
import { ValidationError } from './types';
import './subscript.scss';

export interface ISubscript {
  error?: ValidationError | false;
  hint?: string;
}

export const Subscript: FC<ISubscript> = ({ error, hint }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const message = error && error.message || null;

  const [messageCopy, setMessageCopy] = useState<string | null>(message);
  const [hintCopy, setHintCopy] = useState<string | null>(hint || null);

  useEffect(() => {
    if (message) {
      setMessageCopy(message);
    } else {
      const timer = setTimeout(() => setMessageCopy(null), 200);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [message]);

  useEffect(() => {
    if (hint) {
      setHintCopy(hint);
    } else {
      const timer = setTimeout(() => setHintCopy(null), 200);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [hint]);

  return (
    <div className="__prefix__ __prefix__-subscript" role="alert" ref={ref}>
      <div className={`error ${message ? 'active' : ''}`}>{message || messageCopy}</div>
      <div className={`hint ${!message && !messageCopy && hint ? 'active' : ''}`}>{hint || hintCopy}</div>
    </div>
  )
};
