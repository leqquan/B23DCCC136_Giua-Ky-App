// TableMapScreen - Màn hình Sơ đồ bàn (Câu 4)
// Hiển thị 10 bàn dạng lưới, bàn có khách tô màu khác

import React, {useState, useCallback} from 'react';
import {View, Text, FlatList, Pressable, StyleSheet, StatusBar} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {Colors, Typography, Spacing} from '../theme';
import {getInvoices} from '../storage/asyncStorage';
import {TABLE_COUNT} from '../data/initialData';

const TableMapScreen = ({navigation}) => {
  const [invoices, setInvoices] = useState([]);

  useFocusEffect(
    useCallback(() => {
      loadInvoices();
    }, []),
  );

  const loadInvoices = async () => {
    const data = await getInvoices();
    setInvoices(data);
  };

  // Lấy danh sách bàn đang có khách
  const getOccupiedTables = () => {
    return invoices
      .filter(inv => inv.status === 'Đang phục vụ')
      .map(inv => inv.tableNumber);
  };

  const occupiedTables = getOccupiedTables();
  const occupiedCount = occupiedTables.length;

  // Tạo mảng 10 bàn
  const tables = Array.from({length: TABLE_COUNT}, (_, i) => ({
    id: i + 1,
    number: i + 1,
    isOccupied: occupiedTables.includes(i + 1),
  }));

  const renderTable = ({item}) => {
    const isOccupied = item.isOccupied;
    const activeInvoice = invoices.find(
      inv => inv.tableNumber === item.number && inv.status === 'Đang phục vụ',
    );
    const totalDishes = activeInvoice
      ? activeInvoice.items.reduce((sum, i) => sum + i.quantity, 0)
      : 0;

    return (
      <Pressable
        onPress={() =>
          navigation.navigate('Order', {tableNumber: item.number})
        }
        style={({pressed}) => [
          styles.tableCard,
          isOccupied ? styles.tableOccupied : styles.tableEmpty,
          pressed && styles.tablePressed,
        ]}>
        <View style={styles.tableInner}>
          {/* Icon bàn */}
          <Text style={styles.tableIcon}>{isOccupied ? '🍽️' : '🪑'}</Text>

          {/* Số bàn */}
          <Text
            style={[
              styles.tableNumber,
              isOccupied ? styles.tableNumberOccupied : styles.tableNumberEmpty,
            ]}>
            Bàn {item.number}
          </Text>

          {/* Trạng thái */}
          <View
            style={[
              styles.statusBadge,
              isOccupied ? styles.statusOccupied : styles.statusEmpty,
            ]}>
            <View
              style={[
                styles.statusDot,
                isOccupied ? styles.dotOccupied : styles.dotEmpty,
              ]}
            />
            <Text
              style={[
                styles.statusText,
                isOccupied ? styles.statusTextOccupied : styles.statusTextEmpty,
              ]}>
              {isOccupied ? 'Có khách' : 'Trống'}
            </Text>
          </View>

          {isOccupied && totalDishes > 0 && (
            <Text style={styles.tableItemsText}>{totalDishes} món đang gọi</Text>
          )}
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />

      {/* Header thống kê */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sơ đồ bàn</Text>
        <View style={styles.statsRow}>
          <View style={styles.statChip}>
            <View style={[styles.statusDot, styles.dotOccupied]} />
            <Text style={styles.statChipText}>
              {occupiedCount} có khách
            </Text>
          </View>
          <View style={styles.statChip}>
            <View style={[styles.statusDot, styles.dotEmpty]} />
            <Text style={styles.statChipText}>
              {TABLE_COUNT - occupiedCount} trống
            </Text>
          </View>
        </View>
      </View>

      {/* Lưới bàn */}
      <FlatList
        data={tables}
        renderItem={renderTable}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.gridContent}
        columnWrapperStyle={styles.gridRow}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
    borderBottomLeftRadius: Spacing.radiusXl,
    borderBottomRightRadius: Spacing.radiusXl,
    ...Spacing.shadowMd,
  },
  headerTitle: {
    ...Typography.h2,
    color: Colors.textOnPrimary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.lg,
  },
  statChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Spacing.radiusFull,
    gap: Spacing.sm,
  },
  statChipText: {
    ...Typography.labelSmall,
    color: Colors.textOnPrimary,
  },
  gridContent: {
    padding: Spacing.screenPadding,
    paddingTop: Spacing.xl,
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  tableCard: {
    width: '48%',
    borderRadius: Spacing.radiusLg,
    borderWidth: 2,
    overflow: 'hidden',
    ...Spacing.shadowMd,
  },
  tableEmpty: {
    backgroundColor: Colors.tableEmpty,
    borderColor: Colors.tableEmptyBorder,
  },
  tableOccupied: {
    backgroundColor: Colors.tableOccupied,
    borderColor: Colors.tableOccupiedBorder,
  },
  tablePressed: {
    opacity: 0.8,
    transform: [{scale: 0.96}],
  },
  tableInner: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },
  tableIcon: {
    fontSize: 36,
    marginBottom: Spacing.sm,
  },
  tableNumber: {
    ...Typography.h3,
    marginBottom: Spacing.sm,
  },
  tableNumberOccupied: {
    color: Colors.error,
  },
  tableNumberEmpty: {
    color: Colors.success,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Spacing.radiusFull,
    gap: Spacing.xs,
  },
  statusOccupied: {
    backgroundColor: 'rgba(211, 47, 47, 0.15)',
  },
  statusEmpty: {
    backgroundColor: 'rgba(46, 125, 50, 0.15)',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotOccupied: {
    backgroundColor: Colors.error,
  },
  dotEmpty: {
    backgroundColor: Colors.success,
  },
  statusText: {
    ...Typography.labelSmall,
  },
  statusTextOccupied: {
    color: Colors.error,
  },
  statusTextEmpty: {
    color: Colors.success,
  },
  tableItemsText: {
    ...Typography.caption,
    color: Colors.error,
    fontWeight: '600',
    marginTop: Spacing.xs,
  },
});

export default TableMapScreen;
