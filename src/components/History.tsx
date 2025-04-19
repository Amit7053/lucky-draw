
import React from 'react';

interface HistoryProps {
  rolls: number[];
}

const History: React.FC<HistoryProps> = ({ rolls }) => {
  return (
    <div className="mt-8 p-6 rounded-xl bg-white/90 backdrop-blur-lg border-2 border-yellow-600/30 shadow-lg w-full">
      <h2 className="text-2xl font-bold mb-4 text-yellow-800">Previous Flips</h2>
      <div className="flex flex-wrap gap-2 justify-center">
        {rolls.map((roll, index) => (
          <div
            key={index}
            className="px-4 py-2 flex items-center justify-center rounded-full bg-yellow-100 border-2 border-yellow-600 text-yellow-800 font-bold"
          >
            {roll === 1 ? 'H' : 'T'}
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
