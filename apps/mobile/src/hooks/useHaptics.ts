import * as Haptics from 'expo-haptics';
import { useSettingsStore } from '../stores/settings.store';

export const useHaptics = () => {
  const { hapticsEnabled } = useSettingsStore();

  const triggerLight = () => {
    if (hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const triggerMedium = () => {
    if (hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const triggerSuccess = () => {
    if (hapticsEnabled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const triggerError = () => {
    if (hapticsEnabled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  return {
    triggerLight,
    triggerMedium,
    triggerSuccess,
    triggerError,
  };
};
