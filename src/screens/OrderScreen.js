// OrderScreen - Màn hình Gọi món (Câu 4)
// Chọn món từ thực đơn, tăng/giảm số lượng, tạm tính realtime

import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  SectionList,
  StyleSheet,
  Alert,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {Colors, Typography, Spacing} from '../theme';
import {formatPrice, generateId, formatDateTime} from '../utils/formatters';
import {getDishes, getInvoices, saveInvoices} from '../storage/asyncStorage';
import {CATEGORIES, CATEGORY_ICONS} from '../data/initialData';
import QuantityControl from '../components/QuantityControl';
import PressableButton from '../components/PressableButton';

const ItemSeparator = () => <View style={styles.separator} />;
const SectionSeparator = () => <View style={styles.sectionSeparator} />;

const OrderScreen = ({route, navigation}) => {
  const {tableNumber} = route.params;
  const [dishes, setDishes] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [orderItems, setOrderItems] = useState({}); // {dishId: quantity}
  const [existingInvoice, setExistingInvoice] = useState(null);

  useEffect(() => {
    navigation.setOptions({
      title: `Gọi món - Bàn ${tableNumber}`,
    });
  }, [navigation, tableNumber]);

  const loadData = useCallback(async () => {
    const dishData = await getDishes();
    const invoiceData = await getInvoices();
    setDishes(dishData);
    setInvoices(invoiceData);

    // Tìm hoá đơn đang phục vụ của bàn này
    const activeInvoice = invoiceData.find(
      inv =>
        inv.tableNumber === tableNumber && inv.status === 'Đang phục vụ',
    );

    if (activeInvoice) {
      setExistingInvoice(activeInvoice);
      // Load lại các items đã gọi
      const items = {};
      activeInvoice.items.forEach(item => {
        items[item.dishId] = item.quantity;
      });
      setOrderItems(items);
    }
  }, [tableNumber]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  // Tính tạm tính
  const calculateSubtotal = () => {
    let total = 0;
    Object.entries(orderItems).forEach(([dishId, quantity]) => {
      const dish = dishes.find(d => d.id === dishId);
      if (dish && quantity > 0) {
        total += dish.price * quantity;
      }
    });
    return total;
  };

  // Đếm tổng số món đã gọi
  const totalItemCount = Object.values(orderItems).reduce(
    (sum, qty) => sum + qty,
    0,
  );

  // Tăng số lượng (Món đã hết không được chọn)
  const increaseQuantity = (dishId) => {
    const dish = dishes.find(d => d.id === dishId);
    if (!dish || !dish.available) {
      Alert.alert('Hết món', 'Món này hiện đang tạm hết, không thể gọi thêm.');
      return;
    }
    setOrderItems(prev => ({
      ...prev,
      [dishId]: (prev[dishId] || 0) + 1,
    }));
  };

  // Giảm số lượng
  const decreaseQuantity = (dishId) => {
    setOrderItems(prev => {
      const newQty = (prev[dishId] || 0) - 1;
      if (newQty <= 0) {
        const updated = {...prev};
        delete updated[dishId];
        return updated;
      }
      return {...prev, [dishId]: newQty};
    });
  };

  // Lưu hoá đơn xuống AsyncStorage
  const saveCurrentOrder = async () => {
    const items = Object.entries(orderItems)
      .filter(([_, quantity]) => quantity > 0)
      .map(([dishId, quantity]) => ({dishId, quantity}));

    if (items.length === 0) {
      if (existingInvoice) {
        // Nếu giảm hết tất cả về 0 thì xoá hoá đơn để bàn trở về trạng thái trống
        const updatedInvoices = invoices.filter(inv => inv.id !== existingInvoice.id);
        await saveInvoices(updatedInvoices);
        setInvoices(updatedInvoices);
        setExistingInvoice(null);
      }
      return true;
    }

    let updatedInvoices;
    if (existingInvoice) {
      // Cập nhật hoá đơn hiện có
      updatedInvoices = invoices.map(inv =>
        inv.id === existingInvoice.id
          ? {...inv, items}
          : inv,
      );
    } else {
      // Tạo hoá đơn mới
      const newInvoice = {
        id: generateId(),
        tableNumber,
        items,
        status: 'Đang phục vụ',
        createdAt: formatDateTime(new Date()),
      };
      updatedInvoices = [...invoices, newInvoice];
    }

    await saveInvoices(updatedInvoices);
    setInvoices(updatedInvoices);
    return true;
  };

  // Nút Lưu/Xác nhận gọi món
  const handleSaveOrder = async () => {
    if (totalItemCount === 0) {
      if (existingInvoice) {
        Alert.alert(
          'Huỷ đơn',
          'Đã giảm hết món. Bạn có muốn giải phóng bàn này không?',
          [
            {text: 'Không', style: 'cancel'},
            {
              text: 'Giải phóng',
              onPress: async () => {
                await saveCurrentOrder();
                navigation.goBack();
              },
            },
          ],
        );
        return;
      }
      Alert.alert('Thông báo', 'Vui lòng chọn ít nhất một món.');
      return;
    }

    await saveCurrentOrder();
    Alert.alert('Thành công', `Đã lưu danh sách gọi món cho bàn ${tableNumber}.`, [
      {text: 'OK', onPress: () => navigation.goBack()},
    ]);
  };

  // Nút chuyển sang màn hình Thanh toán (Lưu trước rồi mới chuyển sang thanh toán)
  const handleProceedToPayment = async () => {
    if (totalItemCount === 0) {
      Alert.alert('Thông báo', 'Vui lòng chọn ít nhất một món để thanh toán.');
      return;
    }
    await saveCurrentOrder();
    navigation.navigate('Payment', {tableNumber});
  };

  // Tạo dữ liệu cho SectionList
  const sections = CATEGORIES.map(category => ({
    title: category,
    icon: CATEGORY_ICONS[category],
    data: dishes.filter(dish => dish.category === category),
  })).filter(section => section.data.length > 0);

  const renderDishItem = ({item}) => {
    const isUnavailable = !item.available;
    const quantity = orderItems[item.id] || 0;

    return (
      <View
        style={[
          styles.dishCard,
          isUnavailable && styles.dishCardUnavailable,
          quantity > 0 && styles.dishCardSelected,
        ]}>
        <View style={styles.dishInfo}>
          <Text
            style={[styles.dishName, isUnavailable && styles.textUnavailable]}
            numberOfLines={1}>
            {item.name}
          </Text>
          <View style={styles.dishMeta}>
            <Text
              style={[
                styles.dishPrice,
                isUnavailable && styles.textUnavailable,
              ]}>
              {formatPrice(item.price)}
            </Text>
            {isUnavailable && (
              <View style={styles.unavailableBadge}>
                <Text style={styles.unavailableBadgeText}>Hết món</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.quantitySection}>
          {quantity > 0 && (
            <Text style={styles.itemTotal}>
              {formatPrice(item.price * quantity)}
            </Text>
          )}
          <QuantityControl
            quantity={quantity}
            onIncrease={() => increaseQuantity(item.id)}
            onDecrease={() => decreaseQuantity(item.id)}
            disabled={isUnavailable}
          />
        </View>
      </View>
    );
  };

  const renderSectionHeader = ({section}) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionIcon}>{section.icon}</Text>
      <Text style={styles.sectionTitle}>{section.title}</Text>
    </View>
  );

  const subtotal = calculateSubtotal();

  return (
    <View style={styles.container}>
      {/* Danh sách món */}
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

      {/* Footer tạm tính */}
      <View style={styles.footer}>
        <View style={styles.subtotalRow}>
          <View>
            <Text style={styles.subtotalLabel}>
              Tạm tính ({totalItemCount} món)
            </Text>
          </View>
          <Text style={styles.subtotalAmount}>{formatPrice(subtotal)}</Text>
        </View>

        <View style={styles.footerButtons}>
          <PressableButton
            title="Xác nhận gọi món"
            onPress={handleSaveOrder}
            variant="primary"
            size="large"
            style={styles.confirmButton}
            disabled={totalItemCount === 0}
          />
          {totalItemCount > 0 && (
            <PressableButton
              title="Thanh toán"
              onPress={handleProceedToPayment}
              variant="success"
              size="large"
              style={styles.payButton}
            />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.lg,
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
  },
  separator: {
    height: Spacing.sm,
  },
  sectionSeparator: {
    height: Spacing.xs,
  },
  dishCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Spacing.radiusMd,
    padding: Spacing.cardPadding,
    borderWidth: 1.5,
    borderColor: Colors.cardBorder,
    ...Spacing.shadowSm,
  },
  dishCardUnavailable: {
    opacity: 0.45,
  },
  dishCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primarySurface,
  },
  dishInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  dishName: {
    ...Typography.label,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  textUnavailable: {
    color: Colors.textDisabled,
  },
  dishMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  dishPrice: {
    ...Typography.priceSmall,
    color: Colors.primary,
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
  quantitySection: {
    alignItems: 'flex-end',
    gap: Spacing.xs,
  },
  itemTotal: {
    ...Typography.labelSmall,
    color: Colors.textSecondary,
  },
  footer: {
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: Spacing.lg,
    ...Spacing.shadowLg,
  },
  subtotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  subtotalLabel: {
    ...Typography.label,
    color: Colors.textSecondary,
  },
  subtotalAmount: {
    ...Typography.h2,
    color: Colors.primary,
  },
  footerButtons: {
    gap: Spacing.sm,
  },
  confirmButton: {
    borderRadius: Spacing.radiusLg,
  },
  payButton: {
    borderRadius: Spacing.radiusLg,
  },
});

export default OrderScreen;
