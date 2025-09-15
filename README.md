[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/YHSq4TPZ)
# Focus Flow Finder – Preliminary Assignment Submission
⚠️ Please complete all sections marked with the ✍️ icon — these are required for your submission.

👀 Please Check ASSIGNMENT.md file in this repository for assignment requirements.

## 🚀 Project Setup & Usage
**How to install and run your project:**  
✍️  
- Node.js >= 18, npm >= 9
- Clone repo và cài đặt phụ thuộc

```bash
git clone <YOUR_GIT_URL>
cd Procrastination_Fingerprint
npm install
npm run dev
```

Tùy chọn:
- Build production: `npm run build`
- Preview sau build: `npm run preview`

## 🔗 Deployed Web URL or APK file
✍️ Chưa triển khai. Có thể deploy lên Vercel/Netlify bất kỳ lúc nào.

## 🎥 Demo Video
**Demo video link (≤ 2 minutes):**  
📌 **Video Upload Guideline:** when uploading your demo video to YouTube, please set the visibility to **Unlisted**.  
- “Unlisted” videos can only be viewed by users who have the link.  
- The video will not appear in search results or on your channel.  
- Share the link in your README so mentors can access it.

✍️ (Sẽ bổ sung link video demo khi có)

## 💻 Project Introduction

### a. Overview

✍️ Focus Flow Finder là dashboard giúp sinh viên theo dõi “dấu vân tay trì hoãn” (Procrastination Fingerprint) theo giờ và ngày, phát hiện tác nhân gây xao nhãng, đề xuất khung giờ tập trung tốt nhất và cung cấp công cụ hẹn giờ tập trung.

### b. Key Features & Function Manual

✍️ Tính năng chính và cách dùng:
- Procrastination Fingerprint (Heatmap 24x7): hiển thị ma trận 24 hàng (giờ) x 7 cột (thứ) với mức độ trì hoãn; di chuột để xem tooltip chi tiết theo ô.
- Focus Timer: bắt đầu/kết thúc phiên tập trung; nhận thông báo thành công.
- Today Timeline: dòng thời gian hoạt động hôm nay (focus/active/distraction/idle) theo từng phân đoạn.
- Weekly Stats: thống kê tổng thời gian online, focus, distraction, idle và điểm trung bình theo ngày.
- Top Triggers: top website gây xao nhãng theo phút và xu hướng.
- Next Best Window: đề xuất khung giờ tiếp theo phù hợp để tập trung kèm độ tin cậy và lý do.
- Settings Panel: cấu hình domain gây xao nhãng, chu kỳ thu thập, mục tiêu học mỗi ngày; hỗ trợ xuất dữ liệu JSON/CSV.

### c. Unique Features (What’s special about this app?) 

✍️
- Trực quan “dấu vân tay trì hoãn” dạng heatmap 24x7, đảo trục theo chuẩn phân tích (giờ=rows, ngày=columns).
- Dự kiến tích hợp Chrome Extension để thu thập dữ liệu cục bộ, ưu tiên quyền riêng tư (privacy-first).
- Gợi ý khung giờ tập trung dựa trên lịch sử (MVP mô phỏng, dễ mở rộng ML).
- UI hiện đại với shadcn/ui + Tailwind và tooltip chi tiết ở từng ô.

### d. Technology Stack and Implementation Methods

✍️ Stack chính:
- Vite + React 18 + TypeScript
- Tailwind CSS + shadcn/ui (Radix UI)
- React Router, TanStack Query
- Recharts cho biểu đồ

Phương pháp triển khai nổi bật:
- Component hóa: `ProcrastinationDashboard` điều phối dữ liệu và bố cục; các khối tính năng là component độc lập.
- Heatmap: `ProcrastinationHeatmap` render ma trận 24x7 với màu/độ mờ dựa trên score, tooltip hiển thị chi tiết bucket.
- Dữ liệu demo: tạo từ `src/lib/demo-data.ts`, định nghĩa kiểu dữ liệu tại `src/types/index.ts`.
- Xuất dữ liệu: JSON/CSV từ UI (tải xuống trực tiếp trình duyệt).

### e. Service Architecture & Database structure (when used)

✍️ Kiến trúc hiện tại:
- Ứng dụng SPA front-end thuần, chưa có backend; dữ liệu mô phỏng sinh ngẫu nhiên để minh họa.
- Dự kiến: Chrome Extension thu thập domain/tab switch/idle theo chu kỳ và đồng bộ cục bộ; có thể mở rộng đồng bộ đám mây tuỳ chọn.
- Không dùng CSDL trong MVP; cấu trúc dữ liệu chính: `FingerprintBucket`, `TimelineSegment`, `DayStats`, `Settings`.

## 🧠 Reflection

### a. If you had more time, what would you expand?

✍️
- Xây Chrome Extension thực: thu thập sự kiện, đồng bộ an toàn, dashboard realtime.
- Mô hình gợi ý khung giờ tập trung cá nhân hoá (học từ lịch sử, theo mùa vụ thi/cuối kỳ).
- Lưu trữ bền vững (IndexedDB/SQLite/Cloud) và multi-device sync.
- Bộ lọc nâng cao, phân tích theo môn học/khoá học, goal tracking và thông báo nhẹ nhàng.
- Ứng dụng di động hoặc PWA với offline-first.

### b. If you integrate AI APIs more for your app, what would you do?

✍️
- Tóm tắt thói quen xao nhãng theo tuần/tháng, gợi ý tinh chỉnh lịch học cá nhân.
- Chat assistant trả lời về các “điểm mù” năng suất và đề xuất chiến lược Pomodoro phù hợp.
- Phát hiện bất thường (spikes) và root-cause analysis theo domain/khung giờ.
- Dự báo rủi ro xao nhãng tiếp theo và nhắc nhở chủ động nhưng không xâm lấn.

## ✅ Checklist
- [x] Code runs without errors  
- [x] Core features implemented (heatmap, timer, timeline, stats, export)  
- [x] All ✍️ sections are filled  
