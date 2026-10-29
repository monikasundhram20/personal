const API_URL = "https://personal-w9yq.onrender.com/api/expenses";

const expenseForm = document.getElementById("expenseForm");
const expenseTable = document.getElementById("expenseTable");
const totalExpense = document.getElementById("totalExpense");
const searchInput = document.getElementById("search");
const filterCategory = document.getElementById("filterCategory");

let expenses = [];

// Get all expenses
async function getExpenses() {
    try {
        const response = await fetch(API_URL);
        expenses = await response.json();

        displayExpenses(expenses);

    } catch (error) {
        console.error("Error:", error);
        alert("Unable to connect to server");
    }
}

// Display expenses
function displayExpenses(data) {

    expenseTable.innerHTML = "";

    let total = 0;

    data.forEach(expense => {

        total += Number(expense.amount);

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${expense.description}</td>
            <td>₹${expense.amount}</td>
            <td>${expense.category}</td>
            <td>${formatDate(expense.expense_date)}</td>

            <td>
                <button
                    class="edit-btn"
                    onclick="editExpense(${expense.id})">
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteExpense(${expense.id})">
                    Delete
                </button>
            </td>
        `;

        expenseTable.appendChild(row);
    });

    totalExpense.textContent = `₹${total}`;
}

// Add expense
expenseForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const description =
        document.getElementById("description").value;

    const amount =
        document.getElementById("amount").value;

    const category =
        document.getElementById("category").value;

    const expenseDate =
        document.getElementById("expenseDate").value;

    const expense = {
        description,
        amount,
        category,
        expense_date: expenseDate
    };

    try {

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(expense)
        });

        if (!response.ok) {
            throw new Error("Failed to add expense");
        }

        alert("Expense added successfully!");

        expenseForm.reset();

        getExpenses();

    } catch (error) {
        console.error(error);
        alert("Error adding expense");
    }
});

// Delete expense
async function deleteExpense(id) {

    const confirmDelete =
        confirm("Are you sure you want to delete this expense?");

    if (!confirmDelete) {
        return;
    }

    try {

        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Delete failed");
        }

        alert("Expense deleted!");

        getExpenses();

    } catch (error) {
        console.error(error);
        alert("Error deleting expense");
    }
}

// Edit expense
async function editExpense(id) {

    const expense =
        expenses.find(item => item.id === id);

    if (!expense) {
        return;
    }

    const description = prompt(
        "Enter description:",
        expense.description
    );

    if (description === null) return;

    const amount = prompt(
        "Enter amount:",
        expense.amount
    );

    if (amount === null) return;

    const category = prompt(
        "Enter category:",
        expense.category
    );

    if (category === null) return;

    try {

        const response = await fetch(`${API_URL}/${id}`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                description,
                amount,
                category,
                expense_date: expense.expense_date
            })

        });

        if (!response.ok) {
            throw new Error("Update failed");
        }

        alert("Expense updated!");

        getExpenses();

    } catch (error) {
        console.error(error);
        alert("Error updating expense");
    }
}

// Search
searchInput.addEventListener("input", filterExpenses);

// Category filter
filterCategory.addEventListener("change", filterExpenses);

function filterExpenses() {

    const searchText =
        searchInput.value.toLowerCase();

    const category =
        filterCategory.value;

    const filtered = expenses.filter(expense => {

        const matchesSearch =
            expense.description
                .toLowerCase()
                .includes(searchText);

        const matchesCategory =
            category === "All" ||
            expense.category === category;

        return matchesSearch && matchesCategory;
    });

    displayExpenses(filtered);
}

// Format date
function formatDate(date) {

    if (!date) {
        return "";
    }

    return new Date(date).toLocaleDateString("en-IN");
}

// Load expenses
getExpenses();
