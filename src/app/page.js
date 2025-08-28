'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LandingPage from '@/components/LandingPage';

export default function HomePage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if we're on a subdomain or custom domain
    const checkDomain = async () => {
      if (typeof window !== 'undefined') {
        const host = window.location.hostname;
        const hostParts = host.split('.');
        
        // Check if this is a custom domain (not jirocash.com)
        if (!host.includes('jirocash.com') && !host.includes('localhost')) {
          console.log('🌐 Custom domain detected:', host);
          
          try {
            // Import apiService dynamically
            const apiService = (await import('@/services/api')).default;
            
            // Remove www if present
            const cleanHost = host.replace('www.', '');
            console.log('🌐 Clean hostname:', cleanHost);
            
            // Try to get site by domain
            const siteResponse = await apiService.getSiteByDomain(cleanHost);
            console.log('🌐 Site response:', siteResponse);
            
            if (siteResponse.success && siteResponse.siteSlug) {
              // Get website data by slug
              const websiteResponse = await apiService.getWebsiteBySlug(siteResponse.siteSlug);
              console.log('🌐 Website response:', websiteResponse);
              
              if (websiteResponse.success && websiteResponse.website) {
                // Redirect to custom domain page
                router.push(`/custom/${cleanHost}`);
                return;
              }
            }
          } catch (error) {
            console.error('Error checking custom domain:', error);
          }
        }
        
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

    checkDomain();
  }, [router]);

  // Show loading while checking domain
  if (isChecking) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking domain...</p>
        </div>
      </div>
    );
  }

  // Show landing page if not a subdomain
  return <LandingPage />;
}
