# VietCryptoHub Backend 🚀

VietCryptoHub là một hệ thống phân tích thị trường tiền điện tử thông minh, tự động thu thập dữ liệu thị trường thực tế (Binance) và tin tức mới nhất để đưa ra các nhận định chuyên sâu sử dụng công nghệ AI (Gemini/Grok). Hệ thống tự động phát bản tin và cảnh báo biến động qua Telegram.

## 🌟 Tính năng chính

- **Phân tích AI chuyên sâu**: Tự động tổng hợp dữ liệu giá, Funding Rate, Open Interest, Long/Short Ratio và tin tức trong 4 giờ gần nhất để đưa ra nhận định thị trường.
- **Cảnh báo biến động nhanh (Market Alerts)**: Quét dữ liệu mỗi 30 phút và gửi cảnh báo ngay lập tức nếu có biến động giá mạnh (>5%) hoặc các chỉ số phái sinh bất thường.
- **Tích hợp đa AI**: Hỗ trợ Google Gemini và sẵn sàng cho xAI Grok (với cơ chế Prompt Caching giúp tối ưu chi phí).
- **Hệ thống tin nhắn Telegram**: Tự động broadcast bản tin phân tích và cảnh báo vào channel Telegram.
- **Lưu trữ & Phân tích lịch sử**: Lưu trữ toàn bộ dữ liệu phân tích vào MongoDB để theo dõi xu hướng tâm lý (Sentiment Trend).
- **Dockerized**: Sẵn sàng triển khai nhanh chóng với Docker Compose và Nginx Proxy.

## 🛠 Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **AI Engine**: Google Gemini (Flash/Pro), xAI Grok (Beta/4.x)
- **Real-time Data**: Binance Public API
- **Notifier**: Telegram Bot API
- **Deployment**: Docker, Docker Compose, Nginx
- **Logging**: Pino Logger

## 📂 Cấu trúc dự án

```text
src/
├── bin/                # Entry points (API & Scheduler)
├── config/             # Cấu hình hệ thống & Env
├── controllers/        # Xử lý logic API
├── infra/              # Kết nối cơ sở hạ tầng (MongoDB)
├── jobs/               # Định nghĩa các tác vụ định kỳ (Cron)
├── models/             # Schema dữ liệu (Mongoose)
├── repositories/       # Tầng giao tiếp với Database
├── routes/             # Định nghĩa các Endpoint API
├── services/           # Logic nghiệp vụ (AI, Binance, Telegram)
├── utils/              # Các hàm tiện ích (JWT, Response, Logger)
└── validations/        # Kiểm tra dữ liệu đầu vào (Joi)
```

## 📡 API Documentation

Tất cả các API đều bắt đầu bằng prefix: `/api/v1`

### Crypto Analysis
- `GET /crypto/latest`: Lấy bản tin phân tích mới nhất.
- `GET /crypto/history`: Xem lịch sử phân tích (hỗ trợ phân trang).
- `GET /crypto/sentiment-trend`: Lấy dữ liệu xu hướng tâm lý thị trường theo thời gian.
- `GET /crypto/trending-assets`: Danh sách các đồng coin đang được nhắc đến nhiều nhất.
- `POST /crypto/trigger`: Kích hoạt chạy phân tích ngay lập tức (Manual Trigger).

### Authentication
- `POST /auth/register`: Đăng ký tài khoản.
- `POST /auth/login`: Đăng nhập lấy JWT Token.
- `GET /auth/me`: Lấy thông tin cá nhân (Yêu cầu Token).

## ⏰ Scheduler (Tác vụ định kỳ)

Hệ thống sử dụng `node-cron` để quản lý 2 luồng công việc chính:
1. **Periodic Analysis (`0 */4 * * *`)**: Chạy 4 tiếng một lần. Thực hiện phân tích sâu bằng AI và gửi bản tin tổng quát vào Telegram.
2. **Market Alert Check (`*/30 * * * *`)**: Chạy 30 phút một lần. Kiểm tra nhanh dữ liệu giá và chỉ số phái sinh để gửi cảnh báo khẩn cấp (không tốn AI token).

## 🚀 Cài đặt & Triển khai

### Chạy Local
1. Clone dự án.
2. Cài đặt dependency: `npm install`
3. Cấu hình file `.env` (dựa trên `.env.copy.example`).
4. Chạy API: `npm start`
5. Chạy Scheduler: `npm run start:scheduler`

### Triển khai với Docker (Khuyên dùng)
Dự án đã được cấu hình sẵn Nginx làm Proxy, hỗ trợ tốt nhất khi chạy sau Cloudflare.

```bash
docker compose up -d --build
```

## 📝 Biến môi trường (.env)

Cần cấu hình các biến sau để hệ thống hoạt động:
- `MONGODB_URI`: Đường dẫn kết nối MongoDB.
- `GEMINI_API_KEY`: API Key từ Google AI Studio.
- `TELEGRAM_BOT_TOKEN`: Token từ BotFather.
- `TELEGRAM_CHANNEL_ID`: ID của channel nhận tin.
- `GROK_API_KEY`: (Tùy chọn) API Key từ xAI.

---
Phát triển bởi đội ngũ **VietCryptoHub**.
