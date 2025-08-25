# Kerja Merdeka – AI Agent Pendamping Pelamar Kerja

## 🚀 Overview
**Kerja Merdeka** adalah platform AI Agent yang membantu pencari kerja menyiapkan dokumen lamaran (CV & Cover Letter), simulasi interview, hingga mengirimkan job pack ke email.  
Dibangun dalam rangka **Hackathon IMPHNEN (AI Agent for Kemerdekaan Indonesia)**.

## ✨ Features
- 🔑 **Auth System** – Register/Login dengan JWT.
- 📄 **AI Document Generator** – Membuat **CV & Cover Letter** yang relevan dengan lowongan.
- 🤖 **Mock Interview** – Simulasi interview berbasis LLM.
- 📧 **Job Pack Delivery** – Mengirim CV, Cover Letter (PDF) + summary melalui email (integrasi Mailry).
- 🗂 **Database & Persistence** – Prisma ORM + Supabase.
- 📊 **Error Handling & Logging** – Custom middleware + Winston logger.
- ⚡ **Deployed & Demo Ready** – Railway (backend) + Supabase (database).

## 🌐 Demo
🔗 **Live Demo Backend API**: [Backend Demo](https://kerja-merdeka-be-production.up.railway.app/)

## 📸 Screenshots
- Generate CV & Cover Letter
  <img width="1889" height="944" alt="image" src="https://github.com/user-attachments/assets/4320a34a-ae9d-442a-9942-8443e3f4fd2b" />

- Mock Interview
  <img width="1909" height="940" alt="image" src="https://github.com/user-attachments/assets/0ca00530-66fe-4299-8a2c-b8e9a0b5ebda" />

- Email Job Pack
  <img width="1906" height="941" alt="image" src="https://github.com/user-attachments/assets/20694342-02e5-4b7a-9ba0-0251d7a04d35" />


## 🏗️ Tech Stack
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL (Supabase) + Prisma ORM
- **AI Integration**: Lunos + Unli LLM
- **PDF Generator**: EJS + Puppeteer
- **Email Service**: Mailry API
- **Auth & Security**: JWT + Middleware
- **Deployment**: Railway (backend), Supabase (DB)

## ⚙️ Setup

### 1. Clone & Install
   ```bash
   git clone https://github.com/your-repo/kerja-merdeka-be.git
   cd kerja-merdeka-be
   npm install
   ```
### 2. Environment Variables:
   Buat file .env:
   ```env
   PORT=5000
   LUNOS_API_KEY=replace_with_lunos_api_key
   MAILRY_API_KEY=replace_with_mailty_api_key
   MAILRY_EMAIL_ID=replace_with_mailry_email_id
   UNLI_API_KEY=replace_with_unli_api_key
   JWT_SECRET=your_secret
   JWT_EXPIRES_IN="1h"
   DATABASE_URL="postgresql://user:password@localhost:5432/kerjamerdeka"
   ```
### 3. Prisma:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```
   Prod mode:
   ```bash
   npx prisma generate
   npx prisma migrate deploy
   ```
### 4. Run:
   Dev mode:
   ```bash
   npm run dev
   ```

   Prod mode:
   ```bash
   npm run build
   npm start
   ```

## 🧪 Testing

Jalankan test dengan Jest + Supertest:
```bash
npm run test
```

## 📌 API Endpoints (Highlight)

- **POST /api/auth/register** - Register user
- **POST /api/auth/login** - Login user
- **POST /api/doc** - Generate CV, Cover Letter, Summary
- **POST /api/interview** - Run interview session
- **POST /api/jobpack** - Send job pack via email

## 👥 Team
- Backend: [Muhammad Iqbal Ghozy](https://github.com/qybbs) 
- Frontend: [Muhammad Islakha Khoiruzzaman Tekhno Agri](https://github.com/lakhatekno) 
- UI/UX: [Muhammad Iqbal Ghozy](https://github.com/Tenshi-X) 

