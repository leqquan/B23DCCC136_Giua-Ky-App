// App.tsx - Entry point chính của ứng dụng Quản Lý Nhà Hàng
// Khởi tạo dữ liệu ban đầu, custom bottom tab, và Navigation

import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  Pressable,
  Platform,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider, useSafeAreaInsets} from 'react-native-safe-area-context';
import {MenuStack, TableStack} from './src/navigation/AppNavigator';
import {initializeData} from './src/storage/asyncStorage';
import {Colors, Spacing} from './src/theme';

const MainContent = () => {
  const [activeTab, setActiveTab] = useState<'menu' | 'table'>('menu');
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.appContainer}>
      {/* Hiển thị Stack tương ứng với tab active */}
      <View style={styles.navigatorContainer}>
        <NavigationContainer key={activeTab}>
          {activeTab === 'menu' ? <MenuStack /> : <TableStack />}
        </NavigationContainer>
      </View>

      {/* Bottom Tab Bar custom */}
      <View
        style={[
          styles.bottomTab,
          {paddingBottom: Math.max(insets.bottom, 6)},
        ]}>
        <Pressable
          onPress={() => setActiveTab('menu')}
          style={({pressed}) => [
            styles.tabItem,
            pressed && styles.tabPressed,
          ]}>
          <Text
            style={[
              styles.tabIcon,
              activeTab === 'menu' && styles.tabIconActive,
            ]}>
            🍽️
          </Text>
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'menu' && styles.tabLabelActive,
            ]}>
            Thực đơn
          </Text>
          {activeTab === 'menu' && <View style={styles.tabIndicator} />}
        </Pressable>

        <Pressable
          onPress={() => setActiveTab('table')}
          style={({pressed}) => [
            styles.tabItem,
            pressed && styles.tabPressed,
          ]}>
          <Text
            style={[
              styles.tabIcon,
              activeTab === 'table' && styles.tabIconActive,
            ]}>
            🪑
          </Text>
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'table' && styles.tabLabelActive,
            ]}>
            Sơ đồ bàn
          </Text>
          {activeTab === 'table' && <View style={styles.tabIndicator} />}
        </Pressable>
      </View>
    </View>
  );
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (Platform.OS === 'android') {
      (StatusBar as any).setBackgroundColor?.(Colors.primary, true);
    }
    const init = async () => {
      await initializeData();
      setTimeout(() => setIsLoading(false), 500);
    };
    init();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.loadingIcon}>🍽️</Text>
        <Text style={styles.loadingTitle}>Nhà Hàng</Text>
        <ActivityIndicator
          size="large"
          color={Colors.primary}
          style={styles.loadingSpinner}
        />
        <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <MainContent />
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  navigatorContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingIcon: {
    fontSize: 64,
    marginBottom: Spacing.lg,
  },
  loadingTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: Spacing.xxl,
  },
  loadingSpinner: {
    marginBottom: Spacing.lg,
  },
  loadingText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  bottomTab: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    paddingBottom: 6,
    ...Spacing.shadowLg,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm + 2,
    position: 'relative',
  },
  tabPressed: {
    opacity: 0.65,
    backgroundColor: Colors.surfaceVariant,
  },
  tabIcon: {
    fontSize: 22,
    marginBottom: 2,
    opacity: 0.45,
  },
  tabIconActive: {
    opacity: 1,
  },
  tabLabel: {
    fontSize: 11,
    color: Colors.textDisabled,
  },
  tabLabelActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  tabIndicator: {
    position: 'absolute',
    top: 0,
    left: '25%',
    right: '25%',
    height: 3,
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },
});

export default App;
