# Bailanysta

A lightweight application built with a FastAPI backend and a React frontend. This repository contains two separate folders:

- back/: FastAPI-based RESTful API with user registration, login, post creation, likes, and AI-powered post generation.
- front/: React single-page application for user interaction, styled with a custom design system and dark/light theming.

---

## 🚀 Quick Start

### Prerequisites

- Python 3.10+ (for backend)
- Node.js 16+ & npm or Yarn (for frontend)
- A Hugging Face API token set in your environment (`HF_API_TOKEN`)

### 1. Clone the Repository

git clone git@github.com:yersnn/bailanysta.git
cd bailanysta

### 2. Backend Setup (in `back/`)

cd back
python -m venv .venv
source .venv/bin/activate       # Linux/macOS
.venv\Scripts\activate.bat     # Windows

pip install -r requirements.txt
export HF_API_TOKEN=hf_your_token_here   # macOS/Linux
set HF_API_TOKEN=hf_your_token_here      # Windows

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

The API will be available at http://localhost:8000.

### 3. Frontend Setup (in `front/`)

cd front
npm install      # or yarn install

# Set API URL for React
# Create .env in front/ with:
# REACT_APP_API_URL=http://localhost:8000

npm start        # or yarn start

The React app runs at http://localhost:3000 by default.

---

## 🛠 Design & Development Process

1. Requirement Analysis: Defined core features—user auth, post CRUD, likes, AI generation.  
2. API Design: Modeled User, Post, and PostLike entities in SQLAlchemy. Used Pydantic for validation.  
3. Frontend Architecture: Adopted React Router for navigation and utility-first CSS with custom variables.  
4. Incremental Development: Built backend endpoints first, then wired up frontend pages.  
5. Testing: Manual testing via Postman and the browser. Ensured CORS and error handling.

---

## 💡 Unique Approaches & Methodologies

- Modular Monorepo: Clear separation with back/ and front/.  
- Design System: Centralized CSS variables for themes, buttons, cards, and forms.  
- AI Integration: Hugging Face Inference API for dynamic post suggestions via a modal.  
- Idempotent Likes: Ensured one like per user-post via a join table and unique constraint.

---

## ⚖️ Tradeoffs & Compromises

- Authentication: Simple username/password JSON approach without encryption instead of OAuth/JWT—faster dev, not production-ready.  
- State Management: Relied on React Context and local state, avoiding complex libraries.  
- Error Handling: Basic try/catch with console logging; could be improved with global error boundaries or toasts.  
- Database: Chose SQLite for simplicity; consider PostgreSQL/MySQL for scale.

---

## 🐞 Known Issues & Limitations

- No Pagination: Loading many posts may slow the UI.  
- No Password Hashing: Credentials in plaintext; must add bcrypt or similar.  
- No Robust Auth: Lacks sessions, token expiry, RBAC.  
- AI Modal: Blocks UI during generation; consider streaming or better loading indicators.

---

## 🎯 Why This Tech Stack?

- FastAPI: High-performance Python framework with async, auto-docs, Pydantic.  
- SQLite & SQLAlchemy: Zero-ops database and powerful ORM for prototypes.  
- React: Component-based UI with rich ecosystem and React Router.  
- Hugging Face: Easy access to language models via a free inference API.
