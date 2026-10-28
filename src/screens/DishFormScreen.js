// DishFormScreen - Màn hình Thêm/Sửa món (Câu 2)
// Form dùng chung cho thêm mới và chỉnh sửa món ăn

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import {Colors, Typography, Spacing} from '../theme';
import {generateId} from '../utils/formatters';
import {validateDishName, validateDishPrice, validateCategory} from '../utils/validators';
import {getDishes, saveDishes} from '../storage/asyncStorage';
import {CATEGORIES, CATEGORY_ICONS} from '../data/initialData';
import PressableButton from '../components/PressableButton';

const DishFormScreen = ({route, navigation}) => {
  const editingDish = route.params?.dish || null;
  const isEditing = !!editingDish;

  const [name, setName] = useState(editingDish?.name || '');
  const [price, setPrice] = useState(
    editingDish?.price ? editingDish.price.toString() : '',
  );
  const [category, setCategory] = useState(editingDish?.category || '');
  const [allDishes, setAllDishes] = useState([]);

  // Errors
  const [nameError, setNameError] = useState(null);
  const [priceError, setPriceError] = useState(null);
  const [categoryError, setCategoryError] = useState(null);

  // Load dữ liệu món hiện có để kiểm tra trùng tên
  useEffect(() => {
    const loadDishes = async () => {
      const dishes = await getDishes();
      setAllDishes(dishes);
    };
    loadDishes();
  }, []);

  // Set tiêu đề màn hình
  useEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Sửa món' : 'Thêm món mới',
    });
  }, [navigation, isEditing]);

  // Validate realtime khi nhập
  const handleNameChange = (text) => {
    setName(text);
    if (nameError) {
      const error = validateDishName(
        text,
        allDishes,
        isEditing ? editingDish.id : null,
      );
      setNameError(error);
    }
  };

  const handlePriceChange = (text) => {
    // Chỉ cho phép nhập số
    const numericText = text.replace(/[^0-9]/g, '');
    setPrice(numericText);
    if (priceError) {
      const error = validateDishPrice(numericText);
      setPriceError(error);
    }
  };

  const handleCategorySelect = (cat) => {
    setCategory(cat);
    if (categoryError) {
      setCategoryError(null);
    }
  };

  // Lưu món
  const handleSave = async () => {
    // Validate tất cả
    const nameErr = validateDishName(
      name,
      allDishes,
      isEditing ? editingDish.id : null,
    );
    const priceErr = validateDishPrice(price);
    const catErr = validateCategory(category);

    setNameError(nameErr);
    setPriceError(priceErr);
    setCategoryError(catErr);

    if (nameErr || priceErr || catErr) {
      return;
    }

    const dishData = {
      id: isEditing ? editingDish.id : generateId(),
      name: name.trim(),
      category,
      price: Number(price),
      available: isEditing ? editingDish.available : true,
    };

    let updatedDishes;
    if (isEditing) {
      updatedDishes = allDishes.map(d =>
        d.id === editingDish.id ? dishData : d,
      );
    } else {
      updatedDishes = [...allDishes, dishData];
    }

    await saveDishes(updatedDishes);
    navigation.goBack();
  };

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
        {/* Tên món */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Tên món ăn</Text>
          <TextInput
            style={[styles.input, nameError && styles.inputError]}
            value={name}
            onChangeText={handleNameChange}
            placeholder="Nhập tên món ăn..."
            placeholderTextColor={Colors.textDisabled}
            maxLength={50}
            onBlur={() => {
              setNameError(
                validateDishName(
                  name,
                  allDishes,
                  isEditing ? editingDish.id : null,
                ),
              );
            }}
          />
          {nameError && <Text style={styles.errorText}>{nameError}</Text>}
        </View>

        {/* Loại món */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Loại món</Text>
          <View style={styles.categoryContainer}>
            {CATEGORIES.map(cat => (
              <Pressable
                key={cat}
                onPress={() => handleCategorySelect(cat)}
                style={({pressed}) => [
                  styles.categoryButton,
                  category === cat && styles.categoryButtonActive,
                  pressed && styles.categoryButtonPressed,
                  categoryError && !category && styles.categoryButtonError,
                ]}>
                <Text style={styles.categoryIcon}>
                  {CATEGORY_ICONS[cat]}
                </Text>
                <Text
                  style={[
                    styles.categoryText,
                    category === cat && styles.categoryTextActive,
                  ]}>
                  {cat}
                </Text>
              </Pressable>
            ))}
          </View>
          {categoryError && (
            <Text style={styles.errorText}>{categoryError}</Text>
          )}
        </View>

        {/* Giá */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Giá bán (VNĐ)</Text>
          <View style={[styles.priceInputContainer, priceError && styles.inputError]}>
            <TextInput
              style={styles.priceInput}
              value={price}
              onChangeText={handlePriceChange}
              placeholder="Ví dụ: 45000"
              placeholderTextColor={Colors.textDisabled}
              keyboardType="numeric"
              onBlur={() => setPriceError(validateDishPrice(price))}
            />
            <Text style={styles.priceSuffix}>đ</Text>
          </View>
          {priceError && <Text style={styles.errorText}>{priceError}</Text>}
          {price && !priceError && (
            <Text style={styles.pricePreview}>
              Hiển thị:{' '}
              {Number(price)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, '.')}{' '}
              đ
            </Text>
          )}
        </View>

        {/* Nút lưu */}
        <View style={styles.buttonContainer}>
          <PressableButton
            title={isEditing ? 'Cập nhật món' : 'Thêm món'}
            onPress={handleSave}
            variant="primary"
            size="large"
            style={styles.saveButton}
          />
          <PressableButton
            title="Huỷ bỏ"
            onPress={() => navigation.goBack()}
            variant="outline"
            size="large"
            style={styles.cancelButton}
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
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxxl,
  },
  fieldContainer: {
    marginBottom: Spacing.xxl,
  },
  label: {
    ...Typography.labelLarge,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.cardBorder,
    borderRadius: Spacing.radiusMd,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    ...Typography.body,
    color: Colors.textPrimary,
  },
  inputError: {
    borderColor: Colors.error,
    borderWidth: 1.5,
    backgroundColor: Colors.errorLight,
  },
  errorText: {
    ...Typography.bodySmall,
    color: Colors.error,
    marginTop: Spacing.xs,
    marginLeft: Spacing.xs,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.cardBorder,
    borderRadius: Spacing.radiusMd,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    gap: Spacing.xs,
    flex: 1,
    minWidth: '45%',
  },
  categoryButtonActive: {
    backgroundColor: Colors.primarySurface,
    borderColor: Colors.primary,
  },
  categoryButtonPressed: {
    opacity: 0.7,
    transform: [{scale: 0.97}],
  },
  categoryButtonError: {
    borderColor: Colors.error,
  },
  categoryIcon: {
    fontSize: 18,
  },
  categoryText: {
    ...Typography.label,
    color: Colors.textSecondary,
  },
  categoryTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.cardBorder,
    borderRadius: Spacing.radiusMd,
    paddingRight: Spacing.lg,
  },
  priceInput: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    ...Typography.body,
    color: Colors.textPrimary,
  },
  priceSuffix: {
    ...Typography.labelLarge,
    color: Colors.textSecondary,
  },
  pricePreview: {
    ...Typography.bodySmall,
    color: Colors.success,
    marginTop: Spacing.xs,
    marginLeft: Spacing.xs,
  },
  buttonContainer: {
    marginTop: Spacing.lg,
    gap: Spacing.md,
  },
  saveButton: {
    borderRadius: Spacing.radiusLg,
  },
  cancelButton: {
    borderRadius: Spacing.radiusLg,
  },
});

export default DishFormScreen;
