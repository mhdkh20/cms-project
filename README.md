📰 CMS Platform (Laravel + React)

A full-stack Content Management System (CMS) built with Laravel (Backend API) and React + TypeScript (Admin & Public Frontend).
The system supports articles, categories, comments moderation, contact messages, and an admin dashboard.

🚀 Features
🔐 Admin Panel

Admin authentication (JWT / token based)

Dashboard overview (articles, categories, comments, messages)

Articles management

Create / Edit / Delete articles

Upload article images

Publish / Draft status

Assign multiple categories

Pagination & search

Categories management

Comments moderation (approve / delete)

Contact messages review

🌍 Public Website

Browse articles

Filter articles by category

View article details

Related articles

Submit comments (pending approval)

Contact form

🛠 Tech Stack
Backend

Laravel 10+

RESTful API

MySQL

Eloquent ORM

Services & Controllers architecture

Database Migrations & Seeders

Frontend

React 18

TypeScript

Tailwind CSS

React Router

Axios / Fetch API

React Select

Lucide Icons

📂 Project Structure
CMS/
│
├── backend/          # Laravel API
│   ├── app/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── routes/
│   └── .env.example
│
├── frontend/         # React Admin & Public UI
│   ├── src/
│   ├── public/
│   └── .env.example
│
└── README.md

⚙️ Setup Instructions
1️⃣ Clone Repository
git clone https://github.com/YOUR_USERNAME/cms-project.git
cd cms-project

🔧 Backend Setup (Laravel)
cd backend
composer install

Create .env file
cp .env.example .env

Configure database in .env
DB_DATABASE=cms
DB_USERNAME=root
DB_PASSWORD=

Generate app key
php artisan key:generate

Run migrations & seeders
php artisan migrate --seed

Storage link (for images)
php artisan storage:link

Start backend server
php artisan serve


Backend API will run at:

http://localhost:8000/api

🎨 Frontend Setup (React)
cd frontend
npm install

Create .env
cp .env.example .env

Start frontend
npm run dev


Frontend will run at:

http://localhost:5173

🔑 Admin Login Credentials (Seeded)

Use these credentials for testing:

Email: admin@example.com
Password: password

🧪 Testing Data

Seeders include:

Admin user

Sample categories

Sample articles

Sample comments

Contact messages

You can re-seed anytime:

php artisan migrate:fresh --seed

📡 API Endpoints (Examples)
Method	Endpoint	Description
GET	/api/admin/dashboard	Dashboard statistics
GET	/api/admin/articles	List articles
POST	/api/admin/articles	Create article
PATCH	/api/admin/articles/{id}/toggle-publish	Toggle publish
GET	/api/categories/{slug}/articles	Articles by category
📸 Image Upload

Article images are uploaded using multipart/form-data

Stored in storage/app/public/articles

Accessible via:

/storage/articles/filename.jpg

🧼 Code Quality

Clean separation of concerns

Service-based backend architecture

Strong TypeScript typing

Reusable React components

Consistent naming conventions

📦 Deliverables Checklist

✔️ GitHub repository
✔️ Database migrations
✔️ Seeders for testing
✔️ README with setup instructions
✔️ Clean & organized commits
✔️ Working admin & public UI

👨‍💻 Author

Mohammad Alkhatib (mhdkh20)
GitHub: https://github.com/mhdkh20

📝 License

This project is provided for evaluation and educational purposes.