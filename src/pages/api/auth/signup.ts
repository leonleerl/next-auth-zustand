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

  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const filePath = path.join(process.cwd(), "db.json");
  const db = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  const users: User[] = db.users || [];

  if (users.find((user) => user.email === email)) {
    return res.status(400).json({ error: "User already exists" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser: User = { id: Date.now(), username, email, password: hashedPassword };
  users.push(newUser);

  fs.writeFileSync(filePath, JSON.stringify({ users }, null, 2));
  return res.status(201).json({ message: "User created successfully", user: { id: newUser.id, username, email } });
}
