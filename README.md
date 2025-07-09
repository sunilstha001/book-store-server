# book-store-server
Node.js + Express backend for BookNest – A RESTful API handling user authentication, book management, and protected routes with JWT and cookies.


# 📚 BookNest Server

This is the backend server for **BookNest**, a book rental and e-commerce platform. It provides RESTful APIs built with **Node.js**, **Express**, and **MongoDB** for user authentication, book listings, and protected access using **JWT authentication with cookies**.

---

## 🚀 Features

- User registration & login with secure password hashing
- JWT-based authentication (stored in HTTP-only cookies)
- Role-based access control (admin/user)
- Protected routes using middleware
- Book details fetch & dynamic routing
- CORS and cookie-based session management

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express
- **Database:** MongoDB, Mongoose
- **Authentication:** JWT, bcrypt, HTTP-only cookies
- **Others:** dotenv, cookie-parser, express-async-handler

---

## 📦 Installation

```bash
git clone https://github.com/your-username/booknest-server.git
cd booknest-server
npm install
