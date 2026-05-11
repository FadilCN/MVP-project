# Codable AI Code Editor

A full-stack AI-enabled coding workspace with user authentication, project and file management, live code editing, code execution, and an integrated AI chat assistant.

## 🚀 Project Overview

This repository contains two main parts:

- `backend/` — Express.js API server with MongoDB storage and AI/chat support.
- `frontend/my-app/` — React + Vite application with Tailwind CSS and Monaco Editor.

The app is designed as a developer workspace where users can:

- Sign up, sign in, and manage authentication with JWT.
- Create and manage coding projects.
- Add, edit, and delete files inside a project.
- Run code files from the browser.
- Interact with an AI assistant to analyze or enhance code.

## ✨ Key Features

- **User authentication**
  - Sign up and login with email/password.
  - JWT-based token authentication.
  - Logout with token blacklisting.

- **Project management**
  - Create new projects for Python, JavaScript, or web development.
  - Browse recent projects.
  - Delete projects.

- **File editor**
  - Create and remove files inside a project.
  - Monaco-based code editor for a rich editing experience.
  - Save file changes back to the server.

- **Code execution**
  - Run a selected code file from the editor.
  - Supports `js` and `py` files.
  - Displays output in an integrated terminal pane.

- **AI chat assistant**
  - Use chat messages to interact with AI.
  - Send the current file code and message to backend LLM route.
  - Stream AI responses into the chat interface.

## 🧱 Repository Structure

- `backend/`
  - `app.js` — Express app configuration and CORS setup.
  - `server.js` — Server startup and MongoDB connection.
  - `routes/` — API route definitions for users, projects, files, chat, LLM, and code execution.
  - `controllers/` — Business logic for each route.
  - `models/` — Mongoose schemas for users, projects, files, chats, and token blacklist.
  - `middleware/authMiddleware.js` — JWT verification and blacklist checks.
  - `agent/` — AI/LLM integration logic.

- `frontend/my-app/`
  - `src/App.jsx` — Main route definitions.
  - `src/pages/` — SignIn, SignUp, DashBoard, CodeEditor.
  - `src/ui/elements/components/` — Dashboard layout, project list, file browser, editor, AI chat.

## 🛠️ Technologies Used

- Backend
  - Node.js
  - Express
  - MongoDB / Mongoose
  - JSON Web Tokens (JWT)
  - bcrypt for password hashing
  - LangChain / Ollama integration

- Frontend
  - React
  - Vite
  - Tailwind CSS
  - Monaco Editor (`@monaco-editor/react`)
  - Axios
  - React Router DOM
  - js-cookie

## 💻 Supported OS / Environment

The project is cross-platform in design and should work on:

- Windows
- macOS
- Linux

However, note that the backend code execution route currently writes temporary files to `/tmp`, which is a Unix-style path. On Windows, you may need to update `/backend/routes/runRoutes.js` to use a Windows-friendly temporary folder or a cross-platform path utility.

## ⚙️ Local Setup

### 1. Backend

1. Open a terminal in `backend/`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with at least:
   ```env
   PORT=3000
   MONGODB_URI=<your-mongo-connection-string>
   JWT_KEY=<your-secret-key>
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```

### 2. Frontend

1. Open a terminal in `frontend/my-app/`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend app:
   ```bash
   npm run dev
   ```
4. Open the browser at the local Vite URL (usually `http://localhost:5173`).

## 🔌 API Endpoints

### User
- `POST /users/signup` — register a new user.
- `POST /users/login` — login and receive JWT token.
- `POST /users/logout` — blacklist JWT token.
- `GET /users/projects` — list authenticated user projects.

### Projects
- `POST /projects/create` — create a project.
- `GET /projects/` — list projects.
- `GET /projects/:id` — get project details.
- `PUT /projects/:id` — update project.
- `DELETE /projects/:id` — delete project.

### Files
- `POST /files/create` — create a file in a project.
- `GET /files/project/:projectId` — list project files.
- `GET /files/:id` — get single file.
- `PUT /files/:id` — update file content.
- `DELETE /files/:id` — delete a file.

### Chat
- `POST /chats/create` — create a chat session for a project.
- `GET /chats/:projectId` — fetch chat history.
- `PUT /chats/:projectId` — append a chat message.

### LLM
- `POST /llm/response` — send user code + prompt to AI model.

### Run
- `POST /code/run` — execute a file from the editor and return stdout/stderr.

## 📌 Notes

- The frontend stores `token`, `userId`, `projectId`, and `projectName` in browser cookies/localStorage.
- The current run logic supports `js` and `py` file execution.
- AI chat uses streamed backend responses to update the UI in real time.

## 🧩 Recommended Improvements

- Add validation and error display for login/signup forms.
- Use a cross-platform temporary directory for code execution.
- Add proper route protection and redirects for unauthenticated users.
- Support more file languages and more advanced editor settings.
- Improve project sharing and collaboration.

## 🙌 Summary

This project is a developer workspace combining:

- authentication,
- project/file management,
- live code editing,
- code execution, and
- AI-powered chat assistance.

It is a strong base for building a modern AI-enabled IDE-like web app.
