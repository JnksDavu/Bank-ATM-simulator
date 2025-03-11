import React, { useState, useEffect } from 'react';

interface KeyboardProps {
  sessionId: string;
}

interface ButtonPair {
  first: string;
  second: string;
}

const Keyboard: React.FC<KeyboardProps> = ({ sessionId }) => {
  const [buttonPairs, setButtonPairs] = useState<ButtonPair[]>([]);
  const [clickedButtons, setClickedButtons] = useState<string[]>([]);

  useEffect(() => {
    // Simulação de obtenção do teclado a partir do ID de sessão
    const pairs: ButtonPair[] = [
      { first: '0', second: '1' },
      { first: '9', second: '3' },
      { first: '5', second: '7' },
      { first: '6', second: '8' },
      { first: '2', second: '4' },
    ];

    // Em um caso real, o ID de sessão seria usado para garantir que a ordem dos botões seja única
    setButtonPairs(pairs);
  }, [sessionId]);

  const handleButtonClick = (button: string) => {
    setClickedButtons([...clickedButtons, button]);
  };

  const handleSubmit = () => {
    console.log("Ordem dos botões clicados:", clickedButtons);
    // Aqui você pode enviar os dados para validação no backend
  };

  return (
    <div className="keyboard">
      {buttonPairs.map((pair, index) => (
        <div key={index} className="button-row">
          <button
            onClick={() => handleButtonClick(pair.first)}
            className="key-button"
          >
            {pair.first} / {pair.second}
          </button>
        </div>
      ))}
      <button className="submit-button" onClick={handleSubmit}>
        Submeter
      </button>
    </div>
  );
};

export default Keyboard;
