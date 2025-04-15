
import React, { useState, useCallback } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import Dice from '@/components/Dice';
import History from '@/components/History';

const Index = () => {
  const [diceValue, setDiceValue] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [history, setHistory] = useState<number[]>([]);
  const { toast } = useToast();

  const rollDice = useCallback(() => {
    if (isRolling) return;
    
    setIsRolling(true);
    const newValue = Math.floor(Math.random() * 6) + 1;
    
    setTimeout(() => {
      setDiceValue(newValue);
      setHistory(prev => [newValue, ...prev].slice(0, 10));
      setIsRolling(false);
      toast({
        title: "🎲 New Roll!",
        description: `You rolled a ${newValue}!`,
      });
    }, 1000);
  }, [isRolling, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-lottery-darkPurple/20 to-lottery-purple/20 p-4">
      <div className="max-w-md mx-auto pt-10">
        <h1 className="text-4xl font-bold text-center mb-8 text-lottery-gold">Lucky Dice</h1>
        
        <div className="flex flex-col items-center gap-8">
          <Dice value={diceValue} isRolling={isRolling} />
          
          <Button 
            onClick={rollDice}
            disabled={isRolling}
            className="bg-lottery-gold hover:bg-lottery-gold/80 text-lottery-darkPurple font-bold text-lg px-8 py-6"
          >
            {isRolling ? 'Rolling...' : 'Roll Dice'}
          </Button>

          <History rolls={history} />
        </div>
      </div>
    </div>
  );
};

export default Index;
