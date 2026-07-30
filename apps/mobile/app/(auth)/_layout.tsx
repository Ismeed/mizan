import { Stack } from 'expo-router';
import { Platform } from 'react-native';
import { colors } from '../../src/constants/colors';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown:   false,
        contentStyle:  { backgroundColor: colors.background },
        animation:     Platform.OS === 'android' ? 'fade' : 'slide_from_right',
        animationDuration: 220,
      }}
    >
      <Stack.Screen name="index"        />
      <Stack.Screen name="email-auth"   />
      <Stack.Screen name="otp"          />
      <Stack.Screen name="confirm-name" />
      <Stack.Screen name="onboarding"   options={{ animation: 'fade' }} />
      <Stack.Screen name="splash"       options={{ animation: 'none' }} />
      {/* Legacy screens kept for backward compat */}
      <Stack.Screen name="login"         />
      <Stack.Screen name="register"      />
      <Stack.Screen name="forgot-password" />
    </Stack>
  );
}
