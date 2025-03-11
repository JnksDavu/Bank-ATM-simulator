import express, { Router, Request, Response } from "express";
import { openDb } from "../utils/database";
import { hashPassword, comparePassword, encryptSessionId, decryptSessionId } from "../controller/security";
import { v4 as uuidv4 } from "uuid";

const routerAuth = Router();

// 🔹 Registro de Usuário
routerAuth.post("/register", async(req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "Preencha todos os campos!" });

  try {
    const db = await openDb();
    const passwordHash = await hashPassword(password);

    await db.run("INSERT INTO users (username, password_hash) VALUES (?, ?)", [username, passwordHash]);

    res.status(201).json({ message: "Usuário registrado com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao registrar usuário!" });
  }
});

// 🔹 Login do Usuário
routerAuth.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "Preencha todos os campos!" });

  try {
    const db = await openDb();
    const user = await db.get("SELECT * FROM users WHERE username = ?", [username]);

    if (!user || !(await comparePassword(password, user.password_hash))) {
      return res.status(401).json({ error: "Credenciais inválidas!" });
    }

    const sessionId = uuidv4();
    const encryptedSessionId = encryptSessionId(sessionId);

    await db.run("INSERT INTO sessions (session_id, user_id, key_map, is_active) VALUES (?, ?, ?, 1)", [
      sessionId,
      user.id,
      JSON.stringify([]), // 🔸 No futuro, aqui serão armazenados os pares de teclas.
    ]);

    res.json({ sessionId: encryptedSessionId });
  } catch (error) {
    res.status(500).json({ error: "Erro no login!" });
  }
});

// 🔹 Decodificar ID de Sessão
routerAuth.post("/validate-session", async (req: Request, res: Response) => {
  const { encryptedSessionId } = req.body;
  if (!encryptedSessionId) return res.status(400).json({ error: "ID de sessão não fornecido!" });

  try {
    const sessionId = decryptSessionId(encryptedSessionId);
    const db = await openDb();
    const session = await db.get("SELECT * FROM sessions WHERE session_id = ? AND is_active = 1", [sessionId]);

    if (!session) {
      return res.status(401).json({ error: "Sessão inválida!" });
    }

    res.json({ message: "Sessão válida!" });
  } catch (error) {
    res.status(500).json({ error: "Erro na validação!" });
  }
});

export default routerAuth;
