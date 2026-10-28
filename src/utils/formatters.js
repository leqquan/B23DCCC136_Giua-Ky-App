// Hàm format dữ liệu

/**
 * Format giá tiền theo định dạng VNĐ
 * Ví dụ: 45000 -> "45.000 đ"
 */
export const formatPrice = (price) => {
  if (price === null || price === undefined || isNaN(price)) {
    return '0 đ';
  }
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' đ';
};

/**
 * Format ngày giờ theo định dạng hh:mm dd/mm/yyyy
 */
export const formatDateTime = (date) => {
  const d = date ? new Date(date) : new Date();
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  return `${hours}:${minutes} ${day}/${month}/${year}`;
};

/**
 * Tạo ID duy nhất
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

/**
 * Format số lượng bàn đang có khách
 */
export const formatTableStatus = (occupiedCount, total = 10) => {
  return `${occupiedCount}/${total} bàn có khách`;
};
