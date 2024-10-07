import { useTranslation } from 'next-i18next';

export const useDirection = () => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const dir = i18n.dir(currentLanguage); 
  const isRTL = dir === 'rtl'; 

  return { dir, isRTL };
};