# Smart Quiz

Ứng dụng ôn tập và kiểm tra kiến thức về chủ quyền biển đảo Việt Nam, xây dựng bằng Next.js App Router, React 19 và MongoDB.

Hệ thống có 2 luồng sử dụng chính:

- Học sinh đăng nhập bằng `classId`, đọc phần ôn tập, làm 4 trạm củng cố và bài quiz 6 câu.
- Giáo viên đăng nhập bằng mã demo để xem bảng điểm tổng hợp và xuất Excel.

## Tính năng chính

- Đăng nhập theo mã đại diện nhóm học sinh.
- Trang ôn tập kiến thức có hình ảnh, accordion và âm thanh.
- Phần `Hải Trình Kỳ Bí` gồm 4 trạm, mỗi trạm 5 câu, có chấm điểm và khóa/mở theo mã.
- Bài quiz chính gồm 6 câu ngẫu nhiên từ ngân hàng 10 câu, giới hạn 6 phút.
- Hồ sơ nhóm hiển thị điểm quiz, điểm từng trạm và tổng điểm.
- Dashboard giáo viên theo dõi tiến độ làm bài theo thời gian thực và xuất Excel.
- Dữ liệu lưu trên MongoDB qua API routes trong `src/app/api`.

## Công nghệ sử dụng

- Next.js `16.2.1`
- React `19.2.4`
- TypeScript
- Tailwind CSS `v4`
- MongoDB Node Driver
- shadcn/ui, Radix UI, Sonner, Framer Motion
- `xlsx` và `file-saver` để xuất Excel

## Luồng sử dụng

### Học sinh

1. Vào trang chủ và nhập `classId`.
2. Đọc phần ôn tập tại `/review`.
3. Làm 4 trạm tại `/consolidation`.
4. Mở bài quiz bằng mã truy cập `OT123456`.
5. Xem kết quả tại `/profile`.

### Giáo viên

- Mã demo giáo viên: `gv001`
- Sau khi đăng nhập bằng mã này, hệ thống chuyển tới `/bashboard`
- Giáo viên có thể xem bảng điểm và xuất file Excel

## Yêu cầu môi trường

Tạo file `.env.local`:

```env
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB=smart_quiz
```

Ứng dụng sẽ báo lỗi ngay khi khởi động nếu thiếu 2 biến môi trường trên.

## Dữ liệu MongoDB tối thiểu để demo

Ứng dụng không tự tạo dữ liệu mẫu. Để demo được, bạn cần có ít nhất:

### Collection `users`

Ví dụ bản ghi giáo viên:

```json
{
  "classId": "gv001",
  "class": "GV",
  "group": 0,
  "admin": true,
  "ping": 0,
  "updatedAt": { "$date": "2026-01-01T00:00:00.000Z" }
}
```

Ví dụ bản ghi học sinh:

```json
{
  "classId": "hs001",
  "class": "12A1",
  "group": 1,
  "admin": false,
  "ping": 0,
  "score": 0,
  "scoreStep": [-1, -1, -1, -1],
  "continueStep": -1,
  "updatedAt": { "$date": "2026-01-01T00:00:00.000Z" }
}
```

### Collection `codes`

Mỗi trạm cần một mã mở khóa chưa dùng:

```json
[
  { "stationCode": 1, "code": "CODE1", "used": false },
  { "stationCode": 2, "code": "CODE2", "used": false },
  { "stationCode": 3, "code": "CODE3", "used": false },
  { "stationCode": 4, "code": "CODE4", "used": false }
]
```

Lưu ý:

- Mã vào bài quiz chính đang hardcode là `OT123456`.
- Mã mở khóa từng trạm được đọc từ collection `codes`.
- Mã giáo viên demo đã được chuẩn hóa là `gv001`.

## Cài đặt và chạy

```bash
npm install
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Cấu trúc thư mục chính

```text
src/
  app/
    api/
      codes/route.ts
      users/route.ts
    consolidation/page.tsx
    profile/page.tsx
    quiz/page.tsx
    review/page.tsx
    bashboard/page.tsx
    page.tsx
  components/
  context/
  lib/
public/
```

## API hiện có

- `GET /api/users`: lấy toàn bộ người dùng
- `POST /api/users`: thêm người dùng mới
- `PUT /api/users`: cập nhật `ping`, điểm quiz, điểm trạm, trạng thái làm tiếp
- `GET /api/codes`: lấy danh sách mã mở khóa trạm
- `PUT /api/codes`: đánh dấu mã đã dùng

## Ghi chú triển khai

- Dự án dùng App Router trong `src/app`.
- `next.config.ts` đang cho phép dev origin từ `localhost`, `192.168.1.34`, `192.168.1.96`.
- Dashboard giáo viên nằm ở route `/bashboard` theo đúng tên thư mục hiện tại.
