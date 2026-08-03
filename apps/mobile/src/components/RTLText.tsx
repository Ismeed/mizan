import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useTranslation } from '../i18n/useTranslation';

export interface RTLTextProps extends TextProps {
  children: React.ReactNode;
}

export const RTLText: React.FC<RTLTextProps> = ({ children, style, ...props }) => {
  const { isRTL, textAlign } = useTranslation();

  return (
    <Text
      {...props}
      style={[
        style,
        {
          textAlign,
          writingDirection: isRTL ? 'rtl' : 'ltr',
        },
      ]}
    >
      {children}
    </Text>
  );
};
