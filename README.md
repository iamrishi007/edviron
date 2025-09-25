# Edviron - School Payment & Dashboard Application

A microservice-based application to manage school payments and transactions, providing both a backend REST API and a React-based frontend dashboard. The focus is on secure, scalable, and real-time management of transactions.

---

## 🚀 Project Overview

- **Backend:** Node.js with NestJS (or Express/Fastify alternative)
- **Frontend:** React.js with Tailwind CSS or preferred UI framework
- **Database:** MongoDB Atlas
- **Authentication:** JWT-based for API security
- **Payment Gateway Integration:** Supports create-payment flow and webhook updates
- **Features:** Transaction management, status checking, school-specific views, webhook logging

---

## 📦 Backend Setup

### 1. Initialize Project
```bash
# Using NestJS CLI (optional)
nest new edviron-backend

# OR using Express
npm init -y
npm install express mongoose dotenv jsonwebtoken axios


MONGO_URI=<Your MongoDB Atlas URI>
JWT_SECRET=<Your JWT secret>
JWT_EXPIRY=3600
PAYMENT_API_KEY=<API Key>
PAYMENT_PG_KEY=edvtest01



Core Features

Dashboard Pages

Transaction Overview (paginated, searchable, filterable by status & school ID)

Transaction Details by School

Transaction Status Check (via custom_order_id)

Sorting & Filtering: Columns sortable, filters persisted in URL

API Integration: Axios for backend communication