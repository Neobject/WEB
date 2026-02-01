require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const Joi = require("joi");

const app = express();

/* ---------- Middleware ---------- */
app.use(cors());
app.use(express.json());

/* ---------- Database ---------- */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

/* ---------- Validation ---------- */
const userSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  age: Joi.number().integer().min(1).max(120).required(),
  comment: Joi.string().max(500).allow("")
});

/* ---------- Health check ---------- */
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

/* ---------- Create user ---------- */
app.post("/api/users", async (req, res) => {
  const { error, value } = userSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      error: error.details[0].message
    });
  }

  const { name, email, age, comment } = value;

  try {
    const result = await pool.query(
      `INSERT INTO users (name, email, age, comment)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, email, age, comment]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === "23505") {
      return res.status(400).json({
        error: "Email already exists"
      });
    }

    res.status(500).json({
      error: "Database error"
    });
  }
});

/* ---------- Get users ---------- */
app.get("/api/users", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM users ORDER BY created_at DESC`
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({
      error: "Database error"
    });
  }
});

/* ---------- Server ---------- */
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
