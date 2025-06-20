
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Gamepad2, Smartphone, Mail, Lock } from 'lucide-react';
import Image from '@/components/ui/image';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [isPhoneAuth, setIsPhoneAuth] = useState(false);
  const { supabase } = useAuth();
  const { toast } = useToast();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { error } = isSignUp 
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });

      if (error) throw error;

      toast({
        title: "Success!",
        description: isSignUp 
          ? "Account created successfully! Please check your email for verification." 
          : "Logged in successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Authentication failed",
        variant: "destructive",
      });
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone || phone.trim() === '') {
      toast({
        title: "Error",
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { error: otpError } = await supabase.auth.signInWithOtp({
        phone: phone,
      });

      if (otpError) throw otpError;

      toast({
        title: "Success!",
        description: "A verification code has been sent to your phone.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send OTP. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1F2C] to-[#403E43] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Gaming background elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      {/* Circuit pattern lines */}
      <div className="absolute top-1/4 w-full h-px circuit-line"></div>
      <div className="absolute top-3/4 w-full h-px circuit-line"></div>
      <div className="absolute left-1/4 h-full w-px circuit-line"></div>
      <div className="absolute left-3/4 h-full w-px circuit-line"></div>
      
      {/* Animated glowing orbs */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <Card className="w-full max-w-md p-8 space-y-6 border-0 pixel-corners gaming-glow bg-black/50 backdrop-blur-xl text-white shadow-[0_0_15px_rgba(99,102,241,0.2)]">
        <div className="flex flex-col items-center space-y-4 mb-6">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-purple-500/50 shadow-[0_0_10px_rgba(139,92,246,0.5)]">
            <Image 
              src="/lovable-uploads/7df5a136-61a4-44f2-9ee5-f2450d605dac.png" 
              alt="Picker Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-500 to-purple-600">
            Picker
          </h1>
          <p className="text-white/60 text-sm">Select beyond luck</p>
        </div>

        {isPhoneAuth ? (
          <form onSubmit={handlePhoneSubmit} className="space-y-4">
            <div className="relative">
              <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/30 w-5 h-5" />
              <Input
                type="tel"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="pl-10 w-full bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-purple-500/50"
              />
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-2 px-4 transition-all duration-300">
              <Gamepad2 className="w-5 h-5 mr-2" />
              Send OTP Code
            </Button>
            <button
              type="button"
              onClick={() => setIsPhoneAuth(false)}
              className="w-full text-white/60 hover:text-white text-sm mt-4"
            >
              Use Email Instead
            </button>
          </form>
        ) : (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/30 w-5 h-5" />
              <Input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 w-full bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-purple-500/50"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/30 w-5 h-5" />
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 w-full bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-purple-500/50"
              />
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-2 px-4 transition-all duration-300">
              <Gamepad2 className="w-5 h-5 mr-2" />
              {isSignUp ? 'Sign Up' : 'Login'}
            </Button>
            <div className="flex justify-between items-center mt-4 text-sm">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-white/60 hover:text-white"
              >
                {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
              </button>
              <button
                type="button"
                onClick={() => setIsPhoneAuth(true)}
                className="text-white/60 hover:text-white"
              >
                Use Phone Instead
              </button>
            </div>
          </form>
        )}
        
        <div className="flex justify-center">
          <div className="w-10 h-1 bg-white/10 rounded-full"></div>
        </div>
      </Card>
    </div>
  );
};

export default Auth;
