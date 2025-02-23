import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

interface User {
  id: number;
  username: string;
  email: string;
  password: string;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { email, password } = req.body;
  const filePath = path.join(process.cwd(), "db.json");
  const db = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  const users: User[] = db.users || [];

  const user = users.find((u) => u.email === email);
  if (!user) return res.status(400).json({ error: "User not found" });

  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) return res.status(401).json({ error: `Invalid credentials password: ${password} user.password: ${user.password}` });

  return res.status(200).json({ message: "Login successful", user: { id: user.id, username: user.username, email: user.email } });
}
