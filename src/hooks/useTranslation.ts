import { useAuthStore } from '@/store/authStore';
import { t, type TranslationKey, type Locale } from '@/i18n';

export function useTranslation() {
  const language = useAuthStore((s) => s.profile?.language ?? 'en') as Locale;
  return {
    locale: language,
    t: (key: TranslationKey) => t(language, key),
  };
}
