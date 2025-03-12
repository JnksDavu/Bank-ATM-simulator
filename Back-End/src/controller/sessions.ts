import { Request, Response } from "express";
import { openDb } from "../utils/database";
import crypto from "crypto";

// Função para gerar um ID de sessão seguro
function generateSessionId(): string {
  return crypto.randomBytes(32).toString("hex");
}

function generateKeyMap(): string {
  const numbers = "0123456789".split("");
  const pairs: string[] = [];

  while (numbers.length > 0) {
    const first = numbers.splice(Math.floor(Math.random() * numbers.length), 1)[0];
    const second = numbers.splice(Math.floor(Math.random() * numbers.length), 1)[0];
    pairs.push(`${first},${second}`);
  }

  return JSON.stringify(pairs);
}

// Função auxiliar para gerar todas as permutações possíveis
function permute(arr: string[]): string[][] {
  if (arr.length === 0) return [[]];
  const result: string[][] = [];
  for (let i = 0; i < arr.length; i++) {
    const rest = permute(arr.slice(0, i).concat(arr.slice(i + 1)));
    for (const perm of rest) {
      result.push([arr[i], ...perm]);
    }
  }
  return result;
}

// Função auxiliar para gerar todas as combinações possíveis de 4 dígitos a partir dos 8 dígitos fornecidos
function combinations(arr: string[], length: number): string[][] {
  if (length === 0) return [[]];
  const result: string[][] = [];
  for (let i = 0; i < arr.length; i++) {
    const rest = combinations(arr.slice(i + 1), length - 1);
    for (const comb of rest) {
      result.push([arr[i], ...comb]);
    }
  }
  return result;
}

export async function createSession(req: Request, res: Response) {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ error: "Usuário não informado" });
  }

  try {
    const db = await openDb();

    // Invalida todas as sessões anteriores do usuário
    await db.run("UPDATE sessions SET is_active = 0 WHERE user_id = ?", [userId]);

    // Gera a nova sessão
    const sessionId = generateSessionId();
    const keyMap = generateKeyMap();
    await db.run(
      "INSERT INTO sessions (session_id, user_id, key_map) VALUES (?, ?, ?)",
      [sessionId, userId, keyMap]
    );

    return res.json({ sessionId, keyMap: JSON.parse(keyMap) });
  } catch (error) {
    console.error("Erro ao criar sessão:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}

export async function getSessionKeyMap(req: Request, res: Response) {
  const { sessionId } = req.params;

  try {
    const db = await openDb();
    const session = await db.get("SELECT key_map FROM sessions WHERE session_id = ?", [sessionId]);

    if (!session) {
      return res.status(404).json({ error: "Sessão não encontrada" });
    }

    return res.json({ keyMap: JSON.parse(session.key_map) });
  } catch (error) {
    console.error("Erro ao buscar o keyMap da sessão:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}

export async function validateSession(req: Request, res: Response) {
  const { sessionId } = req.params;
  const { clickedButtons }: { clickedButtons: string[] } = req.body;

  try {
    const db = await openDb();
    const session = await db.get("SELECT user_id FROM sessions WHERE session_id = ?", [sessionId]);

    if (!session) {
      return res.status(404).json({ error: "Sessão não encontrada" });
    }

    const user = await db.get("SELECT password_hash FROM users WHERE id = ?", [session.user_id]);

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const passwordHash: string = user.password_hash;
    if (!passwordHash) {
      return res.status(500).json({ error: "Senha não encontrada" });
    }

    const passwordArray: string[] = passwordHash.split('');
    const combs = combinations(clickedButtons, 4);
    const permutations = combs.flatMap(permute);

    const isValid = permutations.some(perm => perm.every((digit, index) => digit === passwordArray[index]));

    return res.json({ isValid });
  } catch (error) {
    console.error("Erro ao validar a sessão:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}