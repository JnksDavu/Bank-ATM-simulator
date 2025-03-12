import { api } from './api';

interface ButtonPair {
  first: string;
  second: string;
}

interface KeyMapResponse {
  keyMap: string[];
}

interface CreateSessionResponse {
  sessionId: string;
}

interface ValidateSessionResponse {
  isValid: boolean;
}

export const getSessionKeyMap = async (sessionId: string): Promise<ButtonPair[]> => {
  try {
    const response = await api.get<KeyMapResponse>(`/sessions/${sessionId}/keymap`);
    const pairs: ButtonPair[] = response.data.keyMap.map((pair: string) => {
      const [first, second] = pair.split(',');
      return { first, second };
    });
    return pairs;
  } catch (error) {
    console.error("Erro ao buscar os pares de botões:", error);
    throw error;
  }
};

export const createSession = async (userId: string): Promise<string> => {
  try {
    const response = await api.post<CreateSessionResponse>('/sessions/create', { userId });
    return response.data.sessionId;
  } catch (error) {
    console.error("Erro ao criar sessão:", error);
    throw error;
  }
};

export const validateSession = async (sessionId: string, clickedButtons: string[], username: string): Promise<boolean> => {
  try {
    const response = await api.post<ValidateSessionResponse>(`/sessions/${sessionId}/validate`, { clickedButtons, username });
    return response.data.isValid;
  } catch (error) {
    console.error("Erro ao validar sessão:", error);
    throw error;
  }
};