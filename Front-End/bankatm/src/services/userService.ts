import { api } from './api';

interface CreateUserResponse {
  message: string;
}

export const createUser = async (username: string, password: string): Promise<string> => {
  try {
    const response = await api.post<CreateUserResponse>('/users/create', { username, password });
    return response.data.message;
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    throw error;
  }
};