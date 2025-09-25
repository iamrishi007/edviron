require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");

const db = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const paymentRoutes = require("./routes/createPayment.routes"); // ✅ Make sure this is imported
const transactionRoutes = require("./routes/transactions.routes");
const errorHandler = require("./middlewares/error.middleware");

const PORT = process.env.PORT || 4000;
const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Route prefixes
app.use("/auth", authRoutes);
app.use("/payments", paymentRoutes);          
app.use("/transactions", transactionRoutes);

// 404 handler
app.use((req, res) => res.status(404).json({ message: "Endpoint not found" }));

// Error handler
app.use(errorHandler);

db.connect()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error("DB connection failed:", err));

process.on("SIGINT", async () => {
  await db.disconnect();
  process.exit(0);
});
