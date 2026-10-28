// PaymentScreen - Màn hình Thanh toán (Câu 5)
// Chi tiết hoá đơn, VAT 8%, tiền khách đưa, tiền thừa

import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Pressable,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {Colors, Typography, Spacing} from '../theme';
import {formatPrice} from '../utils/formatters';
import {getDishes, getInvoices, saveInvoices} from '../storage/asyncStorage';
import PressableButton from '../components/PressableButton';
import EmptyState from '../components/EmptyState';

const VAT_RATE = 0.08; // 8%

const PaymentScreen = ({route, navigation}) => {
  const {tableNumber} = route.params;
  const [dishes, setDishes] = useState([]);
  const [invoice, setInvoice] = useState(null);
  const [allInvoices, setAllInvoices] = useState([]);
  const [customerMoney, setCustomerMoney] = useState('');

  useEffect(() => {
    navigation.setOptions({
      title: `Thanh toán - Bàn ${tableNumber}`,
    });
  }, [navigation, tableNumber]);

  const loadData = useCallback(async () => {
    const dishData = await getDishes();
    const invoiceData = await getInvoices();
    setDishes(dishData);
    setAllInvoices(invoiceData);

    const activeInvoice = invoiceData.find(
      inv =>
        inv.tableNumber === tableNumber && inv.status === 'Đang phục vụ',
    );
    setInvoice(activeInvoice || null);
  }, [tableNumber]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  // Tính toán chi tiết
  const getOrderDetails = () => {
    if (!invoice) return [];
    return invoice.items.map(item => {
      const dish = dishes.find(d => d.id === item.dishId);
      return {
        ...item,
        name: dish?.name || 'Món đã xoá',
        unitPrice: dish?.price || 0,
        total: (dish?.price || 0) * item.quantity,
      };
    });
  };

  const orderDetails = getOrderDetails();

  const subtotal = orderDetails.reduce((sum, item) => sum + item.total, 0);
  const vatAmount = Math.round(subtotal * VAT_RATE);
  const grandTotal = subtotal + vatAmount;

  const customerMoneyNum = Number(customerMoney) || 0;
  const change = customerMoneyNum - grandTotal;

  // Xác nhận thanh toán
  const handlePayment = () => {
    if (!invoice || orderDetails.length === 0) {
      Alert.alert('Lỗi', 'Hoá đơn không có món nào.');
      return;
    }

    if (customerMoneyNum < grandTotal) {
      Alert.alert(
        'Không đủ tiền',
        'Số tiền khách đưa nhỏ hơn tổng cộng. Vui lòng nhập lại.',
      );
      return;
    }

    Alert.alert(
      'Xác nhận thanh toán',
      `Tổng cộng: ${formatPrice(grandTotal)}\nTiền khách đưa: ${formatPrice(customerMoneyNum)}\nTiền thừa: ${formatPrice(change)}`,
      [
        {text: 'Huỷ', style: 'cancel'},
        {
          text: 'Xác nhận',
          onPress: async () => {
            const updatedInvoices = allInvoices.map(inv =>
              inv.id === invoice.id
                ? {...inv, status: 'Đã thanh toán'}
                : inv,
            );
            await saveInvoices(updatedInvoices);
            Alert.alert(
              'Thành công! 🎉',
              `Bàn ${tableNumber} đã thanh toán xong.\nTiền thừa: ${formatPrice(change)}`,
              [
                {
                  text: 'OK',
                  onPress: () => navigation.popToTop(),
                },
              ],
            );
          },
        },
      ],
    );
  };


  if (!invoice) {
    return (
      <View style={styles.container}>
        <EmptyState
          icon="📋"
          title="Chưa có hoá đơn"
          message={`Bàn ${tableNumber} chưa có hoá đơn đang phục vụ`}
        />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {/* Header hoá đơn */}
        <View style={styles.invoiceHeader}>
          <Text style={styles.restaurantName}>🍽️ Nhà Hàng</Text>
          <Text style={styles.invoiceTitle}>HOÁ ĐƠN THANH TOÁN</Text>
          <View style={styles.invoiceMeta}>
            <Text style={styles.invoiceMetaText}>Bàn: {tableNumber}</Text>
            <Text style={styles.invoiceMetaText}>{invoice.createdAt}</Text>
          </View>
        </View>

        {/* Đường kẻ nét đứt */}
        <View style={styles.dashedLine} />

        {/* Chi tiết món */}
        <View style={styles.detailSection}>
          <View style={styles.detailHeader}>
            <Text style={styles.detailHeaderText}>Món ăn</Text>
            <Text style={styles.detailHeaderText}>Thành tiền</Text>
          </View>

          {orderDetails.map((item, index) => (
            <View key={item.dishId} style={styles.orderItem}>
              <View style={styles.orderItemLeft}>
                <Text style={styles.orderItemIndex}>{index + 1}.</Text>
                <View style={styles.orderItemInfo}>
                  <Text style={styles.orderItemName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.orderItemDetail}>
                    {formatPrice(item.unitPrice)} × {item.quantity}
                  </Text>
                </View>
              </View>
              <Text style={styles.orderItemTotal}>
                {formatPrice(item.total)}
              </Text>
            </View>
          ))}
        </View>

        {/* Đường kẻ */}
        <View style={styles.dashedLine} />

        {/* Tổng cộng */}
        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tạm tính</Text>
            <Text style={styles.totalValue}>{formatPrice(subtotal)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>VAT (8%)</Text>
            <Text style={styles.totalValue}>{formatPrice(vatAmount)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.grandTotalLabel}>TỔNG CỘNG</Text>
            <Text style={styles.grandTotalValue}>
              {formatPrice(grandTotal)}
            </Text>
          </View>
        </View>

        {/* Nhập tiền khách đưa */}
        <View style={styles.paymentSection}>
          <Text style={styles.paymentLabel}>Tiền khách đưa (VNĐ)</Text>
          <View
            style={[
              styles.paymentInputContainer,
              customerMoneyNum > 0 &&
                customerMoneyNum < grandTotal &&
                styles.paymentInputError,
            ]}>
            <TextInput
              style={styles.paymentInput}
              value={customerMoney}
              onChangeText={text => {
                const numericText = text.replace(/[^0-9]/g, '');
                setCustomerMoney(numericText);
              }}
              placeholder="Nhập số tiền..."
              placeholderTextColor={Colors.textDisabled}
              keyboardType="numeric"
            />
            <Text style={styles.paymentSuffix}>đ</Text>
          </View>

          {/* Gợi ý mệnh giá nhanh */}
          <View style={styles.quickCashContainer}>
            <Pressable
              onPress={() => setCustomerMoney(grandTotal.toString())}
              style={({pressed}) => [
                styles.quickCashChip,
                customerMoneyNum === grandTotal && styles.quickCashChipActive,
                pressed && styles.quickCashChipPressed,
              ]}>
              <Text
                style={[
                  styles.quickCashText,
                  customerMoneyNum === grandTotal && styles.quickCashTextActive,
                ]}>
                Đúng tiền ({formatPrice(grandTotal)})
              </Text>
            </Pressable>
            {[50000, 100000, 200000, 500000, 1000000]
              .filter(amount => amount > grandTotal)
              .slice(0, 3)
              .map(amount => (
                <Pressable
                  key={amount}
                  onPress={() => setCustomerMoney(amount.toString())}
                  style={({pressed}) => [
                    styles.quickCashChip,
                    customerMoneyNum === amount && styles.quickCashChipActive,
                    pressed && styles.quickCashChipPressed,
                  ]}>
                  <Text
                    style={[
                      styles.quickCashText,
                      customerMoneyNum === amount && styles.quickCashTextActive,
                    ]}>
                    {formatPrice(amount)}
                  </Text>
                </Pressable>
              ))}
          </View>

          {customerMoneyNum > 0 && customerMoneyNum < grandTotal && (
            <Text style={styles.errorText}>
              Tiền khách đưa chưa đủ (thiếu {formatPrice(grandTotal - customerMoneyNum)})
            </Text>
          )}

          {customerMoneyNum >= grandTotal && customerMoneyNum > 0 && (
            <View style={styles.changeContainer}>
              <Text style={styles.changeLabel}>💵 Tiền thừa</Text>
              <Text style={styles.changeAmount}>{formatPrice(change)}</Text>
            </View>
          )}
        </View>

        {/* Nút thanh toán */}
        <View style={styles.buttonContainer}>
          <PressableButton
            title="Xác nhận thanh toán"
            onPress={handlePayment}
            variant="success"
            size="large"
            style={styles.payButton}
            disabled={
              customerMoneyNum < grandTotal ||
              customerMoneyNum === 0 ||
              orderDetails.length === 0
            }
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.screenPadding,
    paddingBottom: Spacing.xxxl,
  },
  invoiceHeader: {
    backgroundColor: Colors.surface,
    borderRadius: Spacing.radiusLg,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.lg,
    ...Spacing.shadowSm,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  restaurantName: {
    ...Typography.h2,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  invoiceTitle: {
    ...Typography.labelSmall,
    color: Colors.textSecondary,
    letterSpacing: 2,
    marginBottom: Spacing.md,
  },
  invoiceMeta: {
    flexDirection: 'row',
    gap: Spacing.xl,
  },
  invoiceMetaText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  dashedLine: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.cardBorder,
    borderStyle: 'dashed',
    marginVertical: Spacing.md,
  },
  detailSection: {
    backgroundColor: Colors.surface,
    borderRadius: Spacing.radiusLg,
    padding: Spacing.lg,
    ...Spacing.shadowSm,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    marginBottom: Spacing.md,
  },
  detailHeaderText: {
    ...Typography.labelSmall,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  orderItemLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    marginRight: Spacing.md,
  },
  orderItemIndex: {
    ...Typography.bodySmall,
    color: Colors.textDisabled,
    width: 24,
    marginTop: 2,
  },
  orderItemInfo: {
    flex: 1,
  },
  orderItemName: {
    ...Typography.label,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  orderItemDetail: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  orderItemTotal: {
    ...Typography.priceSmall,
    color: Colors.textPrimary,
  },
  totalSection: {
    backgroundColor: Colors.surface,
    borderRadius: Spacing.radiusLg,
    padding: Spacing.lg,
    marginTop: Spacing.lg,
    ...Spacing.shadowSm,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  totalLabel: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  totalValue: {
    ...Typography.label,
    color: Colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: Spacing.sm,
  },
  grandTotalLabel: {
    ...Typography.h3,
    color: Colors.primary,
  },
  grandTotalValue: {
    ...Typography.h2,
    color: Colors.primary,
  },
  paymentSection: {
    marginTop: Spacing.xl,
  },
  paymentLabel: {
    ...Typography.labelLarge,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  paymentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.cardBorder,
    borderRadius: Spacing.radiusMd,
    paddingRight: Spacing.lg,
    ...Spacing.shadowSm,
  },
  paymentInputError: {
    borderColor: Colors.error,
    backgroundColor: Colors.errorLight,
  },
  paymentInput: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    ...Typography.h3,
    color: Colors.textPrimary,
  },
  paymentSuffix: {
    ...Typography.h3,
    color: Colors.textSecondary,
  },
  errorText: {
    ...Typography.bodySmall,
    color: Colors.error,
    marginTop: Spacing.xs,
    marginLeft: Spacing.xs,
  },
  changeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.successLight,
    borderRadius: Spacing.radiusMd,
    padding: Spacing.lg,
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.success,
  },
  changeLabel: {
    ...Typography.label,
    color: Colors.success,
  },
  changeAmount: {
    ...Typography.h2,
    color: Colors.success,
  },
  buttonContainer: {
    marginTop: Spacing.xxl,
  },
  payButton: {
    borderRadius: Spacing.radiusLg,
  },
  quickCashContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  quickCashChip: {
    backgroundColor: Colors.surfaceVariant,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Spacing.radiusFull,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  quickCashChipActive: {
    backgroundColor: Colors.primarySurface,
    borderColor: Colors.primary,
  },
  quickCashChipPressed: {
    opacity: 0.7,
  },
  quickCashText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  quickCashTextActive: {
    color: Colors.primary,
  },
});

export default PaymentScreen;
