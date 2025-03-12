
import './Style/style.css'

import React, { useState, useEffect } from 'react';
import Keyboard from './Keyboard';
import { createSession } from './services/sessionService';

const App: React.FC = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const userId = '2'; // Substitua pelo ID do usuário real

  useEffect(() => {
    const initializeSession = async () => {
      try {
        const newSessionId = await createSession(userId);
        setSessionId(newSessionId);
      } catch (error) {
        console.error("Erro ao criar sessão:", error);
      }
    };

    initializeSession();
  }, [userId]);

  return (
    <div className="app-container">
      <h1>Digite a Senha</h1>
      <p>Seu teclado está pronto. Clique nos botões na ordem correta!</p>
      {sessionId && <Keyboard userId={userId} />}
    </div>
  );
};

export default App;
