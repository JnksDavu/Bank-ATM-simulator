import { api } from './api';

interface CreateUserResponse {
  message: string;
}

interface checkUserExistsResponse {
  exists: boolean;
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

export const checkUserExists = async (username: string): Promise<boolean> => {
  try {
    const response = await api.get<checkUserExistsResponse>(`/users/check/${username}`);
    return response.data.exists;
  } catch (error) {
    console.error("Erro ao verificar usuário:", error);
    throw error;
  }
};