# 🧾 Buana CMS

**Buana CMS** is a web application designed to help **sales teams** efficiently manage customers, orders, and sales activities.  
The app is built with **Remix (frontend)** and **NestJS (backend)** using a modular and secure architecture.

---

## 🚀 Key Features

- 🔐 **Secure Authentication** — Login and register using JWT tokens and cookies.  
- 📦 **Sales Order Management** — View order lists, details, and status.  
- 👥 **Customer Management** — Add, edit, and delete customer data.  
- 💼 **Product Management** — CRUD operations for products.  
- 📊 **Dashboard Overview** — Quick access to sales insights.  
- 🧾 **Activity Logs** — Track user activities and updates.  
- 💬 **Real-time Feedback** — Toast notifications for success or error events.  

---

## 🛠️ Tech Stack

### Frontend
- [Remix](https://remix.run/) — Fullstack React framework  
- [TypeScript](https://www.typescriptlang.org/)  
- [Tailwind CSS](https://tailwindcss.com/)  
- [shadcn/ui](https://ui.shadcn.com/) — Modern UI components  
- [Axios](https://axios-http.com/) — HTTP client  
- [React Hook Form](https://react-hook-form.com/)  
- [Sonner](https://sonner.emilkowal.ski) — Toast notifications  

### Backend
- [Go](https://go.dev/) — Fast, reliable programming language  
- [Fiber](https://gofiber.io/) — Web framework inspired by Express.js  
- [GORM](https://gorm.io/) — ORM for Go  
- [PostgreSQL](https://www.postgresql.org/) — Relational database  
- [JWT Authentication](https://jwt.io/) — Token-based security  

---

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/alpharii/buana-cms.git
cd buana-cms
```

### 2. Backend Setup
Navigate to the backend directory:
```bash
cd backend
go mod tidy
cp .env.example .env
```

Fill in your environment variables in .env, e.g:
```bash
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=db_name
DB_PORT=5432
PORT=3000
JWT_SECRET=secret
```

### 3. Frontend Setup
Navigate to the frontend directory:
```bash
cd ../frontend
npm install
cp .env.example .env
```

Edit `.env` file to point API to your backend URL:
```bash
VITE_API_URL=http://localhost:3000/api
```

Then start the development server:
```bash
npm run dev
```

Frontend will be available at:  
**http://localhost:5173**

---

## 🤝 How to Contribute

Contributions are welcome! Follow these steps to contribute:

1. **Fork** this repository.  
2. Create a new branch:
```bash
git checkout -b feature/your-feature-name
```
3. Make your changes or improvements.  
4. Ensure code passes lint and tests:
```bash
npm run lint
npm run test
```
5. Commit your changes:
```bash
git commit -m "Add new feature: ..."
```
6. Push your branch:
```bash
git push origin feature/your-feature-name
```
7. Open a **Pull Request** to the `main` branch with a brief description.

---

## 📁 Folder Structure (Frontend)

```
frontend/
├── app/
│   ├─ routes/
│    ├─ __preauth+/
│    │   └─ login.tsx        # Public login page
│    ├─ __postauth+/         # Authenticated/protected routes
│    │   └─ dashboard.tsx    # Example authenticated page  
│    ├─ __preauth.tsx        # Main layout after login
│    ├─ __postauth.tsx       # Main layout before login
│    └─ index.tsx            # Redirect to login or dashboard
│   ├── components/           # Reusable UI components
│   ├── lib/                  # Axios client & helpers
│   ├── styles/               # Tailwind CSS files
│   └── root.tsx              # Main Remix entry point
├── public/                   # Public assets
└── package.json
```

---


## 🌟 Support

If you find this project helpful:
- ⭐ Star this repository  
- 🧩 Share it with other developers  
- 💡 Contribute via pull requests  

---

**Buana CMS** — “Empowering sales productivity through efficient systems.”
