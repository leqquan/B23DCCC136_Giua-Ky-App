// QuantityControl - Nút tăng/giảm số lượng
import React from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import {Colors, Typography, Spacing} from '../theme';

const QuantityControl = ({quantity, onIncrease, onDecrease, disabled = false}) => {
  return (
    <View style={styles.container}>
      <Pressable
        onPress={onDecrease}
        disabled={disabled}
        style={({pressed}) => [
          styles.button,
          styles.decreaseButton,
          pressed && styles.buttonPressed,
          disabled && styles.buttonDisabled,
        ]}>
        <Text
          style={[
            styles.buttonText,
            styles.decreaseText,
            disabled && styles.buttonTextDisabled,
          ]}>
          −
        </Text>
      </Pressable>

      <View style={styles.quantityContainer}>
        <Text style={[styles.quantity, disabled && styles.quantityDisabled]}>
          {quantity}
        </Text>
      </View>

      <Pressable
        onPress={onIncrease}
        disabled={disabled}
        style={({pressed}) => [
          styles.button,
          styles.increaseButton,
          pressed && styles.buttonPressed,
          disabled && styles.buttonDisabled,
        ]}>
        <Text
          style={[
            styles.buttonText,
            styles.increaseText,
            disabled && styles.buttonTextDisabled,
          ]}>
          +
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  button: {
    width: 34,
    height: 34,
    borderRadius: Spacing.radiusSm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  decreaseButton: {
    backgroundColor: Colors.errorLight,
  },
  increaseButton: {
    backgroundColor: Colors.successLight,
  },
  buttonPressed: {
    opacity: 0.7,
    transform: [{scale: 0.93}],
  },
  buttonDisabled: {
    backgroundColor: Colors.surfaceVariant,
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 22,
  },
  decreaseText: {
    color: Colors.error,
  },
  increaseText: {
    color: Colors.success,
  },
  buttonTextDisabled: {
    color: Colors.textDisabled,
  },
  quantityContainer: {
    minWidth: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantity: {
    ...Typography.labelLarge,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  quantityDisabled: {
    color: Colors.textDisabled,
  },
});

export default QuantityControl;
