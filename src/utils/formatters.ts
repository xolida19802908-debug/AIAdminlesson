import { CurrencyCode, LanguageCode } from '../types';

export function formatCurrency(amount: number, currency: CurrencyCode = 'UZS'): string {
  const rounded = Math.round(amount);
  const formatted = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  switch (currency) {
    case 'UZS':
      return `${formatted} UZS`;
    case 'USD':
      return `$${formatted}`;
    case 'EUR':
      return `€${formatted}`;
    case 'RUB':
      return `${formatted} ₽`;
    default:
      return `${formatted} ${currency}`;
  }
}

export function formatDateLabel(dateStr: string, language: LanguageCode = 'uz'): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;

  const localeMap: Record<LanguageCode, string> = {
    uz: 'uz-UZ',
    en: 'en-US',
    ru: 'ru-RU',
  };

  return date.toLocaleDateString(localeMap[language] || 'en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function getInitials(name: string): string {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function truncate(text: string, length = 32): string {
  if (!text) return '';
  return text.length > length ? text.substring(0, length) + '…' : text;
}
