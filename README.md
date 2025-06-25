# 📘 Document-Based Generator

🚀 [Live Demo](https://quizapp-zeta-black.vercel.app/)  
🔧 Tech Stack: **React**, **Node.js**, **Express**, **MongoDB**

A full-stack web application that allows users to **upload documents**, **generate quizzes automatically**, and **track learning progress** through a personalized dashboard. This platform empowers users to study smarter, not harder — leveraging AI to turn documents into interactive learning tools.

---

## 🧠 Features

### 📄 Document Upload & Quiz Generation
- Upload documents (PDF, DOCX, etc.) directly via the interface
- AI-based automatic quiz generation from document content
- Supports various file types for flexible usage

### 📊 Progress Tracking Dashboard
- Personalized user dashboard showing:
  - Quiz history
  - Number of attempts
  - Time spent on quizzes
  - Scores and performance trends

### 🔐 Secure User Authentication
- Passwords secured using **bcrypt** hashing
- Session management via **JWT bearer tokens**
- Ensures data privacy and security

### 📜 Quiz Review System
- View previously attempted quizzes
- Get correct answers alongside your selected choices
- Helps in post-assessment learning and revision

### 💬 AI Chat Integration
- Ask context-specific questions based on uploaded documents
- Get AI-generated answers and explanations to deepen understanding

### ☁️ Deployment
- **Frontend:** Hosted on [Vercel](https://vercel.com/)
- **Backend:** Hosted on [Render](https://render.com/)
- Fully optimized for responsiveness and fast load times

---

## 🛠️ Technologies Used

| Frontend        | Backend        | Database | Authentication & Security | Deployment              |
|-----------------|----------------|----------|----------------------------|--------------------------|
| React.js        | Node.js        | MongoDB  | bcrypt, JWT                | Vercel (Frontend)<br>Render (Backend) |

---

## 📁 Getting Started (Local Setup)

### 🔧 Prerequisites
- Node.js (v16+)
- MongoDB (local or cloud)
- npm or yarn

### 📦 Installation

```bash
git clone https://github.com/DEEN-42/QuizApp-frontend.git
cd QuizApp-frontend
