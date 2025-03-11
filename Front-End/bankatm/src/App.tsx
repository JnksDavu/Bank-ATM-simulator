import React, { useState, useEffect } from 'react';
import Keyboard from './Keyboard';
import './Style/style.css'

const App: React.FC = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    // Simulando a criação do ID de sessão (em um ambiente real, você buscará do backend)
    const generatedSessionId = "session123"; // Exemplo de ID
    setSessionId(generatedSessionId);
  }, []);

  return (
    <div className="app-container">
      <h1>Digite a Senha</h1>
      <p>Seu teclado está pronto. Clique nos botões na ordem correta!</p>
      {sessionId && <Keyboard sessionId={sessionId} />}
    </div>
  );
};

export default App;
