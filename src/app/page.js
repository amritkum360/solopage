'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LandingPage from '@/components/LandingPage';

export default function HomePage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if we're on a subdomain
    const checkSubdomain = () => {
      if (typeof window !== 'undefined') {
        const host = window.location.hostname;
        const hostParts = host.split('.');
        
        // If we have more than 2 parts (e.g., sonu.jirocash.com), it's a subdomain
        if (hostParts.length > 2) {
          const subdomain = hostParts[0];
          
          // Skip if it's www or other reserved subdomains
          if (subdomain !== 'www' && subdomain !== 'api' && subdomain !== 'jirocash') {
            console.log('🌐 Subdomain detected, redirecting to:', `/site/${subdomain}`);
            
            // Clean up URL first
            const currentPath = window.location.pathname;
            if (currentPath.startsWith('/site/')) {
              const newUrl = `https://${window.location.host}`;
              window.history.replaceState({}, '', newUrl);
              console.log('🧹 Cleaned up URL from:', currentPath, 'to:', newUrl);
            }
            
            router.push(`/site/${subdomain}`);
            return;
          }
        }
      }
      setIsChecking(false);
    };

    checkSubdomain();
  }, [router]);

  // Show loading while checking subdomain
  if (isChecking) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking subdomain...</p>
        </div>
      </div>
    );
  }

  // Show landing page if not a subdomain
  return <LandingPage />;
}
