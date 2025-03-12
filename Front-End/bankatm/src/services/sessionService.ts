import { api } from './api';

interface ButtonPair {
  first: string;
  second: string;
}

export const getSessionKeyMap = async (sessionId: string): Promise<ButtonPair[]> => {
  try {
    const response = await api.get(`/sessions/${sessionId}/keymap`);
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
    const response = await api.post('/sessions/create', { userId });
    return response.data.sessionId;
  } catch (error) {
    console.error("Erro ao criar sessão:", error);
    throw error;
  }
};

export const validateSession = async (sessionId: string, clickedButtons: string[]): Promise<boolean> => {
    try {
      const response = await api.post(`/sessions/${sessionId}/validate`, { clickedButtons });
      return response.data.isValid;
    } catch (error) {
      console.error("Erro ao validar sessão:", error);
      throw error;
    }
  };