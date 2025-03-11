import { openDb } from "../config/database";
import crypto from "crypto";

// Função para embaralhar os números do teclado
defineShuffleKey = () => {
  const numbers = "0123456789".split("");
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }
  return numbers.join("");
};

// Criar nova sessão ao carregar a página
export async function createSession(req, res) {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: "Usuário inválido" });

  const sessionId = crypto.randomBytes(16).toString("hex");
  const keyMap = defineShuffleKey();

  try {
    const db = await openDb();
    await db.run(
      `INSERT INTO sessions (session_id, user_id, key_map, is_active) VALUES (?, ?, ?, 1)`,
      [sessionId, userId, keyMap]
    );

    res.json({ sessionId, keyMap });
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar sessão" });
  }
}

// Verificar se a sessão ainda está ativa
export async function checkSession(req, res) {
  const { sessionId } = req.params;
  try {
    const db = await openDb();
    const session = await db.get(
      `SELECT session_id, key_map FROM sessions WHERE session_id = ? AND is_active = 1`,
      [sessionId]
    );
    if (!session) return res.status(404).json({ error: "Sessão não encontrada ou expirada" });
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: "Erro ao verificar sessão" });
  }
}

// Validar senha digitada
export async function validatePassword(req, res) {
  const { sessionId, inputPassword } = req.body;

  try {
    const db = await openDb();
    const session = await db.get(`SELECT user_id FROM sessions WHERE session_id = ? AND is_active = 1`, [sessionId]);
    if (!session) return res.status(404).json({ error: "Sessão inválida" });

    const user = await db.get(`SELECT password_hash FROM users WHERE id = ?`, [session.user_id]);
    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    if (user.password_hash === inputPassword) {
      await db.run(`UPDATE sessions SET is_active = 0 WHERE session_id = ?`, [sessionId]);
      res.json({ success: true, message: "Senha correta!" });
    } else {
      res.status(401).json({ error: "Senha incorreta" });
    }
  } catch (error) {
    res.status(500).json({ error: "Erro ao validar senha" });
  }
}
