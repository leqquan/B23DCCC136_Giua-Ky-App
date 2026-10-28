// AsyncStorage - Lưu trữ dữ liệu thực đơn và hoá đơn
import AsyncStorage from '@react-native-async-storage/async-storage';
import {initialDishes, initialInvoices} from '../data/initialData';

const STORAGE_KEYS = {
  DISHES: '@restaurant_dishes',
  INVOICES: '@restaurant_invoices',
  INITIALIZED: '@restaurant_initialized',
};

/**
 * Khởi tạo dữ liệu lần đầu chạy ứng dụng
 */
export const initializeData = async () => {
  try {
    const isInitialized = await AsyncStorage.getItem(STORAGE_KEYS.INITIALIZED);
    if (!isInitialized) {
      await AsyncStorage.setItem(
        STORAGE_KEYS.DISHES,
        JSON.stringify(initialDishes),
      );
      await AsyncStorage.setItem(
        STORAGE_KEYS.INVOICES,
        JSON.stringify(initialInvoices),
      );
      await AsyncStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
      return {dishes: initialDishes, invoices: initialInvoices};
    }
    return null;
  } catch (error) {
    console.error('Error initializing data:', error);
    return null;
  }
};

/**
 * Lấy danh sách món ăn
 */
export const getDishes = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.DISHES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting dishes:', error);
    return [];
  }
};

/**
 * Lưu danh sách món ăn
 */
export const saveDishes = async (dishes) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.DISHES, JSON.stringify(dishes));
    return true;
  } catch (error) {
    console.error('Error saving dishes:', error);
    return false;
  }
};

/**
 * Lấy danh sách hoá đơn
 */
export const getInvoices = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.INVOICES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting invoices:', error);
    return [];
  }
};

/**
 * Lưu danh sách hoá đơn
 */
export const saveInvoices = async (invoices) => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.INVOICES,
      JSON.stringify(invoices),
    );
    return true;
  } catch (error) {
    console.error('Error saving invoices:', error);
    return false;
  }
};

/**
 * Xoá toàn bộ dữ liệu (dùng khi debug)
 */
export const clearAllData = async () => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.DISHES,
      STORAGE_KEYS.INVOICES,
      STORAGE_KEYS.INITIALIZED,
    ]);
    return true;
  } catch (error) {
    console.error('Error clearing data:', error);
    return false;
  }
};
