'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  PortfolioTemplate, 
  BusinessTemplate, 
  PersonalTemplate,
  LocalBusinessTemplate
} from '@/components/templates';
import apiService from '@/services/api';

export default function SitePage() {
  const params = useParams();
  const router = useRouter();
  const { slug } = params;
  const [siteData, setSiteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [detectedSlug, setDetectedSlug] = useState('');

  useEffect(() => {
    // Detect subdomain from hostname
    const detectSubdomain = () => {
      if (typeof window !== 'undefined') {
        const host = window.location.hostname;
        const hostParts = host.split('.');
        
        // If we have more than 2 parts (e.g., sonu.jirocash.com), extract subdomain
        if (hostParts.length > 2) {
          const subdomain = hostParts[0];
          console.log('🌐 Detected subdomain:', subdomain);
          return subdomain;
        }
      }
      return null;
    };

    const subdomain = detectSubdomain();
    const finalSlug = subdomain || slug;
    
    console.log('🎯 Final slug to use:', finalSlug);
    setDetectedSlug(finalSlug);

    // If we're on a subdomain and the URL shows /site/, clean it up
    if (subdomain && typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      if (currentPath.startsWith('/site/')) {
        // Update URL without the /site/ part
        const newUrl = `https://${window.location.host}`;
        window.history.replaceState({}, '', newUrl);
        console.log('🧹 Cleaned up URL from:', currentPath, 'to:', newUrl);
      }
    }

    const fetchWebsiteData = async () => {
      try {
        console.log('Fetching website for slug:', finalSlug);
        const response = await apiService.getPublishedWebsite(finalSlug);
        console.log('Website data received:', response);
        setSiteData(response.website);
      } catch (error) {
        console.error('Error fetching website:', error);
        if (error.message.includes('not found')) {
          setError('Website not found or not published');
        } else if (error.message.includes('network')) {
          setError('Network error: Please check if the backend server is running');
        } else {
          setError('Website not found or not published');
        }
      } finally {
        setLoading(false);
      }
    };

    if (finalSlug) {
      fetchWebsiteData();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading website...</p>
        </div>
      </div>
    );
  }

  if (error || !siteData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Website Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'This website does not exist or is not published.'}</p>
          
          {/* Debug Information */}
          <div className="bg-gray-50 p-4 rounded-lg mb-4 text-left">
            <p className="text-sm text-gray-600 mb-2">
              <strong>Debug Info:</strong>
            </p>
            <p className="text-xs text-gray-500 mb-1">
              URL Slug: {slug}
            </p>
            <p className="text-xs text-gray-500 mb-1">
              Detected Slug: {detectedSlug}
            </p>
            <p className="text-xs text-gray-500 mb-1">
              URL: {typeof window !== 'undefined' ? window.location.href : 'Unknown'}
            </p>
            <p className="text-xs text-gray-500">
              Host: {typeof window !== 'undefined' ? window.location.host : 'Unknown'}
            </p>
          </div>

          {/* Alternative Access Methods */}
          <div className="space-y-2 mb-4">
            <p className="text-sm text-gray-600">
              Try accessing via:
            </p>
            <div className="space-y-1">
              <a 
                href={`/site/${detectedSlug || slug}`}
                className="block text-blue-600 hover:text-blue-700 text-sm"
              >
                Direct link: /site/{detectedSlug || slug}
              </a>
              <a 
                href={`https://jirocash.com/site/${detectedSlug || slug}`}
                className="block text-blue-600 hover:text-blue-700 text-sm"
              >
                Main domain: jirocash.com/site/{detectedSlug || slug}
              </a>
            </div>
          </div>

          <Link 
            href="/" 
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {siteData.template === 'portfolio' && <PortfolioTemplate data={siteData.data} />}
      {siteData.template === 'business' && <BusinessTemplate data={siteData.data} />}
      {siteData.template === 'personal' && <PersonalTemplate data={siteData.data} />}
      {siteData.template === 'localbusiness' && <LocalBusinessTemplate data={siteData.data} />}
    </div>
  );
}
