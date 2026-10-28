# ỨNG DỤNG QUẢN LÝ NHÀ HÀNG - ĐỀ SỐ 4
**Họ và tên:** Lê Anh Quân  
**MSSV:** B23DCCC136  
**Môn:** Phát triển ứng dụng di động đa nền tảng  
**Học viện Công nghệ Bưu chính Viễn thông (PTIT)**

---

## 📌 HƯỚNG DẪN CHẠY ỨNG DỤNG

### 1. Cài đặt dependencies (nếu clone từ zip):
```bash
cd RestaurantApp
npm install
```

### 2. Chạy ứng dụng trên Android:
```bash
# Khởi động Metro bundler
npx react-native start

# Mở một terminal khác chạy Android app
npx react-native run-android
```

---

## 🎨 HƯỚNG DẪN DÀNH CHO LẬP TRÌNH VIÊN (CHỈNH SỬA GIAO DIỆN)

Dự án được thiết kế module hoá cực kỳ sạch sẽ và dễ tùy biến. Toàn bộ thiết kế nằm trong thư mục `src/theme/`:

### 1. Đổi bảng màu ứng dụng:
Mở file `src/theme/colors.js`:
- `primary`: Màu chủ đạo của app (hiện tại là đỏ rượu vang `#C62828`). Đổi màu này sẽ đổi màu toàn bộ thanh tiêu đề Header, nút bấm chính, tab đang chọn.
- `accent`: Màu nhấn (vàng mật ong `#F9A825`).
- `background`: Màu nền các màn hình (`#FAFAFA`).
- `surface`: Màu nền thẻ Card (`#FFFFFF`).
- `tableEmpty` & `tableOccupied`: Màu bàn trống và bàn có khách trên sơ đồ bàn.

### 2. Đổi kích thước, font chữ:
Mở file `src/theme/typography.js`:
- Thay đổi `fontSize`, `fontWeight`, `lineHeight` cho các cấp bậc `h1`, `h2`, `h3`, `body`, `label`, `button`, `price`.

### 3. Đổi khoảng cách, bo góc, đổ bóng:
Mở file `src/theme/spacing.js`:
- `radiusMd`, `radiusLg`: Độ cong bo góc của card và nút bấm.
- `screenPadding`, `cardPadding`: Khoảng cách lề.
- `shadowSm`, `shadowMd`, `shadowLg`: Hiệu ứng đổ bóng chuẩn cho cả Android (`elevation`) và iOS (`shadowOffset/shadowRadius`).

---

## 📂 CẤU TRÚC THƯ MỤC DỰ ÁN

```
RestaurantApp/
├── src/
│   ├── theme/                  # Hệ thống giao diện (Câu 7)
│   │   ├── colors.js           # Bảng màu chung
│   │   ├── typography.js       # Font & cỡ chữ nhất quán
│   │   ├── spacing.js          # Bo góc, đổ bóng, padding
│   │   └── index.js            # Export theme
│   ├── components/             # Các component dùng lại (Câu 7)
│   │   ├── PressableButton.js  # Nút bấm có hiệu ứng nhấn & disabled
│   │   ├── QuantityControl.js  # Nút tăng/giảm số lượng (+ / -)
│   │   └── EmptyState.js       # Hiển thị khi danh sách rỗng
│   ├── screens/
│   │   ├── MenuScreen.js       # Câu 1 & 3: Thực đơn, bật/tắt, xoá món
│   │   ├── DishFormScreen.js   # Câu 2: Form thêm / sửa món + validation
│   │   ├── TableMapScreen.js   # Câu 4: Sơ đồ 10 bàn dạng lưới
│   │   ├── OrderScreen.js      # Câu 4: Chọn món, tăng giảm, tạm tính
│   │   └── PaymentScreen.js    # Câu 5: Chi tiết hoá đơn, VAT 8%, tiền thừa
│   ├── storage/
│   │   └── asyncStorage.js     # Câu 6: Quản lý lưu trữ AsyncStorage
│   ├── data/
│   │   └── initialData.js      # Khởi tạo 8 món (4 loại) + 1 hoá đơn
│   ├── utils/
│   │   ├── formatters.js       # Format giá VNĐ, ngày giờ
│   │   └── validators.js       # Validate tên món, giá, loại món
│   └── navigation/
│       └── AppNavigator.js     # Stack Navigation theo đúng quy định
├── App.tsx                     # Entry point chính + Bottom Tab chuyển đổi
└── create_submission_zip.ps1   # Script tự động nén nộp bài
```

