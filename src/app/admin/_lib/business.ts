import type { AdminLanguage, BusinessFieldPreset } from "./types";

export const groupByService: Record<string, string> = {
  hotel: "Stay",
  visa: "Visa",
  "car-rental": "Transport",
  "airport-transfer": "Transport",
  "flight-ticket": "Transport",
  sim: "Essentials",
  spa: "Leisure",
  "ktv-massage": "Leisure",
  "tour-guide": "Tour",
  restaurant: "Food",
};

export const businessCopy: Record<AdminLanguage, Record<string, { title: string; add: string; object: string }>> = {
  zh: {
    hotel: { title: "管理酒店房型 / 套餐", add: "新增房型/套餐", object: "房型/套餐" },
    visa: { title: "管理簽證類型 / 支援套餐", add: "新增簽證套餐", object: "簽證套餐" },
    "car-rental": { title: "管理租車車型", add: "新增車輛套餐", object: "車輛套餐" },
    "ktv-massage": { title: "管理 KTV / 按摩套餐", add: "新增娛樂套餐", object: "套餐" },
    "airport-transfer": { title: "管理機場接送路線", add: "新增路線/車輛", object: "路線/車輛" },
    spa: { title: "管理 SPA 療程", add: "新增療程", object: "療程" },
    sim: { title: "管理 SIM / eSIM 套餐", add: "新增 SIM 套餐", object: "SIM 套餐" },
    "flight-ticket": { title: "管理機票套餐", add: "新增機票套餐", object: "機票套餐" },
    "tour-guide": { title: "管理旅遊 / 導遊服務", add: "新增旅遊/導遊套餐", object: "旅遊/套餐" },
    restaurant: { title: "管理餐廳 / 套餐菜單", add: "新增餐廳/套餐", object: "餐廳/套餐" },
  },
  en: {
    hotel: { title: "Manage Hotel Rooms / Packages", add: "Add Room/Package", object: "room/package" },
    visa: { title: "Manage Visa Types / Support Packages", add: "Add Visa Package", object: "visa package" },
    "car-rental": { title: "Manage Rental Vehicle Lines", add: "Add Vehicle Package", object: "vehicle package" },
    "ktv-massage": { title: "Manage KTV / Massage Packages", add: "Add Entertainment Package", object: "package" },
    "airport-transfer": { title: "Manage Airport Transfer Routes", add: "Add Route/Vehicle", object: "route/vehicle" },
    spa: { title: "Manage SPA Treatments", add: "Add Treatment", object: "treatment" },
    sim: { title: "Manage SIM / eSIM Plans", add: "Add SIM Plan", object: "SIM plan" },
    "flight-ticket": { title: "Manage Flight Ticket Packages", add: "Add Ticket Package", object: "ticket package" },
    "tour-guide": { title: "Manage Tours / Guides", add: "Add Tour/Guide Package", object: "tour/package" },
    restaurant: { title: "Manage Restaurants / Set Menus", add: "Add Restaurant/Menu", object: "restaurant/menu" },
  },
};

