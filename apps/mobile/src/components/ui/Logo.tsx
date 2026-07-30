import React from 'react';
import { View, Image, Text, StyleSheet, ImageStyle, ViewStyle, TextStyle } from 'react-native';

export interface LogoProps {
  size?: 'small' | 'medium' | 'large' | number;
  showText?: boolean;
  textColor?: string;
  subtextColor?: string;
  style?: ViewStyle;
  imageStyle?: ImageStyle;
  textStyle?: TextStyle;
  layout?: 'horizontal' | 'vertical';
}

export const Logo: React.FC<LogoProps> = ({
  size = 'medium',
  showText = false,
  textColor = '#D4AF37', // MIZAN Gold
  subtextColor = '#94A3B8',
  style,
  imageStyle,
  textStyle,
  layout = 'horizontal',
}) => {
  let dimension = 44;
  if (typeof size === 'number') {
    dimension = size;
  } else if (size === 'small') {
    dimension = 28;
  } else if (size === 'medium') {
    dimension = 44;
  } else if (size === 'large') {
    dimension = 84;
  }

  const logoSource = require('../../../assets/logo.png');

  return (
    <View style={[styles.container, layout === 'vertical' ? styles.vertical : styles.horizontal, style]}>
      <Image
        source={logoSource}
        style={[{ width: dimension, height: dimension, resizeMode: 'contain' }, imageStyle]}
      />
      {showText && (
        <View style={layout === 'vertical' ? styles.textContainerVertical : styles.textContainerHorizontal}>
          <Text style={[styles.title, { color: textColor, fontSize: dimension * 0.38 }, textStyle]}>
            MIZAN
          </Text>
          <Text style={[styles.subtitle, { color: subtextColor, fontSize: Math.max(8, dimension * 0.16) }]}>
            ISLAMIC FINANCE
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  vertical: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  textContainerHorizontal: {
    justifyContent: 'center',
  },
  textContainerVertical: {
    alignItems: 'center',
  },
  title: {
    fontWeight: '800',
    letterSpacing: 2.5,
  },
  subtitle: {
    fontWeight: '600',
    letterSpacing: 1.5,
    marginTop: -1,
  },
});
