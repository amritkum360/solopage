'use client';

import { useEffect, useState } from 'react';

export default function TestCustomDomain() {
  const [hostInfo, setHostInfo] = useState({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHostInfo({
        hostname: window.location.hostname,
        host: window.location.host,
        href: window.location.href,
        pathname: window.location.pathname
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Custom Domain Test Page
        </h1>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-3">
            Current Page Information:
          </h2>
          <div className="space-y-2 text-sm">
            <p><strong>Hostname:</strong> {hostInfo.hostname}</p>
            <p><strong>Host:</strong> {hostInfo.host}</p>
            <p><strong>Full URL:</strong> {hostInfo.href}</p>
            <p><strong>Pathname:</strong> {hostInfo.pathname}</p>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h2 className="text-xl font-semibold text-green-800 mb-3">
            ✅ Custom Domain Routing Working!
          </h2>
          <p className="text-green-700">
            If you can see this page, it means the custom domain routing is working correctly.
            The middleware successfully detected your custom domain and routed to this test page.
          </p>
        </div>
      </div>
    </div>
  );
}
