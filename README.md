# Todo List App 📝

A modern, full-stack Todo List application built with **Next.js**, **TypeScript**, and **Supabase**.  
Manage tasks efficiently with user-based assignment, filtering, and real-time updates.

---

## Demo

> Add your hosted demo URL here (if applicable)

---

## Table of Contents

- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Getting Started](#getting-started)  
- [Environment Variables](#environment-variables)  
- [Database Schema](#database-schema)  
- [Folder Structure](#folder-structure)  
- [Scripts](#scripts)  
- [Contributing](#contributing)  
- [License](#license)  

---

## Features ✨

- **Add, update, delete tasks** with ease  
- **Filter tasks** by:
  - Assigned to me  
  - Created by me  
  - Overdue  
  - Due today  
  - All tasks  
- Mark tasks as **complete/incomplete**  
- User authentication with **Supabase Auth**  
- Real-time syncing of tasks  
- Responsive UI with **Tailwind CSS**

---

## Tech Stack 🛠️

- **Next.js** — React framework for production  
- **TypeScript** — Static type checking  
- **Supabase** — Backend as a Service (PostgreSQL + Auth)  
- **Tailwind CSS** — Utility-first CSS framework  
- **Vercel** (optional) — Deployment platform  

---

## Getting Started 🚀

Follow these steps to run the project locally.

### Prerequisites

- Node.js (v16 or newer recommended)  
- npm or yarn  
- Supabase account with a project setup  

### Clone repository

```bash
git clone https://github.com/seenu-21/Todo-List.git
cd Todo-List
Install dependencies
bash
Copy
Edit
npm install
# or
yarn install
Setup Environment Variables
Create a .env.local file in the root directory and add:

env
Copy
Edit
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
Note: Keep your environment variables secure. Do not commit .env.local to version control.

Run the development server
bash
Copy
Edit
npm run dev
# or
yarn dev
Open http://localhost:3000 in your browser.

Database Schema 📊
The project uses Supabase's PostgreSQL database with the following tables and columns:

tasks
Column	Type	Description
id	string	Primary key (UUID)
title	string	Task title
description	string | null	Optional detailed description
due_date	string | null	Due date in YYYY-MM-DD format
assigned_to	string	User ID the task is assigned to
created_by	string	User ID who created the task
is_complete	boolean	Completion status
created_at	string	Timestamp of task creation

users
Column	Type	Description
id	string	User ID (UUID)
email	string	User email

task_notifications
Column	Type	Description
id	string	Notification ID (UUID)
user_id	string	User ID who receives the notification
task_id	string	Related task ID
message	string	Notification message
created_at	string	Timestamp of notification creation

Folder Structure 🗂️
plaintext
Copy
Edit
/
├── components/         # React components (TodoList, TodoItem, etc.)
├── lib/                # Supabase client and API functions (actions.ts, initSupabase.ts)
├── pages/              # Next.js pages (index.tsx, _app.tsx, etc.)
├── public/             # Static assets
├── styles/             # CSS or Tailwind config files
├── types/              # TypeScript type definitions (Task, FilterType, Database schema)
├── .env.local          # Environment variables (not committed)
├── next.config.js      # Next.js configuration
├── package.json        # Project dependencies and scripts
└── README.md           # This file
Available Scripts 📜
In the project directory, you can run:

Command	Description
npm run dev	Runs the app in development mode
npm run build	Builds the app for production
npm run start	Runs the built app
npm run lint	Runs ESLint to check code quality

Contributing 🤝
Contributions are welcome! Please:

Fork the repo

Create a new branch (git checkout -b feature/your-feature)

Commit your changes (git commit -m 'Add some feature')

Push to the branch (git push origin feature/your-feature)

Open a pull request

License 📝
This project is licensed under the MIT License.

Contact
For any questions or environment variable sharing, contact:

Srinivas Mangali
Email: your.email@example.com
GitHub: https://github.com/seenu-21

Thank you for using this Todo List app!
