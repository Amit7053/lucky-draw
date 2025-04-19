
import React from 'react';
import { Coins } from 'lucide-react';

interface CoinProps {
  value: number;
  isRolling: boolean;
}

const Coin: React.FC<CoinProps> = ({ value, isRolling }) => {
  return (
    <div className={`relative p-4 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500] backdrop-blur-sm border-4 border-[#FFD700]/30 shadow-[0_0_15px_rgba(255,215,0,0.5)] w-24 h-24 flex items-center justify-center transform-gpu
      ${isRolling ? 'animate-flip' : 'transition-transform hover:scale-105 hover:shadow-[0_0_25px_rgba(255,215,0,0.7)]'}`}>
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500] opacity-50 blur-sm" />
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#FFE55C] to-[#FFB627] opacity-30" />
      <div className="relative z-10 text-4xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
        {value === 1 ? 'H' : 'T'}
      </div>
      <div className="absolute inset-0 rounded-full border-t-2 border-white/20" />
    </div>
  );
};

export default Coin;
