<<<<<<< HEAD
# Hệ thống quản lý nhân sự

## 1. Thông tin sinh viên
- Họ và tên: Nguyễn Viết Anh Quân
- MSSV: 237736
- Lớp: DH23TIN09

## 2. Mô tả hệ thống
Hệ thống quản lý nhân sự hỗ trợ quản lý thông tin nhân viên, bao gồm xem danh sách, thêm, cập nhật và xóa nhân viên. Dự án sử dụng kiến trúc tách biệt Frontend và Backend.

## 3. Công nghệ sử dụng
- Frontend: HTML, CSS, JavaScript, Vite
- Backend: Node.js, Express.js
- Cơ sở dữ liệu: MongoDB Atlas
- Quản lý mã nguồn: Git, GitHub
- Đóng gói: Docker
- Triển khai: Render

## 4. Hướng dẫn chạy ứng dụng
### Backend
    cd backend
    npm install
    cp .env.example .env
    npm run dev

API mặc định: http://localhost:5000

### Frontend
Mở Git Bash mới tại thư mục dự án:
    cd frontend
    npm install
    npm run dev

Mở địa chỉ hiển thị trong Terminal, thường là http://localhost:5173.

## 5. Các liên kết dự án
- GitHub Repository: https://github.com/AnhQuan279205/237736_NguyenVietAnhQuan
- Docker Hub Backend: https://hub.docker.com/r/anhquan279205/backend
- Docker Hub Frontend: https://hub.docker.com/r/anhquan279205/frontend
- Render App: https://web-237736.onrender.com
- Render API: https://api-237736.onrender.com
- MongoDB Atlas: https://cloud.mongodb.com/v2/6a82863ae9e01d0b0221ba42#/explorer/6a828687669cc9eb12f95b2b/237736_NguyenVietAnhQuan/employees/find

## 6. Cấu trúc dự án
- backend/models/: Mô hình dữ liệu
- backend/routes/: Các tuyến API
- backend/.env.example: Mẫu biến môi trường
- backend/Dockerfile: Cấu hình Docker Backend
- frontend/src/: Mã nguồn Frontend
- frontend/Dockerfile: Cấu hình Docker Frontend

# 237736_NguyenVietAnhQuan
Hệ thống quản lý nhân sự sử dụng kiến trúc Frontend và Backend tách biệt.
>>>>>>> origin/main
