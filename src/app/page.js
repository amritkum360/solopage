'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Import components
import LandingPage from '@/components/LandingPage';
import Header from '@/components/Header';

// Import API service
import apiService from '@/services/api';

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');

      if (token && userData) {
        try {
          const response = await apiService.getCurrentUser();
          setUser(response.user);
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      }
    };
    checkAuth();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showDashboardButton={true} />
      <LandingPage />
    </div>
  );
}
