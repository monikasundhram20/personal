
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "expense_tracker",
    port: Number(process.env.DB_PORT || 3306)
});

db.connect((error) => {
    if (error) {
        console.error("Database connection failed:", error.message);
        return;
    }

    console.log("MySQL connected successfully");
});

// Make database available to routes
app.set("db", db);

// Routes
const expenseRoutes = require("./expenseRoutes");
app.use("/api/expenses", expenseRoutes);

// Test route
app.get("/", (req, res) => {
    res.send("Expense Tracker API is running");
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