---

## ✅ ĐÁP ỨNG ĐẦY ĐỦ CÁC CÂU HỎI TRONG ĐỀ THI

1. **Câu 1 – Màn hình Thực đơn (1,5đ):**
   - Dùng `SectionList` nhóm theo 4 loại: Khai vị, Món chính, Tráng miệng, Đồ uống có tiêu đề nhóm kèm icon sinh động.
   - Mỗi dòng gồm tên món và giá định dạng chuẩn `45.000 đ`.
   - Món đã hết hiển thị mờ (opacity) kèm nhãn nổi bật "Hết món".
   - `Switch` trên mỗi dòng để bật/tắt tức thì và lưu vào `AsyncStorage`.
   - Header hiển thị chính xác: `12 món · 3/10 bàn có khách` kèm thẻ đếm tổng quan.

2. **Câu 2 – Thêm / Sửa món (1,5đ):**
   - Nút "+ Thêm món" mở màn hình form qua Stack Navigation.
   - Cùng một form cho cả thêm và sửa (khi sửa tự động điền sẵn dữ liệu cũ).
   - Chọn loại món bằng 4 nút bấm có icon trực quan.
   - Kiểm tra dữ liệu chuẩn: tên không trống, không trùng tên món khác (không phân biệt hoa thường); giá > 0 và chia hết cho 1.000.
   - Thông báo lỗi hiển thị viền đỏ và dòng chữ báo lỗi ngay bên dưới từng ô nhập.

3. **Câu 3 – Xoá món (1,0đ):**
   - Nhấn giữ (`onLongPress`, delay 500ms) trên một dòng để xoá.
   - Có hỏi xác nhận bằng `Alert`.
   - Không cho xoá món đang có trong hoá đơn "Đang phục vụ", hiển thị cảnh báo bằng `Alert`.

4. **Câu 4 – Gọi món (1,5đ):**
   - Sơ đồ bàn hiển thị 10 bàn dạng lưới (`FlatList` với `numColumns={2}`). Bàn có khách tô màu đỏ nhạt, bàn trống màu xanh lá cây nhạt.
   - Nhấn vào bàn để mở màn hình Gọi món: tăng/giảm số lượng bằng nút `+` / `−` (giảm về 0 thì bỏ món khỏi hoá đơn).
   - Món đã hết vô hiệu hoá nút bấm và có cảnh báo nếu cố chọn.
   - Tạm tính cập nhật ngay khi thay đổi số lượng.
   - Mỗi bàn chỉ 1 hoá đơn đang phục vụ: bàn đã có khách thì mở lại hoá đơn đó để gọi thêm món.

5. **Câu 5 – Thanh toán (1,5đ):**
   - Màn hình Thanh toán hiển thị chi tiết: tên món, số lượng, đơn giá, thành tiền từng món; tạm tính, VAT 8%, tổng cộng.
   - Nhập tiền khách đưa tính tiền thừa ngay realtime. Có gợi ý mệnh giá tiền mặt nhanh (Đúng tiền, 100k, 200k, 500k...).
   - Không cho thanh toán nếu tiền khách đưa nhỏ hơn tổng cộng hoặc hoá đơn rỗng.
   - Thanh toán xong hoá đơn chuyển sang "Đã thanh toán" và bàn giải phóng về trạng thái trống.

6. **Câu 6 – Lưu trữ AsyncStorage (1,0đ):**
   - Khởi tạo lần đầu ít nhất 8 món (đủ 4 loại) và 1 hoá đơn bàn 3 đang phục vụ.
   - Toàn bộ dữ liệu thực đơn và hoá đơn lưu qua `AsyncStorage`, tắt bật app dữ liệu được bảo toàn nguyên vẹn.

7. **Câu 7 – Giao diện & Trải nghiệm (2,0đ):**
   - Bảng màu thống nhất `src/theme/colors.js`.
   - Không dùng inline style tràn lan, 100% dùng `StyleSheet.create`.
   - Card dạng thẻ bo góc, đổ bóng elevation/shadow.
   - Phản hồi thao tác: Nút bấm có hiệu ứng scale nhẹ khi chạm (`PressableButton`), nút disabled đổi màu rõ rệt, ô nhập sai viền đỏ, có `EmptyState` khi danh sách trống.
   - Dùng đúng bàn phím `numeric`, `KeyboardAvoidingView` + `ScrollView` chống che khuất, tích hợp an toàn `SafeAreaProvider` và `useSafeAreaInsets`.
