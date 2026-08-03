/**
 * Quantity & Date Formatting Services
 * Phase 11 — MIZAN Multilingual Explanation and Localization System
 */

export class QuantityFormattingService {
  public static formatQuantity(
    quantity: number | string,
    unitId?: string,
    localeTag: string = 'en-NG'
  ): string {
    const num = typeof quantity === 'string' ? parseFloat(quantity) : quantity;
    if (isNaN(num)) return '0';

    const formattedNum = num.toLocaleString('en-US'); // Locale grouping
    if (!unitId) return formattedNum;

    const unitLabels: Record<string, Record<string, string>> = {
      KILOGRAM: { en: 'kg', ha: 'kg', ar: 'كجم' },
      TONNE: { en: 'tonnes', ha: 'tonnes', ar: 'طن' },
      WASQ: { en: 'Wasq', ha: 'Wasq', ar: 'وسق' },
      SA: { en: 'Sa’', ha: 'Sa’i', ar: 'صاع' },
      HEAD: { en: 'head', ha: 'kai', ar: 'رأس' },
    };

    const label = unitLabels[unitId]?.['en'] || unitId;
    return `${formattedNum} ${label}`;
  }
}

export class DateFormattingService {
  public static formatDate(dateInput: Date | string, localeTag: string = 'en-NG'): string {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return String(dateInput);
    return d.toLocaleDateString(localeTag, { year: 'numeric', month: 'short', day: 'numeric' });
  }
}
