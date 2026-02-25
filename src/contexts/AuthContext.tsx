import { apiService } from '@/api/apiService';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface User {
  id?: string;
  _id?: string;
  email: string;
  userName: string;
  role: string;
  password?: string;
  avatar?: string;
  bio?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, userName: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);


const login = async (email, password) => {
  try {
    const { data, error } = await apiService.login({ email, password });
    if (error) throw new Error(error);
    const { user, token } = data; // from backend
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    setUser(user);
    toast.success("Login successful!");
    navigate("/");
  } catch (err) {
    toast.error(err.response.data.message||"Login failed");
    throw err;
  }
};


const signup = async (email, password, userName) => {
  try {
    const payload = { userName, email, password }; // match backend!
    const { data, error } = await apiService.signUp(payload);
    if (error) throw new Error(error);

    const user = data.result; // backend returns { result: user }
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
    toast.success("Account created successfully!");
    navigate("/login");
  } catch (err) {
    toast.error(err.message || "Signup failed");
    throw err;
  }
};

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    setUser(null);
    toast.success('Logged out successfully');
    navigate('/login');
  };
 
  const updateUser = (updatedUser: Partial<User>) => {
    if (user) {
      const newUser = { ...user, ...updatedUser };
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    }
  };
 
  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user, loading, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
