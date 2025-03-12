import React, { useState, useEffect } from 'react';
import { getSessionKeyMap, createSession, validateSession } from './services/sessionService';

interface KeyboardProps {
  userId: string;
}

interface ButtonPair {
  first: string;
  second: string;
}

const Keyboard: React.FC<KeyboardProps> = ({ userId }) => {
  const [buttonPairs, setButtonPairs] = useState<ButtonPair[]>([]);
  const [clickedButtons, setClickedButtons] = useState<string[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const initializeSession = async () => {
    try {
      const newSessionId = await createSession(userId);
      setSessionId(newSessionId);
      const pairs = await getSessionKeyMap(newSessionId);
      setButtonPairs(pairs);
      setClickedButtons([]);
    } catch (error) {
      console.error("Erro ao inicializar a sessão:", error);
    }
  };

  useEffect(() => {
    if (!sessionId) {
      initializeSession();
    }
  }, [userId, sessionId]);

  const handleButtonClick = (pair: ButtonPair) => {
    if (clickedButtons.length < 8) {
      setClickedButtons([...clickedButtons, pair.first, pair.second]);
    }
  };

  const handleReset = () => {
    initializeSession();
  };

  const handleSubmit = async () => {
    console.log("Ordem dos botões clicados:", clickedButtons);
    if (sessionId) {
      try {
        const isValid = await validateSession(sessionId, clickedButtons, userId);
        if (isValid) {
          alert("Senha válida!");
        } else {
          alert("Senha inválida!");
        }
      } catch (error) {
        console.error("Erro ao validar a sessão:", error);
      }
      initializeSession();
    }
  };

  return (
    <div className="keyboard">
      {buttonPairs.map((pair, index) => (
        <div key={index} className="button-row">
          <button
            onClick={() => handleButtonClick(pair)}
            className="key-button"
            disabled={clickedButtons.length >= 8}
          >
            {pair.first} / {pair.second}
          </button>
        </div>
      ))}
      <input
        type="password"
        value={clickedButtons.join('')}
        readOnly
        placeholder="Senha"
        className="password-input"
      />
      <div className="button-container">
        <button className="submit-button" onClick={handleSubmit} disabled={clickedButtons.length < 8}>
          Submeter
        </button>
        <button className="reset-button" onClick={handleReset}>
          Resetar
        </button>
      </div>
    </div>
  );
};

export default Keyboard;