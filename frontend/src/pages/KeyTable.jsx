import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

const KeyTable = () => {
  const navigate = useNavigate();
  const [keys, setKeys] = useState([]);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [currentKeyId, setCurrentKeyId] = useState(null);
  const [pin, setPin] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [copyMessage, setCopyMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [keyToDelete, setKeyToDelete] = useState(null);

  // Fetch API keys from the server
  const fetchKeys = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/');
        return;
      }
      
      const response = await fetch('http://localhost:5000/api/keys', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });

      if (response.status === 401) {
        // Unauthorized, redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
        return;
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Map server data to component state format
        const formattedKeys = data.keys.map(key => ({
          id: key.id,
          name: key.title,
          key: key.key_value || "••••••••••••••••••", // Initially masked
          webLink: key.web_link || "",
          isVisible: false
        }));
        
        setKeys(formattedKeys);
      }
    } catch (error) {
      console.error('Error fetching API keys:', error);
    } finally {
      setLoading(false);
    }
  };

  // Listen for key creation events
  useEffect(() => {
    fetchKeys();
    
    // Listen for keyCreated event
    window.addEventListener('keyCreated', fetchKeys);
    
    return () => {
      window.removeEventListener('keyCreated', fetchKeys);
    };
  }, []);

  const handleViewClick = (keyId) => {
    const keyItem = keys.find((k) => k.id === keyId);

    // Toggle visibility if already visible
    if (keyItem.isVisible) {
      setKeys(
        keys.map((key) =>
          key.id === keyId ? { ...key, isVisible: false } : key
        )
      );
      return;
    }

    // Otherwise open modal for PIN verification
    setCurrentKeyId(keyId);
    setIsPinModalOpen(true);
    setPin("");
    setErrorMessage("");
  };

  const handlePinSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setErrorMessage('Authentication required. Please log in again.');
        return;
      }
      
      const response = await fetch(`http://localhost:5000/api/keys/${currentKeyId}/reveal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ pin }),
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        // Update the key in the state
        setKeys(
          keys.map((key) =>
            key.id === currentKeyId ? { 
              ...key, 
              key: data.key.key_value, 
              isVisible: true 
            } : key
          )
        );
        setIsPinModalOpen(false);
      } else {
        setErrorMessage(data.message || 'PIN verification failed');
      }
    } catch (error) {
      console.error('PIN verification error:', error);
      setErrorMessage('Server error. Please try again.');
    }
  };

  const handleDeleteClick = (keyId) => {
    setKeyToDelete(keyId);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        return;
      }
      
      const response = await fetch(`http://localhost:5000/api/keys/${keyToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });
      
      if (response.ok) {
        // Remove the key from state
        setKeys(keys.filter(key => key.id !== keyToDelete));
        setCopyMessage("API key deleted successfully!");
        setTimeout(() => setCopyMessage(""), 2000);
      } else {
        const data = await response.json();
        setCopyMessage(data.message || "Failed to delete API key");
        setTimeout(() => setCopyMessage(""), 2000);
      }
    } catch (error) {
      console.error('Delete API key error:', error);
      setCopyMessage("Failed to delete API key");
      setTimeout(() => setCopyMessage(""), 2000);
    } finally {
      setDeleteConfirmOpen(false);
      setKeyToDelete(null);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handlePinSubmit();
    }
  };

  const maskApiKey = (key) => {
    if (!key || key === "••••••••••••••••••") return "••••••••••••••••••";
    return key.substring(0, 4) + "..." + key.substring(key.length - 4);
  };

  // Function to copy text to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopyMessage("Copied to clipboard!");
        // Clear the message after 2 seconds
        setTimeout(() => setCopyMessage(""), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        setCopyMessage("Failed to copy");
        setTimeout(() => setCopyMessage(""), 2000);
      });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full">Loading...</div>;
  }

  return (
    <div className="w-full h-full relative overflow-auto">
      <div className="min-w-full">
        {copyMessage && (
          <div className="absolute top-0 right-0 bg-green-100 text-green-800 px-4 py-2 rounded-md shadow-md z-10">
            {copyMessage}
          </div>
        )}
        <Table className="text-1xl text-inherit border-collapse">
          <TableCaption>A list of your keys</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[20%] p-2 text-primary">Key Name</TableHead>
              <TableHead className="w-[40%] p-2 text-primary">KEY</TableHead>
              <TableHead className="w-[20%] p-2 text-primary">Web Link</TableHead>
              <TableHead className="w-[20%] p-2 text-primary">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {keys.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  No API keys found. Create one using the form on the left.
                </TableCell>
              </TableRow>
            ) : (
              keys.map((keyItem) => (
                <TableRow key={keyItem.id}>
                  <TableCell className="font-medium p-2">
                    {keyItem.name}
                  </TableCell>
                  <TableCell className="p-2">
                    <div
                      className={`overflow-x-auto whitespace-nowrap pr-2 scrollbar-width-none ${
                        keyItem.isVisible
                          ? "cursor-pointer hover:bg-gray-100 rounded"
                          : ""
                      }`}
                      style={{ maxWidth: "260px" }}
                      onClick={() =>
                        keyItem.isVisible && copyToClipboard(keyItem.key)
                      }
                      title={keyItem.isVisible ? "Click to copy" : ""}
                    >
                      {keyItem.isVisible ? keyItem.key : maskApiKey(keyItem.key)}
                    </div>
                  </TableCell>
                  <TableCell className="p-2">{keyItem.webLink}</TableCell>
                  <TableCell className="p-2">
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleViewClick(keyItem.id)}
                        variant={keyItem.isVisible ? "outline" : "default"}
                        size="sm"
                      >
                        {keyItem.isVisible ? "Hide" : "View"}
                      </Button>
                      <Button
                        onClick={() => handleDeleteClick(keyItem.id)}
                        variant="destructive"
                        size="sm"
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* PIN Verification Modal */}
        {isPinModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-sm">
            <Card className="w-full max-w-sm p-6 bg-background shadow-lg">
              <h3 className="text-lg font-semibold mb-4">
                Enter PIN to View Key
              </h3>
              <div className="space-y-4">
                <Input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handlePinSubmit()}
                  placeholder="Enter PIN"
                  className="w-full"
                  maxLength={4}
                  autoFocus
                />
                {errorMessage && (
                  <p className="text-destructive text-sm">{errorMessage}</p>
                )}
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsPinModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handlePinSubmit}>Submit</Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-sm">
            <Card className="w-full max-w-sm p-6 bg-background shadow-lg">
              <h3 className="text-lg font-semibold mb-4">
                Confirm Deletion
              </h3>
              <p className="mb-4">Are you sure you want to delete this API key? This action cannot be undone.</p>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setDeleteConfirmOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={confirmDelete}
                >
                  Delete
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default KeyTable;
