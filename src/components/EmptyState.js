// EmptyState - Hiển thị khi danh sách rỗng
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Colors, Typography, Spacing} from '../theme';

const EmptyState = ({icon = '📋', title, message}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxxl * 2,
    paddingHorizontal: Spacing.xxl,
  },
  icon: {
    fontSize: 56,
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.h3,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  message: {
    ...Typography.body,
    color: Colors.textDisabled,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default EmptyState;
