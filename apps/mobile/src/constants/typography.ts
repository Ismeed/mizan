import { Platform } from 'react-native';

export const typography = {
  heading: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
  headingMedium: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
  body: Platform.select({ ios: 'System', android: 'sans-serif', default: 'sans-serif' }),
  bodySemiBold: Platform.select({ ios: 'System', android: 'sans-serif-medium', default: 'sans-serif-medium' }),
  bodyBold: Platform.select({ ios: 'System', android: 'sans-serif-bold', default: 'sans-serif-bold' }),
  mono: Platform.select({ ios: 'Courier', android: 'monospace', default: 'monospace' }),
};
