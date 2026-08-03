import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Modal,
  TextInput, FlatList, TouchableWithoutFeedback,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeScreen } from '../../src/components/layout/SafeScreen';
import { Header } from '../../src/components/layout/Header';
import { Avatar } from '../../src/components/ui/Avatar';
import { Badge } from '../../src/components/ui/Badge';
import { Divider } from '../../src/components/ui/Divider';
import { colors } from '../../src/constants/colors';
import { typography } from '../../src/constants/typography';
import { spacing, borderRadius } from '../../src/constants/spacing';
import { useAuth } from '../../src/hooks/useAuth';
import { useSettingsStore, MadhhabCode, CurrencyCode, LanguageCode } from '../../src/stores/settings.store';
import { MadhhabProvider } from '../../src/providers/madhhab.provider';
import { SUPPORTED_CURRENCIES, getCurrencyInfo, getCurrencySymbol } from '../../src/utils/currency.utils';
import { useTranslation } from '../../src/i18n/useTranslation';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { t, isRTL } = useTranslation();
  const { 
    theme, setTheme, 
    language, setLanguage, 
    madhhab, setMadhhab,
    currency, setCurrency,
    hapticsEnabled, toggleHaptics 
  } = useSettingsStore();

  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [madhhabModalVisible, setMadhhabModalVisible] = useState(false);
  const [currencyModalVisible, setCurrencyModalVisible] = useState(false);
  const [currencySearch, setCurrencySearch] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleLogout = async () => {
    await logout();
    // AuthGuard will redirect to /(auth) once status becomes UNAUTHENTICATED
    router.replace('/(auth)');
  };

  const handleSelectLanguage = async (lang: LanguageCode) => {
    await setLanguage(lang);
    setLanguageModalVisible(false);
    showToast(t('preferenceUpdated'));
  };

  const handleSelectMadhhab = async (code: MadhhabCode) => {
    await setMadhhab(code);
    setMadhhabModalVisible(false);
    showToast(t('preferenceUpdated'));
  };

  const handleSelectCurrency = async (code: CurrencyCode) => {
    await setCurrency(code);
    setCurrencyModalVisible(false);
    setCurrencySearch('');
    showToast(t('preferenceUpdated'));
  };

  const languageOptions: Array<{ code: LanguageCode; label: string; native: string; supported: boolean }> = [
    { code: 'en', label: 'English', native: 'English', supported: true },
    { code: 'ar', label: 'Arabic', native: 'العربية', supported: true },
    { code: 'ha', label: 'Hausa', native: 'Hausa', supported: true },
    { code: 'fr', label: 'French', native: 'Français', supported: false },
    { code: 'ur', label: 'Urdu', native: 'اردو', supported: false },
    { code: 'tr', label: 'Turkish', native: 'Türkçe', supported: false },
  ];

  const filteredCurrencies = SUPPORTED_CURRENCIES.filter(c => 
    c.name.toLowerCase().includes(currencySearch.toLowerCase()) ||
    c.code.toLowerCase().includes(currencySearch.toLowerCase())
  );

  const madhhabOptions: Array<{ code: MadhhabCode; label: string; isDefault?: boolean }> = [
    { code: 'MALIKI',  label: 'Maliki', isDefault: true },
    { code: 'HANAFI',  label: 'Hanafi' },
    { code: 'SHAFII',  label: "Shafi'i" },
    { code: 'HANBALI', label: 'Hanbali' },
    { code: 'JAFARI',  label: "Ja'fari" },
  ];

  const activeCurrencyInfo = getCurrencyInfo(currency);
  const activeMadhhabLabel = MadhhabProvider.getDisplayName(madhhab) + (madhhab.toUpperCase() === 'MALIKI' ? ' (Default)' : '');

  const getLanguageLabel = (code: string) => {
    switch (code) {
      case 'ar': return 'العربية';
      case 'ha': return 'Hausa';
      case 'en': 
      default: return 'English';
    }
  };

  const SettingsRow = ({ icon, title, value, onPress, showToggle = false, toggleValue = false, onToggle }: any) => (
    <TouchableOpacity 
      style={styles.settingsRow} 
      onPress={onPress} 
      disabled={showToggle || !onPress}
      activeOpacity={0.7}
    >
      <View style={styles.settingsRowLeft}>
        <View style={styles.settingsIcon}>
          <Ionicons name={icon} size={20} color={colors.textSecondary} />
        </View>
        <Text style={[styles.settingsTitle, { textAlign: isRTL ? 'right' : 'left' }]}>{title}</Text>
      </View>
      <View style={styles.settingsRowRight}>
        {value && <Text style={styles.settingsValue}>{value}</Text>}
        {showToggle ? (
          <Switch 
            value={toggleValue} 
            onValueChange={onToggle}
            trackColor={{ false: colors.border, true: colors.primaryLight }}
            thumbColor={colors.white}
          />
        ) : (
          <Ionicons name={isRTL ? "chevron-back" : "chevron-forward"} size={16} color={colors.textMuted} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeScreen edges={['top', 'left', 'right']}>
      <Header title={t('profileTitle')} showBack={false} />
      
      {/* Success Toast Banner */}
      {toastMessage && (
        <View style={styles.toastBanner}>
          <Ionicons name="checkmark-circle" size={20} color={colors.primaryDark} />
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        <View style={styles.profileCard}>
          <Avatar name={user?.name || 'User'} size={72} style={styles.avatar} />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{user?.name || 'User Name'}</Text>
            <Text style={styles.email}>{user?.email || 'user@example.com'}</Text>
            {user?.isPremium && (
              <Badge label="Premium User ⭐" variant="premium" style={styles.badge} />
            )}
          </View>
          <TouchableOpacity style={styles.editBtn}>
            <Ionicons name="pencil" size={16} color={colors.white} />
          </TouchableOpacity>
        </View>

        {!user?.isPremium && (
          <TouchableOpacity style={styles.premiumBanner}>
            <View style={styles.premiumContent}>
              <View>
                <Text style={styles.premiumTitle}>{t('upgradePremium')}</Text>
                <Text style={styles.premiumSubtitle}>{t('premiumSubtitle')}</Text>
              </View>
              <Ionicons name="star" size={24} color={colors.secondary} />
            </View>
          </TouchableOpacity>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('preferences')}</Text>
          <View style={styles.card}>
            <SettingsRow 
              icon="globe-outline" 
              title={t('language')} 
              value={getLanguageLabel(language)} 
              onPress={() => setLanguageModalVisible(true)} 
            />
            <Divider style={styles.divider} />
            <SettingsRow 
              icon="book-outline" 
              title={t('madhhabPreference')} 
              value={activeMadhhabLabel} 
              onPress={() => setMadhhabModalVisible(true)} 
            />
            <Divider style={styles.divider} />
            <SettingsRow 
              icon="cash-outline" 
              title={t('defaultCurrency')} 
              value={`${activeCurrencyInfo.code} (${activeCurrencyInfo.symbol})`} 
              onPress={() => setCurrencyModalVisible(true)} 
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('appSettings')}</Text>
          <View style={styles.card}>
            <SettingsRow icon="moon-outline" title={t('darkMode')} value="On" onPress={() => {}} />
            <Divider style={styles.divider} />
            <SettingsRow 
              icon="hardware-chip-outline" 
              title={t('haptics')} 
              showToggle 
              toggleValue={hapticsEnabled} 
              onToggle={toggleHaptics} 
            />
            <Divider style={styles.divider} />
            <SettingsRow icon="finger-print-outline" title={t('biometrics')} value="Off" onPress={() => {}} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('supportSection')}</Text>
          <View style={styles.card}>
            <SettingsRow 
              icon="help-circle-outline" 
              title={t('helpSupport')} 
              onPress={() => router.push('/help')} 
            />
            <Divider style={styles.divider} />
            <SettingsRow 
              icon="information-circle-outline" 
              title={t('aboutMizan')} 
              onPress={() => router.push('/help/about')} 
            />
          </View>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={colors.error} />
          <Text style={styles.logoutText}>{t('logout')}</Text>
        </TouchableOpacity>
        
        <Text style={styles.versionText}>Version 1.0.0 (Build 100)</Text>

      </ScrollView>

      {/* ── LANGUAGE SELECTION MODAL ────────────────────────────────────── */}
      <Modal
        visible={languageModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setLanguageModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                  <View>
                    <Text style={styles.modalTitle}>{t('language')}</Text>
                    <Text style={styles.modalSubtitle}>Select your preferred application language</Text>
                  </View>
                  <TouchableOpacity onPress={() => setLanguageModalVisible(false)}>
                    <Ionicons name="close" size={24} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalList}>
                  {languageOptions.map((opt) => {
                    const isSelected = language === opt.code;

                    return (
                      <TouchableOpacity
                        key={opt.code}
                        style={[
                          styles.modalItem,
                          isSelected && styles.modalItemSelected,
                          !opt.supported && styles.modalItemDisabled
                        ]}
                        onPress={() => opt.supported && handleSelectLanguage(opt.code)}
                        disabled={!opt.supported}
                        activeOpacity={0.7}
                      >
                        <View style={styles.modalItemContent}>
                          <View style={styles.modalItemTitleRow}>
                            <Text style={[styles.modalItemTitle, isSelected && styles.modalItemTitleSelected]}>
                              {opt.native} ({opt.label})
                            </Text>
                            {!opt.supported && (
                              <View style={styles.comingSoonBadge}>
                                <Text style={styles.comingSoonBadgeText}>COMING SOON</Text>
                              </View>
                            )}
                          </View>
                        </View>
                        {isSelected && (
                          <View style={styles.checkCircle}>
                            <Ionicons name="checkmark" size={16} color={colors.primaryDark} />
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* ── MADHHAB SELECTION MODAL ────────────────────────────────────── */}
      <Modal
        visible={madhhabModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setMadhhabModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setMadhhabModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                  <View>
                    <Text style={styles.modalTitle}>Madhhab Preference</Text>
                    <Text style={styles.modalSubtitle}>School of Islamic Jurisprudence for Rule Engines</Text>
                  </View>
                  <TouchableOpacity onPress={() => setMadhhabModalVisible(false)}>
                    <Ionicons name="close" size={24} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalList}>
                  {madhhabOptions.map((opt) => {
                    const isSelected = madhhab.toUpperCase() === opt.code;
                    const desc = MadhhabProvider.getDescription(opt.code);

                    return (
                      <TouchableOpacity
                        key={opt.code}
                        style={[styles.modalItem, isSelected && styles.modalItemSelected]}
                        onPress={() => handleSelectMadhhab(opt.code)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.modalItemContent}>
                          <View style={styles.modalItemTitleRow}>
                            <Text style={[styles.modalItemTitle, isSelected && styles.modalItemTitleSelected]}>
                              {opt.label}
                            </Text>
                            {opt.isDefault && (
                              <View style={styles.defaultBadge}>
                                <Text style={styles.defaultBadgeText}>DEFAULT</Text>
                              </View>
                            )}
                          </View>
                          <Text style={styles.modalItemDesc}>{desc}</Text>
                        </View>
                        {isSelected && (
                          <View style={styles.checkCircle}>
                            <Ionicons name="checkmark" size={16} color={colors.primaryDark} />
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* ── CURRENCY SELECTION MODAL ────────────────────────────────────── */}
      <Modal
        visible={currencyModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCurrencyModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setCurrencyModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                  <View>
                    <Text style={styles.modalTitle}>Default Currency</Text>
                    <Text style={styles.modalSubtitle}>Global monetary symbol & formatting preference</Text>
                  </View>
                  <TouchableOpacity onPress={() => setCurrencyModalVisible(false)}>
                    <Ionicons name="close" size={24} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                  <Ionicons name="search" size={18} color={colors.textMuted} style={{ marginRight: 8 }} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search currency code or name..."
                    placeholderTextColor={colors.textMuted}
                    value={currencySearch}
                    onChangeText={setCurrencySearch}
                  />
                  {currencySearch.length > 0 && (
                    <TouchableOpacity onPress={() => setCurrencySearch('')}>
                      <Ionicons name="close-circle" size={18} color={colors.textMuted} />
                    </TouchableOpacity>
                  )}
                </View>

                <FlatList
                  data={filteredCurrencies}
                  keyExtractor={(item) => item.code}
                  style={styles.modalList}
                  renderItem={({ item }) => {
                    const isSelected = currency.toUpperCase() === item.code;

                    return (
                      <TouchableOpacity
                        style={[styles.modalItem, isSelected && styles.modalItemSelected]}
                        onPress={() => handleSelectCurrency(item.code)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.currencyIconBox}>
                          <Text style={styles.currencySymbolText}>{item.symbol}</Text>
                        </View>
                        <View style={{ flex: 1, marginLeft: 12 }}>
                          <Text style={[styles.modalItemTitle, isSelected && styles.modalItemTitleSelected]}>
                            {item.code} — {item.name}
                          </Text>
                        </View>
                        {isSelected && (
                          <View style={styles.checkCircle}>
                            <Ionicons name="checkmark" size={16} color={colors.primaryDark} />
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  toastBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    gap: 10,
    elevation: 5,
  },
  toastText: {
    fontFamily: typography.bodySemiBold,
    fontSize: 14,
    color: colors.primaryDark,
    flex: 1,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
    position: 'relative',
  },
  avatar: {
    marginRight: spacing.md,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontFamily: typography.headingMedium,
    fontSize: 20,
    color: colors.white,
    marginBottom: 4,
  },
  email: {
    fontFamily: typography.body,
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  badge: {
    marginTop: 4,
  },
  editBtn: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
  },
  premiumBanner: {
    backgroundColor: 'rgba(201, 168, 76, 0.1)',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.secondary,
    marginBottom: spacing.xl,
  },
  premiumContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  premiumTitle: {
    fontFamily: typography.bodySemiBold,
    fontSize: 16,
    color: colors.secondaryLight,
    marginBottom: 4,
  },
  premiumSubtitle: {
    fontFamily: typography.body,
    fontSize: 12,
    color: colors.secondary,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontFamily: typography.bodySemiBold,
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  settingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
  },
  settingsRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  settingsTitle: {
    fontFamily: typography.body,
    fontSize: 16,
    color: colors.white,
  },
  settingsRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsValue: {
    fontFamily: typography.body,
    fontSize: 14,
    color: colors.secondary,
    marginRight: spacing.xs,
    fontWeight: '600',
  },
  divider: {
    marginVertical: 0,
    marginHorizontal: spacing.md,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(229, 62, 62, 0.1)',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(229, 62, 62, 0.3)',
    marginBottom: spacing.lg,
  },
  logoutText: {
    fontFamily: typography.bodySemiBold,
    fontSize: 16,
    color: colors.error,
    marginLeft: spacing.sm,
  },
  versionText: {
    fontFamily: typography.body,
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
  },

  /* ── Modal Styles ────────────────────────────────────────── */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  modalTitle: {
    fontFamily: typography.headingMedium,
    fontSize: 20,
    color: colors.white,
  },
  modalSubtitle: {
    fontFamily: typography.body,
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  modalList: {
    marginTop: 8,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.surfaceElevated,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalItemSelected: {
    borderColor: colors.secondary,
    backgroundColor: 'rgba(201, 168, 76, 0.12)',
  },
  modalItemDisabled: {
    opacity: 0.5,
  },
  modalItemContent: {
    flex: 1,
    marginRight: 12,
  },
  modalItemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalItemTitle: {
    fontFamily: typography.bodyBold,
    fontSize: 16,
    color: colors.white,
  },
  modalItemTitleSelected: {
    color: colors.secondary,
  },
  modalItemDesc: {
    fontFamily: typography.body,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
    lineHeight: 17,
  },
  defaultBadge: {
    backgroundColor: colors.secondary + '22',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  defaultBadgeText: {
    color: colors.secondary,
    fontSize: 10,
    fontWeight: '800',
  },
  comingSoonBadge: {
    backgroundColor: colors.surface,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  comingSoonBadgeText: {
    color: colors.textMuted,
    fontSize: 9,
    fontWeight: '700',
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    color: colors.white,
    fontFamily: typography.body,
    fontSize: 14,
  },
  currencyIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.secondary + '22',
    alignItems: 'center',
    justifyContent: 'center',
  },
  currencySymbolText: {
    color: colors.secondary,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
