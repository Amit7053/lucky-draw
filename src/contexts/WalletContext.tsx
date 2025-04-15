
import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface WalletContextType {
  balance: number;
  isLoading: boolean;
  addMoney: (amount: number) => Promise<void>;
  placeBet: (amount: number) => Promise<boolean>;
  refreshBalance: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const refreshBalance = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('wallets')
      .select('balance')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching wallet:', error);
      return;
    }

    setBalance(data.balance);
  };

  const addMoney = async (amount: number) => {
    if (!user) return;
    
    const { error } = await supabase.from('transactions').insert({
      user_id: user.id,
      amount: amount * 100, // Convert to paisa
      type: 'deposit'
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add money to wallet",
        variant: "destructive",
      });
      return;
    }

    await refreshBalance();
    toast({
      title: "Success",
      description: `Added ₹${amount} to your wallet`,
    });
  };

  const placeBet = async (amount: number) => {
    if (!user) return false;
    
    if (balance < amount * 100) {
      toast({
        title: "Insufficient Balance",
        description: "Please add money to your wallet",
        variant: "destructive",
      });
      return false;
    }

    const { error } = await supabase.from('transactions').insert({
      user_id: user.id,
      amount: -amount * 100, // Convert to paisa (negative for bets)
      type: 'bet'
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to place bet",
        variant: "destructive",
      });
      return false;
    }

    await refreshBalance();
    return true;
  };

  useEffect(() => {
    if (user) {
      refreshBalance().then(() => setIsLoading(false));
    }
  }, [user]);

  return (
    <WalletContext.Provider value={{
      balance: balance / 100, // Convert from paisa to rupees
      isLoading,
      addMoney,
      placeBet,
      refreshBalance
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
