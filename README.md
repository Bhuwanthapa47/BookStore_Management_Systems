# Bookstore Management System

A full-stack bookstore application with a **Spring Boot REST API** backend and an **interactive React (Vite)** frontend.

## 🚀 Quick Start

### Prerequisites
- Java 17+
- Maven 3.8+
- MySQL 8+
- Node.js 18+

---

## Backend Setup

### 1. Create MySQL Database
```sql
CREATE DATABASE bookstore_db;
```

### 2. Configure Database Credentials
Edit `bookstore-backend/src/main/resources/application.properties`:
```properties
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```

### 3. Run the Backend
```bash
cd bookstore-backend
mvn spring-boot:run
```

The server starts at **http://localhost:8080**

### Default Seeded Accounts
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@bookstore.com | admin123 |
| Customer | customer@bookstore.com | customer123 |

### API Documentation (Swagger UI)
Open: **http://localhost:8080/swagger-ui.html**

---

## Frontend Setup

```bash
cd bookstore-frontend
npm install
npm run dev
```

Open: **http://localhost:5173**

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login & get JWT |

### Books (Public GET, Admin POST/PUT/DELETE)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/books` | List books (search, genre, pagination) |
| GET | `/api/books/{id}` | Get book by ID |
| POST | `/api/books` | Add book (Admin) |
| PUT | `/api/books/{id}` | Update book (Admin) |
| DELETE | `/api/books/{id}` | Delete book (Admin) |

### Orders (Authenticated)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Place order |
| GET | `/api/orders/my-orders` | My order history |
| GET | `/api/orders` | All orders (Admin) |
| GET | `/api/orders/{id}` | Order details |
| PUT | `/api/orders/{id}/status` | Update status (Admin) |

---

## Features

### Customer
- Browse & search books by title, author, genre
- View book details
- Add to cart, adjust quantities
- Place orders
- View order history with status tracking

### Admin
- Dashboard with stats (books, orders, revenue)
- Add / Edit / Delete books
- View all orders and update their status

### Security
- JWT authentication
- Role-based access control (CUSTOMER / ADMIN)
- BCrypt password hashing
- CORS configured for frontend

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Java 17, Spring Boot 3.2 |
| Security | Spring Security + JWT (jjwt) |
| Database | MySQL + Spring Data JPA |
| API Docs | Swagger / OpenAPI 3 |
| Frontend | React 18 + Vite |
| Routing | React Router v6 |
| HTTP | Axios |
| UI | Custom CSS (dark mode, glassmorphism) |
