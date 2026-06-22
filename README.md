# SkillLanka - Freelancer Marketplace

SkillLanka is a modern freelancer marketplace web application built with a PHP backend and a Next.js (React) frontend, using Prisma as the ORM.

---

## 🚀 Getting Started

Follow these steps to set up and run the project locally on your machine.

### 1. Clone the Repository
Clone the project from GitHub and navigate to the project directory:
```bash
git clone <your-repository-url>
cd FreeLancer
```

---

### 2. Database & PHP Backend Setup

#### A. Start MySQL
Ensure your MySQL server is running (e.g., via XAMPP, WAMP, Laragon, or standalone MySQL).

#### B. Configure Environment Variables
Create a `.env` file inside the `backend/` folder:
```bash
# Path: backend/.env
DATABASE_URL="mysql://root:@localhost:3306/freelancer_db"
```
*(If your MySQL database has a password, change it to: `mysql://root:your_password@localhost:3306/freelancer_db`)*

#### C. Run Database Setup Script
Run the PHP script to automatically create the `freelancer_db` database, generate tables, and seed the default admin account:
```bash
cd backend
C:\xampp\php\php.exe setup-db.php
```
*(Or simply `php setup-db.php` if PHP is configured in your system variables)*

#### D. Start the Backend Server
Run the built-in PHP development server on port `8000` (must run from the `backend/` directory):
```bash
C:\xampp\php\php.exe -S localhost:8000
```
*(Or simply `php -S localhost:8000`)*

---

### 3. Frontend Next.js Setup

#### A. Configure Environment Variables
Create a `.env` file inside the `frontend/` folder:
```bash
# Path: frontend/.env
DATABASE_URL="mysql://root:@localhost:3306/freelancer_db"
```

#### B. Install Dependencies & Start Server
Open a **new terminal window**, navigate to the `frontend/` folder, install the packages, and start the development server:
```bash
cd frontend
npm install
npm run dev
```

Now, open [http://localhost:3000](http://localhost:3000) in your browser to view the application!

---

## 🛠️ Tech Stack
* **Frontend**: Next.js 16 (React 19), TailwindCSS
* **Backend**: PHP (REST API)
* **Database**: MySQL, Prisma ORM

---

## 📄 License
This project is proprietary and closed-source. All rights are reserved. See the [LICENSE](file:///d:/company_Dearo/FreeLancer/LICENSE) file for more details.

