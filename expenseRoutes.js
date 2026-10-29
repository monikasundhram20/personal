const express = require("express");

const router = express.Router();

// GET all expenses
router.get("/", (req, res) => {

    const db = req.app.get("db");

    const sql = `
        SELECT *
        FROM expenses
        ORDER BY expense_date DESC
    `;

    db.query(sql, (error, results) => {

        if (error) {
            console.error(error);
            return res.status(500).json({
                message: "Failed to get expenses"
            });
        }

        res.json(results);
    });
});


// POST - Add expense
router.post("/", (req, res) => {

    const db = req.app.get("db");

    const {
        description,
        amount,
        category,
        expense_date
    } = req.body;

    if (!description || !amount || !category || !expense_date) {

        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const sql = `
        INSERT INTO expenses
        (description, amount, category, expense_date)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            description,
            amount,
            category,
            expense_date
        ],
        (error, result) => {

            if (error) {
                console.error(error);

                return res.status(500).json({
                    message: "Failed to add expense"
                });
            }

            res.status(201).json({
                message: "Expense added successfully",
                id: result.insertId
            });
        }
    );
});


// PUT - Edit expense
router.put("/:id", (req, res) => {

    const db = req.app.get("db");

    const { id } = req.params;

    const {
        description,
        amount,
        category,
        expense_date
    } = req.body;

    const sql = `
        UPDATE expenses
        SET
            description = ?,
            amount = ?,
            category = ?,
            expense_date = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            description,
            amount,
            category,
            expense_date,
            id
        ],
        (error) => {

            if (error) {
                console.error(error);

                return res.status(500).json({
                    message: "Failed to update expense"
                });
            }

            res.json({
                message: "Expense updated successfully"
            });
        }
    );
});


// DELETE - Delete expense
router.delete("/:id", (req, res) => {

    const db = req.app.get("db");

    const { id } = req.params;

    const sql = `
        DELETE FROM expenses
        WHERE id = ?
    `;

    db.query(sql, [id], (error) => {

        if (error) {
            console.error(error);

            return res.status(500).json({
                message: "Failed to delete expense"
            });
        }

        res.json({
            message: "Expense deleted successfully"
        });
    });
});


module.exports = router;
