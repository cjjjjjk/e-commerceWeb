<p align="center">
  <a href="https://expressjs.com/" target="blank"><img src="https://miro.medium.com/v2/resize:fit:640/format:webp/1*Jr3NFSKTfQWRUyjblBSKeg.png" width="200" alt="Express Logo" /></a>
</p>

# Express Server

📌 **Mô tả dự án**

Dự án này là một server API được xây dựng bằng Express.js.

📦 **Công nghệ sử dụng**

- **Backend:** Express.js, Node.js, MongoDB
- **Quản lý môi trường:** dotenv
- **Bảo mật:** Helmet, CORS
- **Xác thực:** JWT (JSON Web Token)

🔧 **Cài đặt & Chạy dự án**

```bash
# 1. Clone dự án

git clone https://github.com/your-username/project-name.git
cd project-name

# 2. Cài đặt dependencies

npm install

# 3. Cấu hình biến môi trường

# Tạo file .env và thêm các thông tin sau:
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your_jwt_secret_key

# 4. Chạy server

npm start    # Chạy chế độ production
npm run dev  # Chạy chế độ development (hot reload với nodemon)
```

🛠️ **Dev Tools**

- **Nodemon:** Reload server khi code thay đổi
- **Postman:** Test API dễ dàng
- **Docker (tùy chọn):** Deploy dễ dàng hơn

🤝 **Đóng góp**

Mọi đóng góp đều được hoan nghênh! Vui lòng tạo pull request nếu bạn muốn thêm tính năng hoặc sửa lỗi.

📜 **Giấy phép**

Dự án này được cấp phép theo MIT License.
