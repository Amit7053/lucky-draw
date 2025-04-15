
import React from 'react';

interface HistoryProps {
  rolls: number[];
}

const History: React.FC<HistoryProps> = ({ rolls }) => {
  return (
    <div className="mt-8 p-6 rounded-xl bg-lottery-purple/10 backdrop-blur-lg border border-lottery-purple/20">
      <h2 className="text-2xl font-bold mb-4 text-lottery-gold">Previous Rolls</h2>
      <div className="flex flex-wrap gap-2 justify-center">
        {rolls.map((roll, index) => (
          <div
            key={index}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-lottery-purple/20 border border-lottery-gold/30"
          >
            {roll}
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
