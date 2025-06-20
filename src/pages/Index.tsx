import React, { useState, useCallback, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Coin from '@/components/Dice';
import History from '@/components/History';
import { useAuth } from '@/contexts/AuthContext';
import { useWallet } from '@/contexts/WalletContext';
import { Coins } from 'lucide-react';
import WalletComponent from '@/components/Wallet';
import ProfileManager from '@/components/ProfileManager';

const Index = () => {
  const [diceValue, setDiceValue] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [history, setHistory] = useState<number[]>([]);
  const [betAmount, setBetAmount] = useState(5);
  const [selectedNumber, setSelectedNumber] = useState("H");
  const { toast } = useToast();
  const { signOut } = useAuth();
  const { placeBet, refreshBalance } = useWallet();
  
  useEffect(() => {
    refreshBalance();
  }, [refreshBalance]);

  const handleSignOut = () => {
    console.log("Signing out...");
    signOut();
  };

  const rollDice = useCallback(async () => {
    if (isRolling) return;
    
    const betPlaced = await placeBet(betAmount);
    if (!betPlaced) return;
    
    setIsRolling(true);
    const result = selectedNumber === "H" ? 1 : 2; // 1 for Heads, 2 for Tails
    
    setTimeout(() => {
      setDiceValue(result);
      setHistory(prev => [result, ...prev].slice(0, 10));
      setIsRolling(false);
      toast({
        title: "🪙 Coin Flip!",
        description: `It's ${result === 1 ? 'Heads' : 'Tails'}!`,
      });
    }, 1000);
  }, [isRolling, toast, placeBet, betAmount, selectedNumber]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1F2C] to-[#403E43] p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 left-1/3 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="absolute inset-0" style={{
        backgroundImage: `
          linear-gradient(to right, rgba(59, 130, 246, 0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(59, 130, 246, 0.05) 1px, transparent 1px)
        `,
        backgroundSize: '30px 30px'
      }}></div>
      
      <div className="max-w-md mx-auto pt-6 relative z-10">
        <div className="flex justify-between items-center mb-8">
          <WalletComponent />
          <div className="flex gap-2">
            <ProfileManager />
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-8 glass p-8 rounded-2xl backdrop-blur-lg border border-white/10 relative">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-indigo-500/5"></div>
          
          <div className="relative z-10">
            <Coin value={diceValue} isRolling={isRolling} />
          </div>
          
          <div className="w-full space-y-6 relative z-10">
            <div className="flex justify-center gap-3 items-center">
              <p className="text-white/80 text-xs mr-2">Pick:</p>
              {[
                { value: "H", label: "Heads" },
                { value: "T", label: "Tails" }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedNumber(option.value)}
                  className={`w-20 h-10 rounded-full flex items-center justify-center transition-all duration-200
                    ${selectedNumber === option.value 
                      ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white shadow-lg scale-110' 
                      : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            
            <div className="w-full max-w-xs mx-auto space-y-4">
              <Input
                type="number"
                min="1"
                value={betAmount}
                onChange={(e) => setBetAmount(Math.max(1, parseInt(e.target.value) || 0))}
                className="mb-4 bg-white/10 border-white/20 text-white"
                placeholder="Enter bet amount"
              />
              
              <Button 
                onClick={rollDice}
                disabled={isRolling}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold text-lg px-8 py-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
              >
                {isRolling ? 'Rolling...' : `Roll Dice (₹${betAmount})`}
              </Button>
            </div>
          </div>

          <div className="relative z-10 w-full">
            <History rolls={history} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
