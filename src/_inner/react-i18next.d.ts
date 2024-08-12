declare module 'react-i18next' {
  interface I18Next {
    t(message: string, ...rest: any[]): string;
  }
  function useTranslation(): I18Next;
}