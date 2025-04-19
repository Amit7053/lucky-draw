
import React from 'react';
import { Coins } from 'lucide-react';

interface CoinProps {
  value: number;
  isRolling: boolean;
}

const Coin: React.FC<CoinProps> = ({ value, isRolling }) => {
  return (
    <div className={`relative p-4 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 backdrop-blur-sm border border-yellow-400/30 shadow-xl w-24 h-24 flex items-center justify-center
      ${isRolling ? 'animate-flip' : 'transition-transform hover:scale-105'}`}>
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 opacity-50 blur-sm" />
      <div className="relative z-10 text-4xl font-bold text-white">
        {value === 1 ? 'H' : 'T'}
      </div>
    </div>
  );
};

export default Coin;
