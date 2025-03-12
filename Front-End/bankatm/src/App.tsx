import './Style/style.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Keyboard from './Keyboard';

const App: React.FC = () => {
  const [userId, setUserId] = useState<string>('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserId(event.target.value);
  };

  const handleStartSession = async () => {
    if (userId) {
      setSessionId(userId);
    } else {
      alert("Por favor, insira um nome de usuário.");
    }
  };

  const handleBack = () => {
    setSessionId(null);
    setUserId('');
  };

  const handleCreateUser = () => {
    navigate('/create-user');
  };

  return (
    <div className="app-container">
      {!sessionId ? (
        <>
          <h1>Escolha um usuário para logar</h1>
          <input
            type="text"
            placeholder="Digite o nome de usuário"
            value={userId}
            onChange={handleInputChange}
          />
          <div className="button-container">
            <button className="start-button" onClick={handleStartSession}>Iniciar Sessão</button>
            <button className="create-user-button" onClick={handleCreateUser}>Criar Usuário</button>
          </div>
        </>
      ) : (
        <>
          <div className="header">
            <h1>Digite a Senha</h1>
            <button className="back-button" onClick={handleBack}>Voltar</button>
          </div>
          <p>Seu teclado está pronto. Clique nos botões na ordem correta!</p>
          <Keyboard userId={sessionId} />
          <button className="create-user-button" onClick={handleCreateUser}>Criar Usuário</button>
        </>
      )}
    </div>
  );
};

export default App;