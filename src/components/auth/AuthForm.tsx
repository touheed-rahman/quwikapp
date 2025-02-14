import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Lock, UserPlus, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const validateForm = () => {
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return false;
    }

    if (!email.includes("@")) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return false;
    }

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return false;
    }

    if (isSignUp && !fullName) {
      toast({
        title: "Error",
        description: "Please enter your full name",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    console.log("Starting authentication process...");

    try {
      if (isSignUp) {
        console.log("Attempting signup with email:", email);
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });

        if (error) throw error;

        console.log("Signup successful:", data);
        toast({
          title: "Success!",
          description: "Please check your email to verify your account.",
        });
      } else {
        console.log("Attempting signin with email:", email);
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.message === "Invalid login credentials") {
            throw new Error("Invalid email or password. Please try again or sign up if you don't have an account.");
          }
          throw error;
        }

        console.log("Signin successful:", data);
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });
        navigate("/");
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">{isSignUp ? "Create an Account" : "Welcome Back"}</h1>
        <p className="text-muted-foreground">
          {isSignUp
            ? "Sign up to start selling and buying items"
            : "Sign in to access your account"}
        </p>
      </div>

      <form onSubmit={handleAuth} className="space-y-4">
        {isSignUp && (
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <div className="relative">
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required={isSignUp}
                className="pl-10"
              />
              <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="pl-10"
            />
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pl-10"
            />
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            "Loading..."
          ) : isSignUp ? (
            <>
              <UserPlus className="mr-2 h-4 w-4" /> Sign Up
            </>
          ) : (
            <>
              <LogIn className="mr-2 h-4 w-4" /> Sign In
            </>
          )}
        </Button>
      </form>

      <div className="text-center">
        <Button
          variant="link"
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-primary"
        >
          {isSignUp ? "Already have an account? Sign In" : "Need an account? Sign Up"}
        </Button>
      </div>
    </div>
  );
};

export default AuthForm;