## Procrastination Fingerprint

Dashboard theo dõi “dấu vân tay trì hoãn” (Procrastination Fingerprint): heatmap 24x7, timeline hôm nay, thống kê tuần, top tác nhân gây xao nhãng, hẹn giờ tập trung, xuất dữ liệu. Hỗ trợ 2 nguồn dữ liệu: API backend in-memory hoặc dữ liệu demo.

## 1) Cài đặt & Chạy

Yêu cầu: Node.js >= 18, npm >= 9.

```bash
git clone <YOUR_GIT_URL>
cd Procrastination_Fingerprint
npm install
```

Chạy frontend + backend cùng lúc (khuyến nghị):
```bash
npm run dev:all
```

Hoặc chạy riêng:
```bash
# terminal 1: backend (port 3001)
npm run dev:server

# terminal 2: frontend (port 8080)
npm run dev
```

Build/preview:
```bash
npm run build
npm run preview
```

## 2) Cấu trúc thư mục chính

```
src/                      # Frontend (Vite + React + TS)
  app/                    # AppProviders, AppRoutes
  components/             # UI components & feature blocks
  features/
    dashboard/
      api/                # React Query hooks call API
      hooks/              # Hooks logic (focus timer, data)
      pages/              # DashboardPage
      services/           # export data service
    data-source/          # Chuyển chế độ Demo/API (context)
    settings/             # Settings context/hook
  lib/                    # demo-data generators, utils
  shared/                 # api client, utils/format

server/                   # Backend (Express + TS, in-memory)
  src/
    routes/               # /api/* endpoints
    services/             # logic tính toán thống kê
    store.ts              # bộ nhớ tạm (in-memory)
```

## 3) Nguồn dữ liệu: Demo vs API

- Mặc định chạy ở chế độ API (gọi backend in-memory).
- Có thể gạt về chế độ Demo (dùng data mẫu) tại: Settings & Data → Data Source (Demo/API).
- Ở chế độ Demo, các API ghi (focus start/end, update settings) sẽ no-op an toàn.

## 4) API Backend (in-memory)

- Base URL: `/api` (được proxy từ Vite đến `http://localhost:3001`).

- Endpoints chính:
  - `GET /api/stats/buckets`: heatmap 24x7.
  - `GET /api/stats/timeline/today`: timeline hôm nay.
  - `GET /api/stats/weekly`: thống kê 7 ngày.
  - `GET /api/stats/triggers/top`: top tác nhân xao nhãng.
  - `GET /api/stats/recommendations/next-window`: gợi ý khung giờ tập trung.
  - `GET /api/settings` – `PUT /api/settings`: lấy/cập nhật settings.
  - `POST /api/events`: đẩy event hoạt động (để thống kê cập nhật).
  - `POST /api/focus/start` – `POST /api/focus/end`: đánh dấu phiên tập trung.

Ví dụ nạp dữ liệu nhanh (tuỳ chọn):
```bash
curl -X POST http://localhost:3001/api/events \
  -H "Content-Type: application/json" \
  -d '[{"id":"e1","ts":'$(date +%s%3N)',"domain":"youtube.com","isIdle":false,"kind":"DISTRACTION"}]'
```

## 5) Tính năng chính

- Procrastination Heatmap: matrix 24x7, tooltip chi tiết, legend.
- Today Timeline: phân đoạn focus / active / distraction / idle theo giờ hiện tại.
- Weekly Stats: tổng thời lượng, tỉ lệ, điểm trung bình, streak, worst day.
- Top Triggers: top domain gây xao nhãng, tiến trình, xu hướng.
- Next Best Window: gợi ý giờ tập trung kế tiếp từ dữ liệu.
- Focus Timer: bắt đầu/tạm dừng/dừng; đồng bộ backend khi ở chế độ API.
- Settings & Data:
  - Mục Data Source: gạt giữa Demo/API.
  - Cấu hình distraction domains, chu kỳ capture, mục tiêu học/ngày.
  - Export JSON/CSV dữ liệu hiện có.

## 6) Công nghệ

- Frontend: Vite, React 18, TypeScript, Tailwind CSS, shadcn/ui (Radix UI), React Router, TanStack Query.
- Backend: Express + TypeScript (in-memory store).

## 7) Ghi chú phát triển

- Proxy Vite đã cấu hình sẵn trong `vite.config.ts` (port FE 8080 → BE 3001).
- Lint/format: ESLint + Prettier; TypeScript strict bật mặc định.
- Dữ liệu backend là in-memory; đi kèm service tính toán để dễ thay thế bằng DB (SQLite/Prisma) sau này.

## 8) Scripts

- `npm run dev` – chạy FE.
- `npm run dev:server` – chạy BE.
- `npm run dev:all` – chạy cả FE & BE song song.
- `npm run build` – build FE.
- `npm run preview` – preview FE build.
