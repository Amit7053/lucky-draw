
import React, { useState, useCallback, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Dice from '@/components/Dice';
import History from '@/components/History';
import { useAuth } from '@/contexts/AuthContext';
import { useWallet } from '@/contexts/WalletContext';
import { LogOut, Circle } from 'lucide-react';
import WalletComponent from '@/components/Wallet';
import Image from '@/components/ui/image';

const Index = () => {
  const [diceValue, setDiceValue] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [history, setHistory] = useState<number[]>([]);
  const [betAmount, setBetAmount] = useState(5);
  const [selectedNumber, setSelectedNumber] = useState("1");
  const { toast } = useToast();
  const { signOut } = useAuth();
  const { placeBet, refreshBalance } = useWallet();
  
  // Ensure wallet is up to date
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
    const newValue = parseInt(selectedNumber);
    
    setTimeout(() => {
      setDiceValue(newValue);
      setHistory(prev => [newValue, ...prev].slice(0, 10));
      setIsRolling(false);
      toast({
        title: "🎲 New Roll!",
        description: `You rolled a ${newValue}!`,
      });
    }, 1000);
  }, [isRolling, toast, placeBet, betAmount, selectedNumber]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1F2C] to-[#403E43] p-4 relative overflow-hidden">
      {/* Gaming background images */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 left-1/3 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>
      
      {/* Gaming circuit lines */}
      <div className="absolute inset-0" style={{
        backgroundImage: `
          linear-gradient(to right, rgba(59, 130, 246, 0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(59, 130, 246, 0.05) 1px, transparent 1px)
        `,
        backgroundSize: '30px 30px'
      }}></div>
      
      <div className="max-w-md mx-auto pt-6 relative z-10">
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
              className="text-white/90 hover:bg-white/20 hover:text-white transition-colors"
              onClick={handleSignOut}
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-8 glass p-8 rounded-2xl backdrop-blur-lg border border-white/10 relative">
          {/* Glowing effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-indigo-500/5"></div>
          
          <div className="relative z-10">
            <Dice value={diceValue} isRolling={isRolling} />
          </div>
          
          <div className="flex gap-4 relative z-10">
            {/* Number selection circles column */}
            <div className="flex flex-col gap-2 items-center">
              <p className="text-white/80 text-xs mb-1">Pick</p>
              {[1, 2, 3, 4, 5, 6].map((number) => (
                <button
                  key={number}
                  onClick={() => setSelectedNumber(number.toString())}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200
                    ${selectedNumber === number.toString() 
                      ? 'bg-gradient-to-br from-purple-600 to-blue-700 text-white shadow-lg scale-110' 
                      : 'bg-white/10 text-white/70 hover:bg-white/20'}`}
                >
                  <Circle className="w-5 h-5" />
                  <span className="absolute font-bold text-sm">{number}</span>
                </button>
              ))}
            </div>
            
            <div className="w-full max-w-xs space-y-4">
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
