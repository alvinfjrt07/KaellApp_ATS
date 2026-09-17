import { Request, Response } from "express";
import { RowDataPacket, ResultSetHeader } from "mysql2";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../config/db";
// POST /api/auth/register
export async function register(req: Request, res: Response) {
  const { name, email, password } = req.body;
  const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
  const errors: string[] = [];
  if (!name || name.trim() === "") errors.push("name wajib diisi");
  if (!normalizedEmail) errors.push("email wajib diisi");
  if (!password || password.length < 6)
    errors.push("password wajib diisi, minimal 6 karakter");
  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors.join(", ") });
  }
  const [existing] = await pool.query<RowDataPacket[]>(
    "SELECT id FROM users WHERE email = ?",
    [normalizedEmail]
  );
  if (existing.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Email sudah terdaftar",
    });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name.trim(), normalizedEmail, hashedPassword]
  );
  return res.status(201).json({
    success: true,
    message: "Registrasi berhasil",
    data: { id: result.insertId, name: name.trim(), email: normalizedEmail },
  });
}
// POST /api/auth/login
export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
  if (!normalizedEmail || !password) {
    return res.status(400).json({
      success: false,
      message: "Email dan password wajib diisi",
    });
  }
  const [users] = await pool.query<RowDataPacket[]>(
    "SELECT * FROM users WHERE email = ?",
    [normalizedEmail]
  );
  if (users.length === 0) {
    return res.status(401).json({
      success: false,
      message: "Email atau password salah",
    });
  }
  const user = users[0];
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: "Email atau password salah",
    });
  }
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET belum dikonfigurasi");
  }
  const token = jwt.sign(
    { id: user.id, email: user.email },
    jwtSecret,
    { expiresIn: "7d" }
  );
  return res.status(200).json({
    success: true,
    message: "Login berhasil",
    data: {
      token,
      user: { id: user.id, name: user.name, email: user.email },
    },
  });
}