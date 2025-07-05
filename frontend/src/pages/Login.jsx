import {
  CardHorizontal,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loginpng from '../assets/login.png'
import { Spinner } from "@/components/ui/spinner";
import { AnimatedContainer } from "@/components/ui/animated-container";
import { GradientBackdrop } from "@/components/ui/backdrop";
import { toast } from "sonner";
import { motion } from "framer-motion";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Store token in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        toast.success("Login successful!");
        navigate('/home');
      } else {
        setError(data.message || 'Login failed');
        toast.error(data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      setError('Server error. Please try again.');
      toast.error("Server error. Please try again.");
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GradientBackdrop className="flex justify-center h-screen items-center">
      <AnimatedContainer animation="scaleIn" className="flex justify-center h-full items-center">
        <CardHorizontal className="p-10 w-auto h-auto flex bg-background/90 backdrop-blur-sm shadow-lg rounded-xl border border-slate-200/20">
          <AnimatedContainer animation="slideInRight" delay={0.1} className="flex items-center">
            <motion.img 
              src={Loginpng} 
              className="h-full max-h-[600px] w-auto object-contain rounded-xl" 
              alt="Login" 
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            />
          </AnimatedContainer>
          <AnimatedContainer animation="slideUp" delay={0.2}>
            <Card className="w-full h-full min-w-10 bg-background/50 backdrop-blur-sm border-slate-200/50">
              <CardHeader>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                  Login to your account
                </CardTitle>
                <CardDescription>
                  Enter your email below to login to your account
                </CardDescription>
                {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-col gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="username">UserName</Label>
                      <Input
                        id="username"
                        type="text"
                        placeholder="YourUserName_"
                        required
                        value={formData.username}
                        onChange={handleChange}
                        className="border border-slate-200/50 focus:border-violet-500"
                      />
                    </div>
                    <div className="grid gap-2">
                      <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                      </div>
                      <Input 
                        id="password" 
                        type="password" 
                        required 
                        placeholder="YourPassword..."
                        value={formData.password}
                        onChange={handleChange}
                        className="border border-slate-200/50 focus:border-violet-500"
                      />
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex-col gap-2">
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 transition-all duration-300"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Spinner size="xs" variant="beat" color="white" />
                      <span>Logging in...</span>
                    </div>
                  ) : 'Login'}
                </Button>
                <CardDescription>
                  Want a new account?
                  <Button 
                    variant="link" 
                    onClick={() => navigate("/signup")}
                    className="text-violet-500 hover:text-violet-700"
                  >
                    Sign Up
                  </Button>
                </CardDescription>
              </CardFooter>
            </Card>
          </AnimatedContainer>
        </CardHorizontal>
      </AnimatedContainer>
    </GradientBackdrop>
  );
};

export default Login;
