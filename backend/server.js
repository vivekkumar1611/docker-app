const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Root route for Elastic Beanstalk health check
app.get("/", (req, res) => {
  res.send("Docker App Running Successfully");
});

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.log("Database connection failed");
    console.log(err);
  } else {
    console.log("Connected to MySQL");
  }
});

app.get("/api/users", (req, res) => {
  db.query("SELECT * FROM users", (err, result) => {
    if (err) return res.status(500).send(err);

    res.json(result);
  });
});

app.post("/api/users", (req, res) => {
  const { name, email } = req.body;

  db.query(
    "INSERT INTO users(name,email) VALUES (?,?)",
    [name, email],
    (err, result) => {
      if (err) return res.status(500).send(err);

      res.json({
        message: "User added",
      });
    }
  );
});

app.delete("/api/users/:id", (req, res) => {
  db.query(
    "DELETE FROM users WHERE id=?",
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).send(err);

      res.json({
        message: "User deleted",
      });
    }
  );
});

// IMPORTANT FOR ELASTIC BEANSTALK
const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
