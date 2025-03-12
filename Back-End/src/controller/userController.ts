import { Request, Response } from "express";
import { openDb } from "../utils/database";
import bcrypt from "bcryptjs";

// Função para validar a senha (deve ter 4 dígitos)
const validatePassword = (password: string) => {
  const regex = /^\d{4}$/; // Senha deve ter exatamente 4 dígitos
  return regex.test(password);
};

// Função para criar um usuário
export const createUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    // Abrir conexão com o banco de dados
    const db = await openDb();

    // Verificar se o nome de usuário já existe
    const userExists = await db.get("SELECT * FROM users WHERE username = ?", [username]);

    if (userExists) {
      return res.status(400).json({ message: "Nome de usuário já existe!" });
    }

    // Validar a senha (deve ter 4 dígitos)
    if (!validatePassword(password)) {
      return res.status(405).json({ message: "A senha deve conter exatamente 4 dígitos e conter apenas números!" });
    }

    // Gerar hash da senha para segurança

    // Inserir o usuário no banco de dados
    await db.run("INSERT INTO users (username, password_hash) VALUES (?, ?)", [username, password]);

    return res.status(201).json({ message: "Usuário criado com sucesso!" });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return res.status(500).json({ message: "Erro ao criar usuário!" });
  }
};