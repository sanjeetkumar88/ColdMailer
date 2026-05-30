# MailFlow - Automated Cold Outreach Platform 🚀

[![CI/CD Pipeline](https://github.com/sanjeetkumar88/ColdMailer/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/sanjeetkumar88/ColdMailer/actions/workflows/ci-cd.yml)

**🌐 Live Demo:** [https://coldmailer.me](https://coldmailer.me)

MailFlow is a highly scalable, full-stack cold email automation platform designed to help users launch, track, and manage personalized email campaigns at scale. Built with enterprise-grade architecture, it features intelligent staggering to bypass spam filters, dynamic list targeting, and real-time analytics.

## 🎯 Project Highlights for Recruiters
This application demonstrates a deep understanding of complex backend processing, message brokering, caching, and modern frontend frameworks. 

**Key Technical Achievements:**
- **Background Worker Architecture:** Offloads heavy email-sending tasks to isolated Node.js worker processes via **BullMQ** and **Redis**, preventing API bottlenecks.
- **Human-like Sending Algorithms:** Implements randomized staggered delays (30s - 90s) per email to ensure high deliverability and avoid provider spam flags.
- **Dynamic Template Hydration:** Merges complex HTML templates with contact-specific metadata seamlessly at the exact moment of execution using isolated list scoping.
- **Full-Stack Type Safety:** Uses strict TypeScript across both the Next.js frontend and Node.js backend.
- **Automated CI/CD:** Fully automated testing, building, and deployments via GitHub Actions to Vercel and Render.

---

## 📸 Screenshots

*(Replace the links below with actual screenshots of the application)*

### Dashboard Overview
![Dashboard Overview](./screenshots/dashboard.png)
*Real-time analytics showing campaign progress, open rates, and bounces.*

### Campaign Builder
![Campaign Builder](./screenshots/campaign.png)
*The campaign composer with dynamic rich text, template selection, and list targeting.*

### CSV Contact Import
![Contact Import](./screenshots/contacts.png)
*Bulk upload utility mapping custom CSV columns to database contact fields.*

---

## 🛠 Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **State Management:** React Context API + SWR
- **Authentication:** NextAuth.js

### Backend
- **Core:** Node.js, Express.js
- **API:** GraphQL & REST hybrid architecture
- **Database:** MongoDB (Mongoose)
- **Caching & Queues:** Redis, BullMQ (Message Brokering)
- **Deployment:** Docker, PM2 (Process Manager), Render
- **CI/CD:** GitHub Actions

---

## 🚀 Features
1. **Dynamic Templating**: Write emails using variables like `{{name}}` or `{{organization}}` which automatically hydrate based on target Contact Lists.
2. **Background Queues**: Robust queuing system that can handle thousands of emails, automatically pausing and retrying on failure.
3. **Multiple Senders**: Connect any custom SMTP provider (Gmail, Outlook, custom domains) with AES encryption for secure credential storage.
4. **CSV Bulk Import**: Intelligently map and bulk-upload thousands of contacts at once.
5. **Real-time Analytics**: Pixel-tracking technology injected into templates to register exact open-rates instantly.

---

## 💻 Running Locally

### Prerequisites
- Node.js (v20+)
- MongoDB connection string
- Redis Server running on `localhost:6379`

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sanjeetkumar88/ColdMailer.git
   cd ColdMailer
   ```

2. **Setup the Backend**
   ```bash
   cd backend
   npm install
   # Create a .env file based on .env.example
   npm run dev
   ```

3. **Setup the Background Worker** (In a new terminal)
   ```bash
   cd backend
   npm run worker:dev
   ```

4. **Setup the Frontend**
   ```bash
   cd frontend
   npm install
   # Create a .env file based on .env.example
   npm run dev
   ```

5. **Visit the app**
   Navigate to `http://localhost:3000`

---

## 📜 License
This project is licensed under the MIT License.
