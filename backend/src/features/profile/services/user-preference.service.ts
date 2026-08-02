import { prisma } from '../../../config/database';
import { MadhhabCode } from '@mizan/shared';
import { MadhhabRegistryService } from '../registries/madhhab.registry';
import { CurrencyRegistryService } from '../registries/currency.registry';
import { LanguageRegistryService } from '../registries/language.registry';

export interface UserPreferenceInput {
  preferredMadhhab?: MadhhabCode;
  preferredCurrency?: string;
  preferredLanguage?: string;
  countryCode?: string;
  timezone?: string;
}

export class UserPreferenceService {
  /**
   * Retrieves or creates default user preferences.
   * Pulls legacy values from AppSettings if UserPreference is not yet created.
   */
  static async getOrCreate(userId: string) {
    let pref = await prisma.userPreference.findUnique({
      where: { user_id: userId },
    });

    if (!pref) {
      // Check legacy AppSettings
      const appSettings = await prisma.appSettings.findUnique({
        where: { user_id: userId },
      });

      const madhhab = (appSettings?.madhhab || 'MALIKI').toUpperCase() as MadhhabCode;
      const currency = appSettings?.currency || 'NGN';
      const language = appSettings?.language || 'en';
      const country = appSettings?.country || 'NG';

      pref = await prisma.userPreference.create({
        data: {
          user_id: userId,
          preferred_madhhab: MadhhabRegistryService.isSupported(madhhab) ? madhhab : 'MALIKI',
          preferred_currency: CurrencyRegistryService.isSupported(currency) ? currency.toUpperCase() : 'NGN',
          preferred_language: LanguageRegistryService.isSupported(language) ? language.toLowerCase() : 'en',
          preferred_locale: LanguageRegistryService.get(language)?.locale || 'en-NG',
          country_code: country,
          timezone: 'Africa/Lagos',
        },
      });
    }

    return pref;
  }

  /**
   * Updates user preferences after strict validation.
   */
  static async update(userId: string, input: UserPreferenceInput) {
    await this.getOrCreate(userId);

    const dataToUpdate: any = {};

    if (input.preferredMadhhab) {
      const madhhab = input.preferredMadhhab.toUpperCase() as MadhhabCode;
      if (!MadhhabRegistryService.isSupported(madhhab)) {
        throw new Error(`Unsupported Madhhab: '${input.preferredMadhhab}'`);
      }
      dataToUpdate.preferred_madhhab = madhhab;
    }

    if (input.preferredCurrency) {
      const currency = input.preferredCurrency.toUpperCase();
      if (!CurrencyRegistryService.isSupported(currency)) {
        throw new Error(`Unsupported currency code: '${input.preferredCurrency}'`);
      }
      dataToUpdate.preferred_currency = currency;
    }

    if (input.preferredLanguage) {
      const lang = input.preferredLanguage.toLowerCase();
      if (!LanguageRegistryService.isSupported(lang)) {
        throw new Error(`Unsupported language tag: '${input.preferredLanguage}'`);
      }
      dataToUpdate.preferred_language = lang;
      dataToUpdate.preferred_locale = LanguageRegistryService.get(lang)?.locale || 'en-US';
    }

    if (input.countryCode) {
      dataToUpdate.country_code = input.countryCode.toUpperCase();
    }

    if (input.timezone) {
      dataToUpdate.timezone = input.timezone;
    }

    return prisma.userPreference.update({
      where: { user_id: userId },
      data: dataToUpdate,
    });
  }
}
