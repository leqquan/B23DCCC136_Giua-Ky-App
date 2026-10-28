// MenuScreen - Màn hình Thực đơn (Câu 1 + Câu 3)
// Hiển thị danh sách món ăn theo SectionList, nhóm theo loại
// Hỗ trợ bật/tắt trạng thái, xoá bằng onLongPress

import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  SectionList,
  Switch,
  Pressable,
  Alert,
  StyleSheet,
  StatusBar,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {Colors, Typography, Spacing} from '../theme';
import {formatPrice} from '../utils/formatters';
import {getDishes, saveDishes, getInvoices} from '../storage/asyncStorage';
import {CATEGORIES, CATEGORY_ICONS} from '../data/initialData';
import PressableButton from '../components/PressableButton';
import EmptyState from '../components/EmptyState';

const ItemSeparator = () => <View style={styles.separator} />;
const SectionSeparator = () => <View style={styles.sectionSeparator} />;

const MenuScreen = ({navigation}) => {
  const [dishes, setDishes] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    const dishData = await getDishes();
    const invoiceData = await getInvoices();
    setDishes(dishData);
    setInvoices(invoiceData);
    setLoading(false);
  }, []);

  // Load dữ liệu khi màn hình được focus
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  // Đếm số bàn đang có khách
  const occupiedTables = invoices.filter(
    inv => inv.status === 'Đang phục vụ',
  ).length;

  // Tạo dữ liệu cho SectionList - nhóm theo loại món
  const sections = CATEGORIES.map(category => ({
    title: category,
    icon: CATEGORY_ICONS[category],
    data: dishes.filter(dish => dish.category === category),
  })).filter(section => section.data.length > 0);

  // Bật/tắt trạng thái món
  const toggleAvailability = async (dishId) => {
    const updatedDishes = dishes.map(dish =>
      dish.id === dishId ? {...dish, available: !dish.available} : dish,
    );
    setDishes(updatedDishes);
    await saveDishes(updatedDishes);
  };

  // Xoá món (Câu 3)
  const handleDeleteDish = (dish) => {
    // Kiểm tra món có trong hoá đơn đang phục vụ không
    const activeInvoices = invoices.filter(
      inv => inv.status === 'Đang phục vụ',
    );
    const isInActiveInvoice = activeInvoices.some(inv =>
      inv.items.some(item => item.dishId === dish.id),
    );

    if (isInActiveInvoice) {
      Alert.alert(
        'Không thể xoá',
        `Món "${dish.name}" đang có trong hoá đơn đang phục vụ. Vui lòng thanh toán trước khi xoá.`,
        [{text: 'Đã hiểu', style: 'default'}],
      );
      return;
    }

    Alert.alert(
      'Xác nhận xoá',
      `Bạn có chắc chắn muốn xoá món "${dish.name}" không?`,
      [
        {text: 'Huỷ', style: 'cancel'},
        {
          text: 'Xoá',
          style: 'destructive',
          onPress: async () => {
            const updatedDishes = dishes.filter(d => d.id !== dish.id);
            setDishes(updatedDishes);
            await saveDishes(updatedDishes);
          },
        },
      ],
    );
  };

  // Render từng món ăn
  const renderDishItem = ({item}) => {
    const isUnavailable = !item.available;

    return (
      <Pressable
        onPress={() => navigation.navigate('DishForm', {dish: item})}
        onLongPress={() => handleDeleteDish(item)}
        delayLongPress={500}
        style={({pressed}) => [
          styles.dishCard,
          pressed && styles.dishCardPressed,
        ]}>
        <View
          style={[styles.dishContent, isUnavailable && styles.dishUnavailable]}>
          <View style={styles.dishInfo}>
            <View style={styles.dishNameRow}>
              <Text
                style={[
                  styles.dishName,
                  isUnavailable && styles.textUnavailable,
                ]}
                numberOfLines={1}>
                {item.name}
              </Text>
              {isUnavailable && (
                <View style={styles.unavailableBadge}>
                  <Text style={styles.unavailableBadgeText}>Hết món</Text>
                </View>
              )}
            </View>
            <Text
              style={[
                styles.dishPrice,
                isUnavailable && styles.textUnavailable,
              ]}>
              {formatPrice(item.price)}
            </Text>
          </View>

          <Switch
            value={item.available}
            onValueChange={() => toggleAvailability(item.id)}
            trackColor={{
              false: Colors.switchTrackOff,
              true: Colors.switchTrackOn,
            }}
            thumbColor={
              item.available ? Colors.switchThumbOn : Colors.switchThumbOff
            }
          />
        </View>
      </Pressable>
    );
  };

  // Render tiêu đề nhóm
  const renderSectionHeader = ({section}) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionIcon}>{section.icon}</Text>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <View style={styles.sectionBadge}>
        <Text style={styles.sectionCount}>{section.data.length}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />

      {/* Header thống kê */}
      <View style={styles.statsHeader}>
        <View style={styles.statsBadge}>
          <Text style={styles.statsBadgeText}>
            {`${dishes.length} món · ${occupiedTables}/10 bàn có khách`}
          </Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{dishes.length}</Text>
            <Text style={styles.statLabel}>Tổng món ăn</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{occupiedTables}/10</Text>
            <Text style={styles.statLabel}>Bàn có khách</Text>
          </View>
        </View>
      </View>

      {/* Danh sách món ăn */}
      {dishes.length === 0 && !loading ? (
        <EmptyState
          icon="🍽️"
          title="Chưa có món nào"
          message="Nhấn nút bên dưới để thêm món đầu tiên"
        />
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={item => item.id}
          renderItem={renderDishItem}
          renderSectionHeader={renderSectionHeader}
          contentContainerStyle={styles.listContent}
          stickySectionHeadersEnabled={false}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={ItemSeparator}
          SectionSeparatorComponent={SectionSeparator}
        />
      )}

      {/* Nút thêm món */}
      <View style={styles.addButtonContainer}>
        <PressableButton
          title="＋  Thêm món"
          onPress={() => navigation.navigate('DishForm', {dish: null})}
          variant="primary"
          size="large"
          style={styles.addButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  statsHeader: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.lg,
    alignItems: 'center',
    borderBottomLeftRadius: Spacing.radiusXl,
    borderBottomRightRadius: Spacing.radiusXl,
    ...Spacing.shadowMd,
  },
  statsBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Spacing.radiusFull,
    marginBottom: Spacing.md,
  },
  statsBadgeText: {
    ...Typography.label,
    color: Colors.textOnPrimary,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  statNumber: {
    ...Typography.h2,
    color: Colors.textOnPrimary,
    fontWeight: '800',
  },
  statLabel: {
    ...Typography.bodySmall,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  listContent: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.lg,
    paddingBottom: 90,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xs,
    marginTop: Spacing.sm,
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: Spacing.sm,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    flex: 1,
  },
  sectionBadge: {
    backgroundColor: Colors.primarySurface,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Spacing.radiusFull,
  },
  sectionCount: {
    ...Typography.labelSmall,
    color: Colors.primary,
  },
  separator: {
    height: Spacing.sm,
  },
  sectionSeparator: {
    height: Spacing.xs,
  },
  dishCard: {
    backgroundColor: Colors.surface,
    borderRadius: Spacing.radiusMd,
    ...Spacing.shadowSm,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  dishCardPressed: {
    opacity: 0.85,
    transform: [{scale: 0.985}],
  },
  dishContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingLeft: Spacing.cardPadding,
    paddingRight: Spacing.md,
  },
  dishUnavailable: {
    opacity: 0.45,
  },
  dishInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  dishNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: 4,
  },
  dishName: {
    ...Typography.label,
    color: Colors.textPrimary,
    flexShrink: 1,
  },
  textUnavailable: {
    color: Colors.textDisabled,
  },
  unavailableBadge: {
    backgroundColor: Colors.errorLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Spacing.radiusFull,
  },
  unavailableBadgeText: {
    ...Typography.caption,
    color: Colors.error,
    fontWeight: '600',
  },
  dishPrice: {
    ...Typography.priceSmall,
    color: Colors.primary,
  },
  addButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.screenPadding,
    paddingBottom: Spacing.xl,
    paddingTop: Spacing.md,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  addButton: {
    borderRadius: Spacing.radiusLg,
  },
});

export default MenuScreen;
