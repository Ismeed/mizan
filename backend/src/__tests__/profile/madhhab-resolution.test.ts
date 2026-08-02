import { MadhhabRegistryService } from '../../features/profile/registries/madhhab.registry';

describe('Madhhab Registry & Resolution Gating', () => {
  test('Validates active 5 Madhhabs definitions', () => {
    const all = MadhhabRegistryService.getAll();
    expect(all.length).toBe(5);

    const codes = all.map(m => m.code);
    expect(codes).toContain('HANAFI');
    expect(codes).toContain('MALIKI');
    expect(codes).toContain('SHAFII');
    expect(codes).toContain('HANBALI');
    expect(codes).toContain('JAFARI');
  });

  test('Rejects unrecognized or malformed madhhab identifiers', () => {
    expect(MadhhabRegistryService.isSupported('UNKNOWN_SCHOOL')).toBe(false);
    expect(MadhhabRegistryService.isSupported('')).toBe(false);
  });

  test('Retrieves multilingual localized display names without altering machine code', () => {
    const maliki = MadhhabRegistryService.get('MALIKI');
    expect(maliki?.code).toBe('MALIKI');
    expect(maliki?.name.en).toBe('Maliki School');
    expect(maliki?.name.ha).toBe('Makaranta Malikiyya');
    expect(maliki?.name.ar).toBe('المذهب المالكي');
  });
});
