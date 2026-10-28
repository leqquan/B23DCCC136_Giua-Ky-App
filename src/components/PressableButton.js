// PressableButton - Nút bấm có hiệu ứng khi nhấn
import React from 'react';
import {Pressable, Text, StyleSheet, ActivityIndicator} from 'react-native';
import {Colors, Typography, Spacing} from '../theme';

const PressableButton = ({
  title,
  onPress,
  variant = 'primary', // primary, secondary, outline, danger, success
  size = 'medium', // small, medium, large
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
}) => {
  const getButtonStyle = () => {
    const base = [styles.base, styles[size]];

    switch (variant) {
      case 'secondary':
        base.push(styles.secondary);
        break;
      case 'outline':
        base.push(styles.outline);
        break;
      case 'danger':
        base.push(styles.danger);
        break;
      case 'success':
        base.push(styles.success);
        break;
      default:
        base.push(styles.primary);
    }

    if (disabled) {
      base.push(styles.disabled);
    }

    return base;
  };

  const getTextStyle = () => {
    const base = [styles.text, styles[`${size}Text`]];

    switch (variant) {
      case 'outline':
        base.push(styles.outlineText);
        break;
      case 'secondary':
        base.push(styles.secondaryText);
        break;
      default:
        base.push(styles.primaryText);
    }

    if (disabled) {
      base.push(styles.disabledText);
    }

    return base;
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({pressed}) => [
        ...getButtonStyle(),
        pressed && !disabled && styles.pressed,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' ? Colors.primary : Colors.textOnPrimary}
          size="small"
        />
      ) : (
        <>
          {icon}
          <Text style={[...getTextStyle(), textStyle]}>{title}</Text>
        </>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Spacing.radiusMd,
    gap: Spacing.sm,
  },

  // Sizes
  small: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Spacing.radiusSm,
  },
  medium: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  large: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderRadius: Spacing.radiusLg,
  },

  // Variants
  primary: {
    backgroundColor: Colors.primary,
    ...Spacing.shadowSm,
  },
  secondary: {
    backgroundColor: Colors.surfaceVariant,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  danger: {
    backgroundColor: Colors.error,
    ...Spacing.shadowSm,
  },
  success: {
    backgroundColor: Colors.success,
    ...Spacing.shadowSm,
  },

  // States
  pressed: {
    opacity: 0.75,
    transform: [{scale: 0.97}],
  },
  disabled: {
    backgroundColor: Colors.surfaceVariant,
    opacity: 0.6,
    elevation: 0,
    shadowOpacity: 0,
  },

  // Text
  text: {
    ...Typography.button,
    textAlign: 'center',
  },
  smallText: {
    ...Typography.buttonSmall,
  },
  mediumText: {
    ...Typography.button,
  },
  largeText: {
    ...Typography.button,
    fontSize: 17,
  },
  primaryText: {
    color: Colors.textOnPrimary,
  },
  secondaryText: {
    color: Colors.textPrimary,
  },
  outlineText: {
    color: Colors.primary,
  },
  disabledText: {
    color: Colors.textDisabled,
  },
});

export default PressableButton;
