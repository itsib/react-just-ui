import { FC, useEffect, useRef } from 'react';
import './header.css'

export const Header: FC = () => {
  const themeBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const btn = themeBtnRef.current;
    if (!btn) return;

    const theme = window.matchMedia('(prefers-color-scheme: dark)');

    const switchTheme = (themeColor: string) => {
      if (themeColor === 'dark') {
        document.body.classList.remove('light');
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
        document.body.classList.add('light');
      }
    }

    const onClick = () => {
      const isDarkTheme = document.body.className ? document.body.classList.contains('dark') : theme.matches;
      switchTheme(isDarkTheme ? 'light' : 'dark');
    }

    const onThemeChange = () => {
      switchTheme(theme.matches ? 'dark' : 'light');
    }

    theme.addEventListener('change', onThemeChange);
    btn.addEventListener('click', onClick);
    onThemeChange();
    return () => {
      theme.removeEventListener('change', onThemeChange);
      btn.removeEventListener('click', onClick);
    };
  }, []);

  return (
    <header className="header">
      <div className="container">
        <div className="brand">
          <img src="/logo.svg" alt="logo" className="logo" />
          <div className="name">{import.meta.env.VITE_LIB_NAME}</div>
        </div>

        <button type="button" className="theme" ref={themeBtnRef}>
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24">
            <path fill="currentColor" d="M7.5 2c-1.79 1.15-3 3.18-3 5.5s1.21 4.35 3.03 5.5C4.46 13 2 10.54 2 7.5A5.5 5.5 0 0 1 7.5 2m11.57 1.5l1.43 1.43L4.93 20.5L3.5 19.07zm-6.18 2.43L11.41 5L9.97 6l.42-1.7L9 3.24l1.75-.12l.58-1.65L12 3.1l1.73.03l-1.35 1.13zm-3.3 3.61l-1.16-.73l-1.12.78l.34-1.32l-1.09-.83l1.36-.09l.45-1.29l.51 1.27l1.36.03l-1.05.87zM19 13.5a5.5 5.5 0 0 1-5.5 5.5c-1.22 0-2.35-.4-3.26-1.07l7.69-7.69c.67.91 1.07 2.04 1.07 3.26m-4.4 6.58l2.77-1.15l-.24 3.35zm4.33-2.7l1.15-2.77l2.2 2.54zm1.15-4.96l-1.14-2.78l3.34.24zM9.63 18.93l2.77 1.15l-2.53 2.19z"/>
          </svg>
        </button>
      </div>
    </header>
  );
};
