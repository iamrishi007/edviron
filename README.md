# Edviron - School Payment & Dashboard Application

A microservice-based application to manage school payments and transactions, providing both a backend REST API and a React-based frontend dashboard. The focus is on secure, scalable, and real-time management of transactions.

---

## LIVE   https://edviron-assignment01.netlify.app/

## 🚀 Project Overview

- **Backend:** Node.js with NestJS (or Express/Fastify alternative)  
- **Frontend:** React.js with Tailwind CSS or preferred UI framework  
- **Database:** MongoDB Atlas  
- **Authentication:** JWT-based for API security  
- **Payment Gateway Integration:** Supports create-payment flow and webhook updates  
- **Features:** Transaction management, status checking, school-specific views, webhook logging  

---

## 📦 Project Setup

### 1. Backend Setup
Initialize project using NestJS or Express:

```bash
# NestJS
nest new edviron-backend

# OR Express
npm init -y
npm install express mongoose dotenv jsonwebtoken axios

MONGO_URI=<Your MongoDB Atlas URI>
JWT_SECRET=<Your JWT secret>
JWT_EXPIRY=3600
PAYMENT_API_KEY=<Your Payment API Key>
PAYMENT_PG_KEY=edvtest01
SCHOOL_ID=<Your School ID>


2. Database Schemas

Order Schema: _id, school_id, trustee_id, student_info{name,id,email}, gateway_name

Order Status Schema: collect_id(ref to Order), order_amount, transaction_amount, payment_mode, payment_details, bank_reference, payment_message, status, error_message, payment_time

Webhook Logs Schema: stores webhook events for auditing

User Schema: login credentials for JWT authentication



API Endpoints

POST /create-payment: Accepts payment details, calls external payment API, generates JWT-signed payload, redirects user to payment page

POST /webhook: Updates order status using payload

GET /transactions: Returns all transactions (joins Order & Order Status) with pagination and sorting

GET /transactions/school/:schoolId: Returns transactions filtered by school

GET /transaction-status/:custom_order_id: Returns transaction status
status

🖥 Frontend Setup

Initialize React project:

# Using Vite
npm create vite@latest edviron-frontend
cd edviron-frontend
npm install


Install styling and navigation libraries:

npm install axios react-router-dom tailwindcss

Core Features

Dashboard Pages: Transaction Overview, Transaction Details by School, Transaction Status Check

Sorting & Filtering: Columns sortable, filters persisted in URL

API Integration: Axios calls to backend endpoints

✅ Additional Notes

Validation & Error Handling: Use class-validator (NestJS) or Express middleware

Security: JWT auth, input sanitization, HTTPS, CORS

Performance: Pagination, sorting, and MongoDB indexing for school_id, custom_order_id, collect_id

Logging: Log webhook events and failed transactions for debugging

🧩 Submission Guidelines

Host project on cloud (Heroku, AWS, etc.)

Push code to GitHub repository with .env.example

Include README with setup instructions and API usage

Provide Postman collection for testing

Share hosted URL and GitHub repository link

📄 References

Payment API Docs
