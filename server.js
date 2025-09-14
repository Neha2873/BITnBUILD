const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public")); // serve frontend

// Database setup
const db = new sqlite3.Database(":memory:");

db.serialize(() => {
  db.run(`
    CREATE TABLE transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      department TEXT,
      type TEXT,
      amount REAL,
      status TEXT
    )
  `);

  const stmt = db.prepare("INSERT INTO transactions (department, type, amount, status) VALUES (?, ?, ?, ?)");
  stmt.run("Civil", "allocation", 1000000, "completed");
  stmt.run("CSE", "expense", 450000, "pending");
  stmt.finalize();
});

// Get transactions
app.get("/api/transactions", (req, res) => {
  db.all("SELECT * FROM transactions", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Add transaction
app.post("/api/transactions", (req, res) => {
  const { department, type, amount, status } = req.body;
  db.run(
    "INSERT INTO transactions (department, type, amount, status) VALUES (?, ?, ?, ?)",
    [department, type, amount, status || "pending"],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, department, type, amount, status });
    }
  );
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
