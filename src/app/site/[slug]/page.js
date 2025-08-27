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

export default function SitePage() {
  const params = useParams();
  const { slug } = params;
  const [siteData, setSiteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWebsiteData = async () => {
      try {
        const response = await apiService.getPublishedWebsite(slug);
        setSiteData(response.website);
      } catch (error) {
        console.error('Error fetching website:', error);
        setError('Website not found or not published');
      } finally {
        setLoading(false);
      }
    };

    fetchWebsiteData();
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
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Website Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'This website does not exist or is not published.'}</p>
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
