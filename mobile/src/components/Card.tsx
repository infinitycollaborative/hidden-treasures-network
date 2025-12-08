import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, BorderRadius, Spacing, Shadows } from '../constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outlined';
}

export function Card({ children, style, variant = 'elevated' }: CardProps) {
  const cardStyles = [
    styles.card,
    variant === 'elevated' && styles.card_elevated,
    variant === 'outlined' && styles.card_outlined,
    style,
  ];

  return <View style={cardStyles}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  card_elevated: {
    ...Shadows.md,
  },
  card_outlined: {
    borderWidth: 1,
    borderColor: Colors.gray[200],
  },
});
