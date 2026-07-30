import { Stack } from 'expo-router';
import { Platform } from 'react-native';
import { colors } from '../../src/constants/colors';

export default function HelpLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: Platform.OS === 'android' ? 'fade' : 'slide_from_right',
        animationDuration: 220,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="report" />
      <Stack.Screen name="about" />
      <Stack.Screen name="resources" />
    </Stack>
  );
}
