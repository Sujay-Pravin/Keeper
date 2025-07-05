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

const KeyForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    key_value: '',
    web_link: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
    setSuccess('');
    
    // Basic validation
    if (!formData.title || !formData.key_value) {
      setError('Key name and key value are required');
      return;
    }

    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication required. Please log in again.');
        navigate('/');
        return;
      }
      
      const response = await fetch('http://localhost:5000/api/keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess('API key created successfully!');
        // Clear form
        setFormData({
          title: '',
          key_value: '',
          web_link: ''
        });
        
        // Dispatch an event to inform KeyTable to refresh
        window.dispatchEvent(new CustomEvent('keyCreated'));
      } else {
        setError(data.message || 'Failed to create API key');
      }
    } catch (err) {
      setError('Server error. Please try again.');
      console.error('Create API key error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <Card className="w-full max-w-sm bg-transparent text-3xl border-none shadow-none">
        <CardHeader>
          <CardTitle>Add your key</CardTitle>
          <CardDescription>
            Enter your credentials below to create a key
          </CardDescription>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          {success && <div className="text-green-500 text-sm mt-2">{success}</div>}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="title">KEY NAME</Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Open AI Key"
                  required
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="key_value">KEY</Label>
                </div>
                <Input
                  id="key_value"
                  type="password"
                  required
                  placeholder="Your API..."
                  value={formData.key_value}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="web_link">Web link</Label>
                </div>
                <Input
                  id="web_link"
                  type="text"
                  placeholder="www.open.ai.com [OPTIONAL]"
                  value={formData.web_link}
                  onChange={handleChange}
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button 
            type="submit" 
            className="w-full"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Create Key'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default KeyForm;
