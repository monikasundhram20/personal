const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const expenseRoutes = require("./routes/expenseRoutes");

const app = express();

const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
    host: "YOUR_DATABASE_HOST",
    user: "YOUR_DATABASE_USER",
    password: "YOUR_DATABASE_PASSWORD",
    database: "expense_tracker",
    port: 3306
});


db.connect((error) => {

    if (error) {
        console.error("Database connection failed:", error);
        return;
    }

    console.log("MySQL connected successfully");
});

// Make DB available to routes
app.set("db", db);

// Routes
app.use("/api/expenses", expenseRoutes);

// Test route
app.get("/", (req, res) => {
    res.send("Expense Tracker API is running");
});

// Start serve

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});

