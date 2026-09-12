import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export function RTLWrapper({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <div dir={i18n.language === 'ar' ? 'rtl' : 'ltr'} lang={i18n.language} className="w-full min-h-screen">
      {children}
    </div>
  );
}

