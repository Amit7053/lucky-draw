
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';

const Auth = () => {
  const [phone, setPhone] = useState('');
  const { signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const { supabase } = useAuth();

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        phone: phone,
        password: phone // Using phone number as password for simplicity
      });

      if (error) {
        // If user doesn't exist, create one
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          phone: phone,
          password: phone,
        });

        if (signUpError) throw signUpError;
      }

      toast({
        title: "Success!",
        description: "You have successfully logged in.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-300 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 space-y-6 bg-white/90 backdrop-blur-sm shadow-xl">
        <h1 className="text-3xl font-bold text-center text-green-800">Lucky Dice Login</h1>
        
        <Button 
          onClick={signInWithGoogle}
          className="w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
        >
          Continue with Google
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with phone</span>
          </div>
        </div>

        <form onSubmit={handlePhoneSubmit} className="space-y-4">
          <Input
            type="tel"
            placeholder="Enter phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full"
          />
          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
            Login with Phone
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Auth;
