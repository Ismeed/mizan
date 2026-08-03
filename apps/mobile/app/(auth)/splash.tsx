import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Image,
  StatusBar,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Golden particle positions — fixed, subtle, scattered
const PARTICLES = [
  { top: '15%', left: '8%',  size: 3,  opacity: 0.35 },
  { top: '22%', left: '88%', size: 2,  opacity: 0.28 },
  { top: '30%', left: '15%', size: 1.5,opacity: 0.20 },
  { top: '42%', left: '92%', size: 2.5,opacity: 0.30 },
  { top: '55%', left: '5%',  size: 2,  opacity: 0.22 },
  { top: '62%', left: '78%', size: 3,  opacity: 0.18 },
  { top: '70%', left: '20%', size: 1.5,opacity: 0.20 },
  { top: '78%', left: '85%', size: 2,  opacity: 0.15 },
  { top: '18%', left: '50%', size: 1.5,opacity: 0.18 },
  { top: '48%', left: '45%', size: 1,  opacity: 0.12 },
];

export default function SplashScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Animation values
  const logoOpacity  = useRef(new Animated.Value(0)).current;
  const logoScale    = useRef(new Animated.Value(0.92)).current;
  const textOpacity  = useRef(new Animated.Value(0)).current;
  const glowOpacity  = useRef(new Animated.Value(0)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    StatusBar.setHidden(true);

    // 1) Logo fade + scale (0 → 1, 0.92 → 1.0) over 600ms
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(glowOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // 2) Text fades in 300ms after logo starts
    Animated.timing(textOpacity, {
      toValue: 1,
      duration: 500,
      delay: 300,
      useNativeDriver: true,
    }).start();

    // 3) After 2.5 seconds, fade entire screen out before navigating
    const timer = setTimeout(() => {
      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        StatusBar.setHidden(false);
        // Transition to Dashboard — AuthGuard ensures only authenticated
        // users with completed onboarding reach /(tabs)
        router.replace('/(tabs)');
      });
    }, 2500);

    return () => {
      clearTimeout(timer);
      StatusBar.setHidden(false);
    };
  }, []);

  const logoSize = Math.min(SCREEN_WIDTH * 0.62, 260);

  return (
    <Animated.View style={[styles.root, { opacity: screenOpacity }]}>
      {/* ── Background gradient (very dark emerald → rich green → darker) ── */}
      <LinearGradient
        colors={['#071A10', '#0D2B1E', '#122A1C', '#0A2015']}
        locations={[0, 0.35, 0.70, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* ── Subtle vignette overlay ── */}
      <LinearGradient
        colors={['rgba(0,0,0,0.55)', 'transparent', 'transparent', 'rgba(0,0,0,0.45)']}
        locations={[0, 0.25, 0.75, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      {/* ── Radial glow behind logo (centered, slightly above middle) ── */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.radialGlow,
          {
            opacity: Animated.multiply(glowOpacity, 0.28),
            width: SCREEN_WIDTH * 1.1,
            height: SCREEN_WIDTH * 1.1,
            borderRadius: SCREEN_WIDTH * 0.55,
            top: SCREEN_HEIGHT * 0.12,
            left: -(SCREEN_WIDTH * 0.05),
          },
        ]}
      />

      {/* ── Golden particles ── */}
      {PARTICLES.map((p, i) => (
        <View
          key={i}
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: p.top as any,
            left: p.left as any,
            width: p.size,
            height: p.size,
            borderRadius: p.size / 2,
            backgroundColor: '#D4AF37',
            opacity: p.opacity,
          }}
        />
      ))}

      {/* ── Main content ── */}
      <View style={styles.content}>

        {/* ── Logo container ── */}
        <Animated.View
          style={[
            styles.logoWrapper,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
              width: logoSize,
              height: logoSize,
            },
          ]}
        >
          {/* Soft glow halo behind logo */}
          <View style={[styles.logoGlow, { width: logoSize * 1.3, height: logoSize * 1.3, borderRadius: logoSize * 0.65, top: -(logoSize * 0.15), left: -(logoSize * 0.15) }]} />

          <Image
            source={require('../../assets/logo.png')}
            style={{ width: logoSize, height: logoSize }}
            resizeMode="contain"
          />
        </Animated.View>

        {/* ── Text block (MIZAN + tagline) ── */}
        <Animated.View style={[styles.textBlock, { opacity: textOpacity }]}>
          <Text style={styles.appName}>MIZAN</Text>
          <Text style={styles.tagline}>JUSTICE IN EVERY CALCULATION</Text>
        </Animated.View>

      </View>

      {/* ── Mosque skyline at bottom ── */}
      <View style={styles.mosqueContainer} pointerEvents="none">
        {/* Gradient mask: mosque fades upward into background */}
        <LinearGradient
          colors={['#0A2015', 'transparent']}
          locations={[0, 0.45]}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
        <Image
          source={require('../../assets/mosque.png')}
          style={styles.mosqueImage}
          resizeMode="cover"
        />
        {/* Extra upward fade over mosque */}
        <LinearGradient
          colors={['#071A10', 'transparent']}
          locations={[0, 0.5]}
          style={[StyleSheet.absoluteFill, { zIndex: 2 }]}
          pointerEvents="none"
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#071A10',
  },

  // ── Radial glow ──────────────────────────────────────────────────────────────
  radialGlow: {
    position: 'absolute',
    backgroundColor: '#1A5C38',
  },

  // ── Main content layout ────────────────────────────────────────────────────
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // Push content slightly above true center (logo above center like reference)
    paddingBottom: SCREEN_HEIGHT * 0.20,
    paddingHorizontal: 24,
  },

  // ── Logo ──────────────────────────────────────────────────────────────────
  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    // Shadow (iOS)
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 30,
    // Elevation (Android)
    elevation: 12,
  },
  logoGlow: {
    position: 'absolute',
    backgroundColor: '#1A5C38',
    opacity: 0.22,
  },

  // ── Text ──────────────────────────────────────────────────────────────────
  textBlock: {
    alignItems: 'center',
    marginTop: 20,
  },
  appName: {
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }),
    fontSize: 42,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 10,
    textAlign: 'center',
    // Very subtle text shadow to add depth
    textShadowColor: 'rgba(212,175,55,0.25)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  tagline: {
    fontFamily: Platform.select({ ios: 'System', android: 'sans-serif', default: 'sans-serif' }),
    fontSize: 11,
    fontWeight: '500',
    color: '#D4AF37',
    letterSpacing: 3.5,
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.92,
  },

  // ── Mosque ────────────────────────────────────────────────────────────────
  mosqueContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 0.30,
    overflow: 'hidden',
  },
  mosqueImage: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: '100%',
    opacity: 0.15,
    tintColor: '#1A5C38',
  },
});
