import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser } from './services/userService';
import './Style/style.css';

const CreateUser: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const navigate = useNavigate();

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const responseMessage = await createUser(username, password);
      setMessage(responseMessage);
    } catch (error) {
      setMessage('Erro ao criar usuário. Tente novamente.');
      console.error('Erro ao criar usuário:', error);
    }
  };

  const handleStartSession = () => {
    navigate('/');
  };

  return (
    <div className="create-user-container">
      <h1>Criar Usuário</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Nome de Usuário:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleUsernameChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Senha:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <button type="submit" className="create-user-button">Criar Usuário</button>
      </form>
      {message && <p className="message">{message}</p>}
      <button className="start-session-button" onClick={handleStartSession}>Iniciar Sessão</button>
    </div>
  );
};

export default CreateUser;