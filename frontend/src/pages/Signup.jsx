import {
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
import signup from '../assets/signup.jpg'
import { CardHorizontal } from "../components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { AnimatedContainer } from "@/components/ui/animated-container";
import { GradientBackdrop } from "@/components/ui/backdrop";
import { toast } from "sonner";
import { motion } from "framer-motion";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    password: '',
    cpassword: '',
    pin: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const validateForm = () => {
    if (formData.password !== formData.cpassword) {
      setError('Passwords do not match');
      toast.error("Passwords do not match");
      return false;
    }

    if (!/^\d{4}$/.test(formData.pin)) {
      setError('PIN must be exactly 4 digits');
      toast.error("PIN must be exactly 4 digits");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Remove confirm password from payload
      const { cpassword, ...payload } = formData;
      
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Store token in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        toast.success("Registration successful!");
        navigate('/home');
      } else {
        setError(data.message || 'Registration failed');
        toast.error(data.message || "Registration failed");
      }
    } catch (err) {
      setError('Server error. Please try again.');
      toast.error("Server error. Please try again.");
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GradientBackdrop 
      className="flex justify-center h-screen items-center"
      gradientFrom="from-blue-500" 
      gradientTo="to-indigo-600"
    >
      <AnimatedContainer animation="scaleIn" className="flex justify-center h-full items-center">
        <CardHorizontal className="p-10 w-auto h-auto flex bg-background/90 backdrop-blur-sm shadow-lg rounded-xl border border-slate-200/20">
          <AnimatedContainer animation="slideInRight" delay={0.1} className="flex items-center">
            <motion.img 
              src={signup} 
              className="h-full max-h-[600px] w-auto object-contain rounded-xl"
              alt="Sign up"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            />
          </AnimatedContainer>
          <AnimatedContainer animation="slideUp" delay={0.2}>
            <Card className="w-full h-full flex-col bg-background/50 backdrop-blur-sm border-slate-200/50">
              <CardHeader>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  SignUp to your account
                </CardTitle>
                <CardDescription>Enter your details below to SignUp</CardDescription>
                {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-col gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="full_name">Name</Label>
                      <Input 
                        id="full_name" 
                        type="text" 
                        placeholder="Your Name" 
                        required 
                        value={formData.full_name}
                        onChange={handleChange}
                        className="border border-slate-200/50 focus:border-blue-500"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="username">UserName</Label>
                      <Input
                        id="username"
                        type="text"
                        placeholder="YourUserName_"
                        required
                        value={formData.username}
                        onChange={handleChange}
                        className="border border-slate-200/50 focus:border-blue-500"
                      />
                    </div>
                    <div className="grid gap-2">
                      <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        placeholder="YourPassword..."
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="border border-slate-200/50 focus:border-blue-500"
                      />
                    </div>
                    <div className="grid gap-2">
                      <div className="flex items-center">
                        <Label htmlFor="cpassword">Confirm Password</Label>
                      </div>
                      <Input
                        id="cpassword"
                        type="password"
                        placeholder="Retype your password"
                        required
                        value={formData.cpassword}
                        onChange={handleChange}
                        className="border border-slate-200/50 focus:border-blue-500"
                      />
                    </div>
                    <div className="grid gap-2">
                      <div className="flex items-center">
                        <Label htmlFor="pin">Pin</Label>
                      </div>
                      <Input
                        id="pin"
                        type="text"
                        placeholder="Type your pin [4-digit]"
                        required
                        maxLength={4}
                        pattern="\d{4}"
                        value={formData.pin}
                        onChange={handleChange}
                        className="border border-slate-200/50 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex-col gap-2">
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Spinner size="xs" variant="beat" color="white" />
                      <span>Signing up...</span>
                    </div>
                  ) : 'SignUp'}
                </Button>
                <CardDescription>
                  Already have an account?
                  <Button
                    variant="link"
                    onClick={() => navigate("/")}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Login
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

export default SignUp;
