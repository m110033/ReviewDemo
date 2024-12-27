'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../utils/api';

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginFormData>({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState<string>('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', formData);
      const { access_token } = response.data;
      localStorage.setItem('authToken', access_token);
      router.push('/admin');
    } catch (error: unknown) {
      if (error instanceof Error && (error as any).response) {
        setErrorMessage((error as any).response?.data?.message || 'Login failed. Please check your credentials.');
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="w-80 p-4 border rounded shadow">
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm">Email</label>
          <input
            type="text"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded mt-4">
          Login
        </button>
      </form>
    </div>
  );
}
