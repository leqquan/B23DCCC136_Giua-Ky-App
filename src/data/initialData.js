// Dữ liệu khởi tạo cho lần chạy đầu tiên
// 8 món đủ 4 loại + 1 hoá đơn đang phục vụ

import {formatDateTime} from '../utils/formatters';

// Tạo dữ liệu món ăn với ID cố định để tham chiếu
const dish1Id = 'dish_khaivi_01';
const dish2Id = 'dish_khaivi_02';
const dish3Id = 'dish_monchinh_01';
const dish4Id = 'dish_monchinh_02';
const dish5Id = 'dish_trangmieng_01';
const dish6Id = 'dish_trangmieng_02';
const dish7Id = 'dish_douong_01';
const dish8Id = 'dish_douong_02';

export const CATEGORIES = ['Khai vị', 'Món chính', 'Tráng miệng', 'Đồ uống'];

export const CATEGORY_ICONS = {
  'Khai vị': '🥗',
  'Món chính': '🍖',
  'Tráng miệng': '🍰',
  'Đồ uống': '🥤',
};

export const initialDishes = [
  {
    id: dish1Id,
    name: 'Gỏi cuốn tôm thịt',
    category: 'Khai vị',
    price: 45000,
    available: true,
  },
  {
    id: dish2Id,
    name: 'Chả giò rế',
    category: 'Khai vị',
    price: 55000,
    available: true,
  },
  {
    id: dish3Id,
    name: 'Bò lúc lắc khoai tây',
    category: 'Món chính',
    price: 185000,
    available: true,
  },
  {
    id: dish4Id,
    name: 'Cơm chiên hải sản',
    category: 'Món chính',
    price: 120000,
    available: true,
  },
  {
    id: dish5Id,
    name: 'Chè khúc bạch',
    category: 'Tráng miệng',
    price: 35000,
    available: true,
  },
  {
    id: dish6Id,
    name: 'Bánh flan caramel',
    category: 'Tráng miệng',
    price: 30000,
    available: true,
  },
  {
    id: dish7Id,
    name: 'Trà đào cam sả',
    category: 'Đồ uống',
    price: 40000,
    available: true,
  },
  {
    id: dish8Id,
    name: 'Sinh tố bơ',
    category: 'Đồ uống',
    price: 45000,
    available: false,
  },
];

export const initialInvoices = [
  {
    id: 'invoice_init_01',
    tableNumber: 3,
    items: [
      {dishId: dish1Id, quantity: 2},
      {dishId: dish3Id, quantity: 1},
      {dishId: dish7Id, quantity: 3},
    ],
    status: 'Đang phục vụ',
    createdAt: formatDateTime(new Date()),
  },
];

export const TABLE_COUNT = 10;
