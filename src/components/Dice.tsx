import React from 'react';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from 'lucide-react';

interface DiceProps {
  value: number;
  isRolling: boolean;
}

const Dice: React.FC<DiceProps> = ({ value, isRolling }) => {
  const getDiceIcon = () => {
    const props = { size: 80, className: "text-yellow-600" };
    switch (value) {
      case 1: return <Dice1 {...props} />;
      case 2: return <Dice2 {...props} />;
      case 3: return <Dice3 {...props} />;
      case 4: return <Dice4 {...props} />;
      case 5: return <Dice5 {...props} />;
      case 6: return <Dice6 {...props} />;
      default: return <Dice1 {...props} />;
    }
  };

  return (
    <div className={`p-8 rounded-xl bg-white/90 backdrop-blur-lg border-2 border-yellow-600/30 shadow-xl
      ${isRolling ? 'animate-dice-roll' : 'transition-transform hover:scale-105'}`}>
      {getDiceIcon()}
    </div>
  );
};

export default Dice;
