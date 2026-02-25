📚 BookMe: Digital Library & Rental Management System
A high-performance, full-stack web application designed to streamline the process of book management and rentals. Built with a focus on type-safety, scalable state management, and real-world payment integration.

🚀 Core Features
User Authentication: Secure JWT-based authentication with role-based access control (Admin/User).

Book Management: Complete CRUD functionality for managing a digital catalog, including real-time availability tracking.

Rental Workflow: Integrated logic for booking, tracking rental duration, and automated status updates.

Cloud Image Handling: Seamless image uploads and optimization via Cloudinary.

Payment Integration: Ready for real-world transactions with Chapa payment gateway.

Responsive UI: A modern, mobile-first design built for a smooth user experience across all devices.

🛠️ Tech Stack
Layer,Technology
Frontend,"React, Tailwind CSS, Zustand (State Management)"
Backend,"Node.js, Express.js"
Database,PostgreSQL
ORM,Prisma v7
Storage,Cloudinary (Images)
Payments,Chapa API

🏗️ Architecture
The application follows a modular architecture to ensure maintainability:

Prisma ORM: Utilized for type-safe database queries and automated migrations.

Zustand: Implemented for lightweight, decoupled state management, replacing complex Redux boilerplate.

RESTful API: A clean API structure handling everything from authentication to transactional rental logic.

⚙️ Installation & Setup
Clone the repo: git clone https://github.com/your-username/bookme.git

Install dependencies: npm install (in both /client and /server)

Database Setup: * Create a local PostgreSQL database.

Configure your .env with DATABASE_URL.

Run npx prisma db push and npx prisma db seed.

Run Development Server: npm run dev
