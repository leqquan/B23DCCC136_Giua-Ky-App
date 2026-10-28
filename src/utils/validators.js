// Hàm validate dữ liệu

/**
 * Validate tên món ăn
 * @param {string} name - Tên món cần kiểm tra
 * @param {Array} existingDishes - Danh sách món hiện có
 * @param {string|null} editingId - ID món đang sửa (null nếu thêm mới)
 * @returns {string|null} - Thông báo lỗi hoặc null nếu hợp lệ
 */
export const validateDishName = (name, existingDishes = [], editingId = null) => {
  if (!name || name.trim().length === 0) {
    return 'Tên món không được để trống';
  }

  const trimmedName = name.trim().toLowerCase();
  const isDuplicate = existingDishes.some(
    dish =>
      dish.name.trim().toLowerCase() === trimmedName && dish.id !== editingId,
  );

  if (isDuplicate) {
    return 'Tên món đã tồn tại, vui lòng chọn tên khác';
  }

  return null;
};

/**
 * Validate giá món ăn
 * @param {string|number} price - Giá cần kiểm tra
 * @returns {string|null} - Thông báo lỗi hoặc null nếu hợp lệ
 */
export const validateDishPrice = (price) => {
  const numPrice = Number(price);

  if (!price || price.toString().trim() === '') {
    return 'Giá không được để trống';
  }

  if (isNaN(numPrice)) {
    return 'Giá phải là một số hợp lệ';
  }

  if (numPrice <= 0) {
    return 'Giá phải lớn hơn 0';
  }

  if (numPrice % 1000 !== 0) {
    return 'Giá phải là bội số của 1.000';
  }

  return null;
};

/**
 * Validate loại món
 * @param {string} category - Loại món cần kiểm tra
 * @returns {string|null} - Thông báo lỗi hoặc null nếu hợp lệ
 */
export const validateCategory = (category) => {
  const validCategories = ['Khai vị', 'Món chính', 'Tráng miệng', 'Đồ uống'];
  if (!category || !validCategories.includes(category)) {
    return 'Vui lòng chọn loại món';
  }
  return null;
};
