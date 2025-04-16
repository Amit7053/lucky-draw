
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
      {/* Background patterns for gaming effect */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zM16.686 0L10.2 6.485 11.616 7.9l7.9-7.9h-2.83zM22.343 0L13.858 8.485 15.272 9.9l7.9-7.9h-.83zm5.657 0L19.515 8.485 17.343 10.657 28 0h-2.83zM32.657 0L26.172 6.485 24.757 7.9l7.9-7.9h-2.83zM38.315 0L29.83 8.485 28.414 9.9l7.9-7.9h-.83zm5.656 0l-8.485 8.485L33.172 10.657 44.287 0h-2.83zm5.656 0l-8.485 8.485L38.586 9.9l7.9-7.9h-.83zm5.657 0L47.8 6.485 46.384 7.9l7.9-7.9h-2.83zM0 5.373l.828.83L2.243 5.96 0 3.72V5.374zm0 5.656l.828.83L2.243 11.6l-2.243-2.24V11.03zm0 5.657l.828.83L2.243 17.257l-2.243-2.24v2.827zm0 5.657L.828 23.17 2.243 22.54l-2.243-2.24v2.827zm0 5.657l.828.83L2.243 28.197l-2.243-2.24v2.827zm0 5.657l.828.83L2.243 33.854l-2.243-2.24v2.827zm0 5.657l.828.83L2.243 39.51l-2.243-2.24v2.827zm0 5.657l.828.83L2.243 45.167l-2.243-2.24v2.827zm0 5.657l.828.83L2.243 50.824l-2.243-2.24v2.827zm0 5.657l.828.83L2.243 56.48l-2.243-2.24v2.827z\" fill=\"%239C92AC\" fill-opacity=\"0.05\" fill-rule=\"evenodd\"%3E%3C/path%3E%3C/svg%3E')] opacity-20"></div>
      
      <div className="max-w-md mx-auto pt-6">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <Image 
              src="/lovable-uploads/7df5a136-61a4-44f2-9ee5-f2450d605dac.png" 
              alt="Picker Logo" 
              className="w-16 h-16 rounded-full shadow-lg border-2 border-white/20"
            />
          </div>
          <div className="flex gap-2">
            <WalletComponent />
            <Button 
              variant="ghost" 
              className="text-white/90 hover:text-white"
              onClick={signOut}
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
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg px-8 py-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
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
