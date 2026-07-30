export enum Madhhab {
  HANAFI = 'HANAFI',
  MALIKI = 'MALIKI',
  SHAFI = 'SHAFI',
  HANBALI = 'HANBALI',
  JAFARI = 'JAFARI'
}

export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  NGN = 'NGN',
  SAR = 'SAR',
  AED = 'AED',
  IDR = 'IDR',
  PKR = 'PKR',
  MYR = 'MYR',
  EGP = 'EGP',
  TRY = 'TRY'
}

export enum Language {
  EN = 'EN',
  AR = 'AR',
  UR = 'UR',
  ID = 'ID',
  FR = 'FR'
}

export interface UserSettings {
  madhhab: Madhhab;
  currency: Currency;
  language: Language;
  notificationsEnabled: boolean;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  settings: UserSettings;
  createdAt: string;
  updatedAt: string;
}
