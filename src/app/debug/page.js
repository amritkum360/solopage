'use client';

import { useEffect, useState } from 'react';
import apiService from '@/services/api';

export default function DebugPage() {
  const [customDomains, setCustomDomains] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomDomains = async () => {
      try {
        setLoading(true);
        const data = await apiService.debugCustomDomains();
        setCustomDomains(data);
      } catch (error) {
        console.error('Debug error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomDomains();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Custom Domains Debug</h1>
      
      {customDomains && (
        <div>
          <p>Total custom domains: {customDomains.count}</p>
          
          <div className="mt-4">
            {customDomains.websites.map((website, index) => (
              <div key={index} className="border p-4 mb-2 rounded">
                <p><strong>ID:</strong> {website.id}</p>
                <p><strong>Slug:</strong> {website.slug}</p>
                <p><strong>Custom Domain:</strong> {website.customDomain}</p>
                <p><strong>Published:</strong> {website.isPublished ? 'Yes' : 'No'}</p>
                <p><strong>Template:</strong> {website.template}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
