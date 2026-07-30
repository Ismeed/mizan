import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';

interface DividerProps {
  style?: ViewStyle;
  vertical?: boolean;
}

export const Divider: React.FC<DividerProps> = ({ style, vertical = false }) => {
  return (
    <View
      style={[
        styles.divider,
        vertical ? styles.vertical : styles.horizontal,
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  divider: {
    backgroundColor: colors.border,
  },
  horizontal: {
    height: 1,
    width: '100%',
    marginVertical: spacing.md,
  },
  vertical: {
    width: 1,
    height: '100%',
    marginHorizontal: spacing.md,
  },
});