export const businessFieldPresets: Record<string, BusinessFieldPreset> = {
  hotel: {
    filterFields: [
      { key: "area", label: "Khu vực", placeholder: "Quận 1 / Gần biển / Gần sân bay", table: true },
      { key: "tier", label: "Hạng sao", placeholder: "3 sao / 4 sao / 5 sao", table: true },
      { key: "guest", label: "Kiểu khách", placeholder: "Cá nhân / Gia đình / Đoàn", table: true },
    ],
    detailFields: [
      { key: "badge", label: "Badge", placeholder: "Mới上線 / 5 sao / Featured" },
      { key: "distance", label: "Khoảng cách", placeholder: "0.8km từ trung tâm" },
      { key: "room", label: "Loại phòng", placeholder: "Standard / Deluxe / Family" },
      { key: "capacity", label: "Sức chứa", placeholder: "1-2 khách / 3-5 khách" },
      { key: "amenities", label: "Tiện ích", placeholder: "Ăn sáng, hồ bơi, phòng nối" },
      { key: "perks", label: "Ưu đãi", placeholder: "Miễn phí hủy, không cần trả trước" },
      { key: "score", label: "Điểm đánh giá", placeholder: "8.8 / 9.1 / 10" },
      { key: "scoreLabel", label: "Nhãn đánh giá", placeholder: "Rất tốt / Xuất sắc" },
      { key: "reviews", label: "Số review", placeholder: "260 đánh giá" },
    ],
  },
  visa: {
    filterFields: [
      { key: "entry", label: "Loại nhập cảnh", placeholder: "1 lần / Nhiều lần", table: true },
      { key: "support", label: "Mức hỗ trợ", placeholder: "Tự nộp / Kiểm tra hồ sơ / Trọn gói", table: true },
    ],
    detailFields: [
      { key: "badge", label: "Badge", placeholder: "Phí chính thức / Hồ sơ gấp" },
      { key: "description", label: "Mô tả", placeholder: "Kiểm tra hồ sơ, nhắc lỗi dễ sai, theo dõi kết quả" },
      { key: "validity", label: "Thời hạn", placeholder: "Tối đa 90 ngày" },
      { key: "processing", label: "Thời gian xử lý", placeholder: "Khoảng 3 ngày làm việc" },
      { key: "document", label: "Hồ sơ cần có", placeholder: "Hộ chiếu, ảnh, ngày nhập cảnh" },
    ],
  },
  "car-rental": {
    filterFields: [
      { key: "vehicle", label: "Loại xe", placeholder: "4 chỗ / 7 chỗ / 16 chỗ", table: true },
      { key: "route", label: "Tuyến", placeholder: "Nội thành / Đi tỉnh / Theo lịch trình", table: true },
      { key: "duration", label: "Thời lượng", placeholder: "Theo giờ / 1 ngày / Nhiều ngày", table: true },
    ],
    detailFields: [
      { key: "badge", label: "Badge", placeholder: "Gia đình / Nhóm / VIP" },
      { key: "location", label: "Khu vực chạy", placeholder: "Nội thành / đi tỉnh / nhiều điểm" },
      { key: "capacity", label: "Số khách", placeholder: "1-3 khách / 4-5 khách / 8-14 khách" },
      { key: "luggage", label: "Hành lý", placeholder: "2 vali / 4 vali / nhiều hành lý" },
      { key: "driver", label: "Tài xế", placeholder: "Tài xế riêng / biết tiếng Trung" },
      { key: "description", label: "Mô tả", placeholder: "Xe riêng có tài xế, lịch trình linh hoạt, báo phụ phí trước" },
    ],
  },
  "airport-transfer": {
    filterFields: [
      { key: "airport", label: "Sân bay", placeholder: "SGN / HAN / DAD", table: true },
      { key: "vehicle", label: "Loại xe", placeholder: "4 chỗ / 7 chỗ / 16 chỗ", table: true },
      { key: "direction", label: "Chiều", placeholder: "Đón sân bay / Tiễn sân bay", table: true },
    ],
    detailFields: [
      { key: "badge", label: "Badge", placeholder: "Đón nhanh / Hành lý nhiều / Đoàn" },
      { key: "route", label: "Tuyến chạy", placeholder: "Sân bay - Quận 1 / Sân bay - khách sạn" },
      { key: "routes", label: "Các tuyến phổ biến", placeholder: "SGN - Q1, SGN - Q7, SGN - tỉnh gần" },
      { key: "waiting", label: "Chờ chuyến bay", placeholder: "Có theo dõi chuyến bay" },
      { key: "pickup", label: "Điểm đón", placeholder: "Cổng đến / sảnh khách sạn" },
      { key: "luggage", label: "Hành lý", placeholder: "2 vali / nhiều hành lý / đoàn" },
    ],
  },
  "ktv-massage": {
    filterFields: [
      { key: "type", label: "Loại dịch vụ", placeholder: "KTV / Massage", table: true },
      { key: "room", label: "Loại phòng", placeholder: "Phòng nhỏ / Phòng nhóm / VIP", table: true },
      { key: "group", label: "Số khách", placeholder: "2-5 khách / 6-12 khách / Cá nhân", table: true },
    ],
    detailFields: [
      { key: "badge", label: "Badge", placeholder: "Phòng nhỏ / Phòng nhóm / Massage" },
      { key: "duration", label: "Thời lượng", placeholder: "60 phút / 2-3 tiếng" },
      { key: "location", label: "Khu vực", placeholder: "Quận 1 / gần khách sạn / trung tâm giải trí" },
      { key: "package", label: "Gói gồm", placeholder: "Phòng, đồ uống, đặt giờ" },
      { key: "reviews", label: "Số review", placeholder: "4 / 8 / 10" },
      { key: "description", label: "Mô tả", placeholder: "Phòng riêng, hỗ trợ đặt giờ, báo phụ thu rõ" },
    ],
  },
  spa: {
    filterFields: [
      { key: "treatment", label: "Liệu trình", placeholder: "Foot / Body / Package", table: true },
      { key: "duration", label: "Thời lượng", placeholder: "60 phút / 90 phút / 120 phút", table: true },
      { key: "tier", label: "Mức", placeholder: "Mid-range / Premium", table: true },
    ],
    detailFields: [
      { key: "badge", label: "Badge", placeholder: "Popular / Premium / Couple" },
      { key: "room", label: "Không gian", placeholder: "Phòng riêng / phòng đôi / nhóm" },
      { key: "area", label: "Khu vực", placeholder: "Gần khách sạn / trung tâm" },
      { key: "style", label: "Kiểu massage", placeholder: "Aroma / Thai / Foot" },
      { key: "description", label: "Mô tả", placeholder: "Liệu trình thư giãn, spa sạch, hỗ trợ đặt theo giờ" },
    ],
  },
  sim: {
    filterFields: [
      { key: "type", label: "Loại SIM", placeholder: "SIM vật lý / eSIM", table: true },
      { key: "days", label: "Số ngày", placeholder: "15 ngày / 30 ngày", table: true },
      { key: "data", label: "Dung lượng", placeholder: "3GB/ngày / Không giới hạn", table: true },
    ],
    detailFields: [
      { key: "badge", label: "Badge", placeholder: "Popular / No physical SIM" },
      { key: "network", label: "Nhà mạng", placeholder: "Viettel / Vinaphone / Mobifone" },
      { key: "delivery", label: "Cách nhận", placeholder: "Giao khách sạn / nhận sân bay / online" },
      { key: "coverage", label: "Phạm vi", placeholder: "Toàn Việt Nam" },
      { key: "description", label: "Mô tả", placeholder: "Dùng bản đồ, Zalo, WeChat, hỗ trợ kích hoạt" },
    ],
  },
  "flight-ticket": {
    filterFields: [
      { key: "route", label: "Tuyến bay", placeholder: "Nội địa / Quốc tế", table: true },
      { key: "type", label: "Loại vé", placeholder: "Tiết kiệm / Linh hoạt / Đoàn", table: true },
      { key: "baggage", label: "Hành lý", placeholder: "Xách tay / Ký gửi", table: true },
    ],
    detailFields: [
      { key: "badge", label: "Badge", placeholder: "Economy / Checked baggage / Group" },
      { key: "airline", label: "Hãng bay", placeholder: "Vietnam Airlines / Vietjet / Bamboo" },
      { key: "trip", label: "Chiều đi", placeholder: "Một chiều / Khứ hồi" },
      { key: "changeRule", label: "Đổi vé", placeholder: "Theo điều kiện hạng vé" },
      { key: "duration", label: "Thời lượng/chặng", placeholder: "Một chiều / khứ hồi / theo hành trình" },
    ],
  },
  "tour-guide": {
    filterFields: [
      { key: "language", label: "Ngôn ngữ", placeholder: "Tiếng Trung / Tiếng Anh", table: true },
      { key: "duration", label: "Thời lượng", placeholder: "4 tiếng / 8 tiếng / nhiều ngày", table: true },
      { key: "style", label: "Loại tour", placeholder: "City tour / riêng tư / đoàn", table: true },
    ],
    detailFields: [
      { key: "badge", label: "Badge", placeholder: "Half day / Full day / Private" },
      { key: "city", label: "Thành phố", placeholder: "Hồ Chí Minh / Hà Nội / Đà Nẵng" },
      { key: "transport", label: "Di chuyển", placeholder: "Guide riêng / xe + guide" },
      { key: "guestCount", label: "Số khách", placeholder: "1-4 khách / đoàn" },
      { key: "description", label: "Mô tả", placeholder: "Guide tiếng Trung, lịch trình linh hoạt, hỗ trợ điểm ăn chơi" },
    ],
  },
  restaurant: {
    filterFields: [
      { key: "cuisine", label: "Ẩm thực", placeholder: "Việt Nam / Hải sản / Fine dining", table: true },
      { key: "group", label: "Nhóm khách", placeholder: "Cá nhân / Gia đình / Đoàn", table: true },
      { key: "meal", label: "Bữa", placeholder: "Trưa / Tối / Set menu", table: true },
    ],
    detailFields: [
      { key: "badge", label: "Badge", placeholder: "Local taste / Group booking / Fine dining" },
      { key: "area", label: "Khu vực", placeholder: "Gần khách sạn / trung tâm / ven biển" },
      { key: "room", label: "Không gian", placeholder: "Phòng riêng / bàn lớn / view đẹp" },
      { key: "menu", label: "Set menu", placeholder: "Hải sản, món Việt, đồ uống" },
      { key: "description", label: "Mô tả", placeholder: "Nhà hàng theo ngân sách, khẩu vị, vị trí khách sạn" },
    ],
  },
};
