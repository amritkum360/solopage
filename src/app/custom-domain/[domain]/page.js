'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  PortfolioTemplate, 
  BusinessTemplate, 
  PersonalTemplate,
  LocalBusinessTemplate
} from '@/components/templates';
import apiService from '@/services/api';

export default function CustomDomainPage() {
  const params = useParams();
  const { domain } = params;
  const [siteData, setSiteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCustomDomainData = async () => {
      try {
        console.log('Fetching custom domain website for:', domain);
        const response = await apiService.getWebsiteByCustomDomain(domain);
        console.log('Custom domain website data received:', response);
        setSiteData(response.website);
      } catch (error) {
        console.error('Error fetching custom domain website:', error);
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

    if (domain) {
      fetchCustomDomainData();
    }
  }, [domain]);

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
              Custom Domain: {domain}
            </p>
            <p className="text-xs text-gray-500 mb-1">
              URL: {typeof window !== 'undefined' ? window.location.href : 'Unknown'}
            </p>
            <p className="text-xs text-gray-500">
              Host: {typeof window !== 'undefined' ? window.location.host : 'Unknown'}
            </p>
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
