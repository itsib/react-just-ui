import * as i18next from 'react-i18next';

const I18NEXT = {
  t: (message: string) => {
    return message;
  }
}

export const useTranslation = i18next?.useTranslation || function () {
  return I18NEXT;
};
