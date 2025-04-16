
import React, { useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Dice from '@/components/Dice';
import History from '@/components/History';
import { useAuth } from '@/contexts/AuthContext';
import { useWallet } from '@/contexts/WalletContext';
import { LogOut } from 'lucide-react';
import WalletComponent from '@/components/Wallet';
import Image from '@/components/ui/image';

const Index = () => {
  const [diceValue, setDiceValue] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [history, setHistory] = useState<number[]>([]);
  const [betAmount, setBetAmount] = useState(5);
  const { toast } = useToast();
  const { signOut } = useAuth();
  const { placeBet } = useWallet();

  const rollDice = useCallback(async () => {
    if (isRolling) return;
    
    const betPlaced = await placeBet(betAmount);
    if (!betPlaced) return;
    
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
  }, [isRolling, toast, placeBet, betAmount]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1F2C] to-[#403E43] p-4 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
      
      <div className="max-w-md mx-auto pt-6">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full overflow-hidden shadow-lg border-2 border-white/20">
              <Image 
                src="/lovable-uploads/7df5a136-61a4-44f2-9ee5-f2450d605dac.png" 
                alt="Picker Logo" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <WalletComponent />
            <Button 
              variant="ghost" 
              className="text-white/90 hover:text-white"
              onClick={() => signOut()}
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-8 glass p-8 rounded-2xl backdrop-blur-lg border border-white/10">
          <Dice value={diceValue} isRolling={isRolling} />
          
          <div className="w-full max-w-xs">
            <Input
              type="number"
              min="1"
              value={betAmount}
              onChange={(e) => setBetAmount(Math.max(1, parseInt(e.target.value) || 0))}
              className="mb-4 bg-white/10 border-white/20 text-white"
              placeholder="Enter bet amount"
            />
          </div>
          
          <Button 
            onClick={rollDice}
            disabled={isRolling}
            className="bg-green-600 hover:bg-green-700 text-white font-bold text-lg px-8 py-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
          >
            {isRolling ? 'Rolling...' : `Roll Dice (₹${betAmount})`}
          </Button>

          <History rolls={history} />
        </div>
      </div>
    </div>
  );
};

export default Index;
