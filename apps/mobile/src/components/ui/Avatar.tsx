import React from 'react';
import { View, Text, StyleSheet, Image, ViewStyle } from 'react-native';
import { colors } from '../../constants/colors';
import { typography } from '../../constants/typography';

interface AvatarProps {
  name: string;
  imageUrl?: string;
  size?: number;
  style?: ViewStyle;
}

export const Avatar: React.FC<AvatarProps> = ({ name, imageUrl, size = 40, style }) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const containerStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  return (
    <View style={[styles.container, containerStyle, style]}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={[styles.image, containerStyle]} />
      ) : (
        <Text style={[styles.initials, { fontSize: size * 0.4 }]}>
          {getInitials(name)}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  initials: {
    fontFamily: typography.bodySemiBold,
    color: colors.white,
  },
});
