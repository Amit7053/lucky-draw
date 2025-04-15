
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Card } from '@/components/ui/card';

const Auth = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const { signInWithGoogle, signInWithPhone, verifyOTP } = useAuth();
  const { toast } = useToast();

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithPhone(phone);
      setShowOtpInput(true);
      toast({
        title: "OTP Sent!",
        description: "Please check your phone for the verification code.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await verifyOTP(phone, otp);
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
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-yellow-300 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 space-y-6 bg-white/90 backdrop-blur-sm shadow-xl">
        <h1 className="text-3xl font-bold text-center text-yellow-800">Lucky Dice Login</h1>
        
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

        {!showOtpInput ? (
          <form onSubmit={handlePhoneSubmit} className="space-y-4">
            <div>
              <Input
                type="tel"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full"
              />
            </div>
            <Button type="submit" className="w-full bg-yellow-600 hover:bg-yellow-700">
              Send OTP
            </Button>
          </form>
        ) : (
          <form onSubmit={handleOtpVerify} className="space-y-4">
            <Input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full"
            />
            <Button type="submit" className="w-full bg-yellow-600 hover:bg-yellow-700">
              Verify OTP
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
};

export default Auth;
