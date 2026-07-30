import React, { useEffect, useState } from 'react';
import { ViewStyle, StyleSheet, View, Platform, useWindowDimensions, Keyboard } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../constants/colors';

interface SafeScreenProps {
  children: React.ReactNode;
  style?: ViewStyle;
  edges?: readonly ('top' | 'right' | 'bottom' | 'left')[];
  withBottomTabBar?: boolean;
}

export const SafeScreen: React.FC<SafeScreenProps> = ({
  children,
  style,
  edges = ['top', 'bottom', 'left', 'right'],
  withBottomTabBar = false,
}) => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setIsKeyboardVisible(true)
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setIsKeyboardVisible(false)
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // Guarantee comfortable bottom padding above native navigation bars / gesture indicators
  const minBottomPadding = Platform.OS === 'android' ? Math.max(insets.bottom, 16) : Math.max(insets.bottom, 12);

  const effectiveBottomPadding = isKeyboardVisible
    ? 0
    : withBottomTabBar
    ? (Platform.OS === 'ios' ? 88 : 72)
    : edges.includes('bottom')
    ? minBottomPadding
    : 0;

  const paddingStyle: ViewStyle = {
    paddingTop: edges.includes('top') ? insets.top : 0,
    paddingBottom: effectiveBottomPadding,
    paddingLeft: edges.includes('left') ? (isTablet ? Math.max(insets.left, 32) : insets.left) : 0,
    paddingRight: edges.includes('right') ? (isTablet ? Math.max(insets.right, 32) : insets.right) : 0,
  };

  return (
    <View style={[styles.container, paddingStyle, style]}>
      <View style={[styles.innerContainer, isTablet && styles.tabletMaxWidth]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  innerContainer: {
    flex: 1,
    width: '100%',
  },
  tabletMaxWidth: {
    maxWidth: 720,
    alignSelf: 'center',
  },
});
