import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors } from '../../constants/colors';
import { spacing, borderRadius } from '../../constants/spacing';

export const TypingIndicator: React.FC = () => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateDot = (dot: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 400, useNativeDriver: true }),
        ])
      ).start();
    };

    animateDot(dot1, 0);
    animateDot(dot2, 200);
    animateDot(dot3, 400);
  }, []);

  const getDotStyle = (dot: Animated.Value) => ({
    transform: [{ translateY: dot.interpolate({ inputRange: [0, 1], outputRange: [0, -5] }) }],
    opacity: dot.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] }),
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.dot, getDotStyle(dot1)]} />
      <Animated.View style={[styles.dot, getDotStyle(dot2)]} />
      <Animated.View style={[styles.dot, getDotStyle(dot3)]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    borderBottomLeftRadius: 4,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.border,
    height: 40,
    marginLeft: 40,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.textSecondary,
    marginHorizontal: 2,
  },
});
