import { LanguageRegistryService } from '../../features/profile/registries/language.registry';

describe('Profile System Security & Directional Isolation', () => {
  test('Assigns RTL text direction exclusively to Arabic language tag', () => {
    expect(LanguageRegistryService.getDirection('ar')).toBe('RTL');
    expect(LanguageRegistryService.getDirection('en')).toBe('LTR');
    expect(LanguageRegistryService.getDirection('ha')).toBe('LTR');
    expect(LanguageRegistryService.getDirection('fr')).toBe('LTR');
  });

  test('Rejects dangerous injection strings in language or currency parameters', () => {
    expect(LanguageRegistryService.isSupported('<script>alert(1)</script>')).toBe(false);
    expect(LanguageRegistryService.isSupported('en; DROP TABLE users;')).toBe(false);
  });
});
