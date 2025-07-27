# 🏨 HKDN Hotel Booking App

## 📖 Table of Contents
1. [About](#about)  
2. [Built With](#built-with)  
3. [Getting Started](#getting-started)  
   - Prerequisites  
   - Installation  
4. [Usage](#usage)   
5. [Contributing](#contributing)  
6. [Contact](#contact)  

---

## About
Ứng dụng đặt phòng khách sạn full-stack được xây dựng với:

- **Next.js 14** + **React** + **TypeScript**
- UI: **TailwindCSS**, **Shadcn/ui**
- Xác thực: **Clerk**
- ORM: **Prisma** + MySQL (Planetscale)
- Quản lý trạng thái: **Zustand**
- Thanh toán: **Stripe**
- Upload hình ảnh: **UploadThing**
- Validation & ngày: **Zod**, **Shadcn DateRangePicker**
- Tính năng: auth, CRUD khách sạn & phòng, đặt/xuất hiện ngày, dark mode, lọc tìm, quản lý booking

---

## Built With
- [Next.js 14](https://nextjs.org/)  
- [React](https://reactjs.org/)  
- [TypeScript](https://www.typescriptlang.org/)  
- [TailwindCSS](https://tailwindcss.com/) + **Shadcn/ui**  
- [Clerk Authentication](https://clerk.com/)  
- [Prisma](https://www.prisma.io/) + MySQL (AivenCloudAivenCloud)  
- [Zustand](https://github.com/pmndrs/zustand)  
- [Stripe](https://stripe.com/)  
- [Zod](https://zod.dev/)  
- [UploadThing](https://uploadthing.com/)  

---

## Getting Started

### Prerequisites
- Node.js >=18  
- pnpm / npm / yarn  
- Tài khoản: PlanetScale, Clerk, Stripe

### Installation
```bash
git clone https://github.com/HuynhNgocXuan/hkdn-hotel-booking-app.git
cd hkdn-hotel-booking-app
pnpm install   # hoặc npm install / yarn install
````

### Thiết lập biến môi trường

Tạo `.env` với nội dung:

```env
DATABASE_URL="mysql://<user>:<pass>@<host>/<db>?sslaccept=strict"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="..."
CLERK_SECRET_KEY="..."
STRIPE_SECRET_KEY="..."
```

### Migrate database

```bash
npm prisma db push
```

### Launch

### Installation
```bash
npm runrun dev
```

---

## Usage

* Thử nghiệm qua các route:

  * `http://localhost:3000/`
  * `/hotels`, `/my-bookings`, `/my-hotels`
* Các thao tác: đăng ký/đăng nhập (Clerk), CRUD khách sạn/phòng, tìm kiếm, chọn ngày, tạo booking & thanh toán Stripe, quản lý lịch sử
---

## Contributing

1. Fork → Tạo issue/feature
2. Tạo PR đến nhánh `main`
3. Tuân thủ code style (eslint/prettier)
4. Thêm test / update docs nếu cần

---

## Contact

**Huynh Ngoc Xuan**

* GitHub: [https://github.com/HuynhNgocXuan](https://github.com/HuynhNgocXuan)
* Demo: [https://hkdn-hotel-booking-app.vercel.app](https://hkdn-hotel-booking-app.vercel.app)
---

git clone https://github.com/HuynhNgocXuan/hkdn-hotel-booking-app.git
cd hkdn-hotel-booking-app
pnpm install   # hoặc npm install / yarn install
````

### Thiết lập biến môi trường

Tạo `.env` với nội dung:

```env
DATABASE_URL="mysql://<user>:<pass>@<host>/<db>?sslaccept=strict"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="..."
CLERK_SECRET_KEY="..."
STRIPE_SECRET_KEY="..."
```

### Migrate database

```bash
npm prisma db push
```

### Launch

```bash
npm runrun dev
```

---

## Usage

* Thử nghiệm qua các route:

  * `http://localhost:3000/`
  * `/hotels`, `/my-bookings`, `/my-hotels`
* Các thao tác: đăng ký/đăng nhập (Clerk), CRUD khách sạn/phòng, tìm kiếm, chọn ngày, tạo booking & thanh toán Stripe, quản lý lịch sử
---

## Contributing

1. Fork → Tạo issue/feature
2. Tạo PR đến nhánh `main`
3. Tuân thủ code style (eslint/prettier)
4. Thêm test / update docs nếu cần

---

## Contact

**Huynh Ngoc Xuan**

* GitHub: [https://github.com/HuynhNgocXuan](https://github.com/HuynhNgocXuan)
* Demo: [https://hkdn-hotel-booking-app.vercel.app](https://hkdn-hotel-booking-app.vercel.app)
---

