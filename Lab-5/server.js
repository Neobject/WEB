import express from "express";
import mysql from "mysql2/promise";
import Joi from "joi";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "test_db",
});

const schema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  age: Joi.number().integer().min(1).max(120).required(),
  comment: Joi.string().allow("").max(500),
});

app.post("/api/users", async (req, res) => {
  const { error, value } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { name, email, age, comment } = value;

  try {
    const [result] = await db.execute(
      "INSERT INTO users (name, email, age, comment) VALUES (?, ?, ?, ?)",
      [name, email, age, comment]
    );

    res.status(201).json({ id: result.insertId, ...value });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Database error" });
  }
});

app.get("/api/users", async (_req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM users ORDER BY created_at DESC");
    res.json(rows);
  } catch {
    res.status(500).json({ message: "Failed to load users" });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
