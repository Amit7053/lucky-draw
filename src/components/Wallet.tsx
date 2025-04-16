
import { useState } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Wallet } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function WalletComponent() {
  const { balance, addMoney } = useWallet();
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState('');

  const handleAddMoney = async () => {
    console.log("Adding money...", amount);
    const parsedAmount = parseInt(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;
    
    await addMoney(parsedAmount);
    setAmount('');
    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20">
          <Wallet className="h-4 w-4" />
          ₹{balance.toFixed(2)}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-gradient-to-br from-[#232733] to-[#343540] text-white border-white/10">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">Add Money to Wallet</AlertDialogTitle>
          <div className="py-4">
            <div className="mb-4 text-sm text-gray-300">
              Current Balance: ₹{balance.toFixed(2)}
            </div>
            <Input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              className="mb-4 bg-white/10 border-white/20 text-white"
            />
            <Button onClick={handleAddMoney} className="w-full bg-blue-600 hover:bg-blue-700">
              Add Money
            </Button>
          </div>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}
