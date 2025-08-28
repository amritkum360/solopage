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
    const fetchCustomDomainData = async () => {
      try {
        setLoading(true);
        const domain = params.domain;
        
        console.log('🌐 Fetching custom domain data for:', domain);
        
        const data = await apiService.getWebsiteByCustomDomain(domain);
        
        console.log('🌐 Custom domain API response:', data);
        
        if (data.success && data.website) {
          setSiteData(data.website);
        } else {
          setError(data.message || 'Website not found for this domain');
        }
      } catch (err) {
        console.error('Custom domain fetch error:', err);
        setError('Failed to load website');
      } finally {
        setLoading(false);
      }
    };

    if (params.domain) {
      fetchCustomDomainData();
    }
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
            Custom Domain: {params.domain}
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
            No website found for domain: {params.domain}
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
        Custom Domain: {params.domain} | Template: {siteData.template}
      </div>
      
      {renderTemplate()}
    </div>
  );
}
