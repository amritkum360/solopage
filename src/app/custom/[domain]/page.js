'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import apiService from '@/services/api';
import BusinessTemplate from '@/components/templates/BusinessTemplate';
import PersonalTemplate from '@/components/templates/PersonalTemplate';
import PortfolioTemplate from '@/components/templates/PortfolioTemplate';
import LocalBusinessTemplate from '@/components/templates/LocalBusinessTemplate';

export default function CustomDomainPage() {
  const params = useParams();
  const [siteData, setSiteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get the current hostname
        const hostname = window.location.hostname;
        console.log('🌐 Current hostname:', hostname);
        console.log('🌐 Params domain:', params.domain);
        
        // Try to get site by domain
        const siteResponse = await apiService.getSiteByDomain(hostname);
        console.log('🌐 Site response:', siteResponse);
        
        if (siteResponse.success && siteResponse.siteSlug) {
          // Get website data by slug
          const websiteResponse = await apiService.getWebsiteBySlug(siteResponse.siteSlug);
          console.log('🌐 Website response:', websiteResponse);
          
          if (websiteResponse.success && websiteResponse.website) {
            setSiteData(websiteResponse.website);
            return;
          }
        }
        
        setError('Website not found for this domain');
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to load website');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.domain]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading website...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Website Not Found</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">
            Hostname: {typeof window !== 'undefined' ? window.location.hostname : 'Unknown'}
          </p>
        </div>
      </div>
    );
  }

  if (!siteData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Website Not Found</h1>
          <p className="text-gray-600">
            No website found for this domain
          </p>
        </div>
      </div>
    );
  }

  // Render the appropriate template based on siteData.template
  const renderTemplate = () => {
    switch (siteData.template) {
      case 'business':
        return <BusinessTemplate data={siteData} />;
      case 'personal':
        return <PersonalTemplate data={siteData} />;
      case 'portfolio':
        return <PortfolioTemplate data={siteData} />;
      case 'local-business':
        return <LocalBusinessTemplate data={siteData} />;
      default:
        return <PersonalTemplate data={siteData} />;
    }
  };

  return (
    <div>
      {/* Debug info - remove in production */}
      <div className="fixed top-0 left-0 bg-black text-white p-2 text-xs z-50">
        Hostname: {typeof window !== 'undefined' ? window.location.hostname : 'Unknown'} | Template: {siteData.template}
      </div>
      
      {renderTemplate()}
    </div>
  );
}
