'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Globe, Settings, CheckCircle, AlertTriangle, RefreshCw, Info } from 'lucide-react';
import apiService from '@/services/api';
import Header from '@/components/Header';

export default function DomainsPage() {
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [domainStatuses, setDomainStatuses] = useState({});
  const [checkingDomains, setCheckingDomains] = useState({});
  const [vercelAddedDomains, setVercelAddedDomains] = useState({});
  const [vercelErrors, setVercelErrors] = useState({});
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      try {
        // Check if user is authenticated
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (!token || !userData) {
          router.push('/login');
          return;
        }

        // Get current user
        const userResponse = await apiService.getCurrentUser();
        setUser(userResponse.user);

        // Get user's websites with custom domains
        const websitesResponse = await apiService.getUserWebsites();
        const websitesWithDomains = websitesResponse.websites.filter(website => website.customDomain);
        setDomains(websitesWithDomains);
        
        // Set loading state for DNS checks
        const initialCheckingState = {};
        websitesWithDomains.forEach(website => {
          initialCheckingState[website._id] = true;
        });
        setCheckingDomains(initialCheckingState);
        
        // Check DNS status after page loads
        setTimeout(() => {
          websitesWithDomains.forEach(website => {
            checkCustomDomainStatus(website.customDomain, website._id);
          });
        }, 1000);
        
      } catch (error) {
        console.error('Domains error:', error);
        if (error.message.includes('token') || error.message.includes('unauthorized')) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          router.push('/login');
        } else {
          setError('Failed to load domains data');
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndLoadData();
  }, [router]);

  const checkCustomDomainStatus = async (domain, websiteId) => {
    try {
      setCheckingDomains(prev => ({ ...prev, [websiteId]: true }));
      const status = await apiService.checkCustomDomainStatus(domain);
      setDomainStatuses(prev => ({ ...prev, [websiteId]: status }));
      
      // Also check Vercel domain status
      await checkVercelDomainStatus(domain, websiteId);
    } catch (error) {
      console.error('Error checking domain status:', error);
      setDomainStatuses(prev => ({ ...prev, [websiteId]: { status: 'error', message: 'Failed to check status' } }));
    } finally {
      setCheckingDomains(prev => ({ ...prev, [websiteId]: false }));
    }
  };

  const checkVercelDomainStatus = async (domain, websiteId) => {
    try {
      const vercelStatus = await apiService.checkVercelDomainStatus(domain);
      
      if (vercelStatus.success && vercelStatus.domain) {
        // Domain exists in Vercel
        if (vercelStatus.domain.assignedToOtherProject) {
          // Domain is assigned to another project
          setVercelErrors(prev => ({ ...prev, [websiteId]: 'already_assigned' }));
          setVercelAddedDomains(prev => ({ ...prev, [websiteId]: false }));
        } else {
          // Domain is assigned to our project
          setVercelAddedDomains(prev => ({ ...prev, [websiteId]: true }));
          setVercelErrors(prev => ({ ...prev, [websiteId]: null }));
        }
      } else {
        // Domain not found in Vercel
        setVercelAddedDomains(prev => ({ ...prev, [websiteId]: false }));
        setVercelErrors(prev => ({ ...prev, [websiteId]: null }));
      }
    } catch (error) {
      console.error('Error checking Vercel domain status:', error);
      // If there's an error, assume domain is not added
      setVercelAddedDomains(prev => ({ ...prev, [websiteId]: false }));
      setVercelErrors(prev => ({ ...prev, [websiteId]: null }));
    }
  };

  const addCustomDomainToVercel = async (domain, websiteId) => {
    try {
      setCheckingDomains(prev => ({ ...prev, [websiteId]: true }));
      const result = await apiService.addCustomDomainToVercel(domain);
      
      // Mark as successfully added to Vercel
      setVercelAddedDomains(prev => ({ ...prev, [websiteId]: true }));
      
      // Show success message
      alert(`Domain ${domain} has been successfully added to Vercel! Please wait 24-48 hours for DNS propagation.`);
      
      // Refresh status after adding
      setTimeout(() => {
        checkCustomDomainStatus(domain, websiteId);
      }, 2000);
    } catch (error) {
      console.error('Error adding domain to Vercel:', error);
      
      // Show more specific error message
      let errorMessage = 'Failed to add domain to Vercel. Please try again.';
      if (error.message) {
        errorMessage = error.message;
      } else if (error.data && error.data.message) {
        errorMessage = error.data.message;
      }
      
      // Handle specific error cases
      if (errorMessage.includes('already assigned to another project')) {
        // Track this specific error for UI display
        setVercelErrors(prev => ({ ...prev, [websiteId]: 'already_assigned' }));
        
        const detailedMessage = `Domain ${domain} is already registered with Vercel under another project.\n\nTo fix this:\n1. Go to your Vercel dashboard\n2. Find the project that owns ${domain}\n3. Remove ${domain} from that project\n4. Then try adding it again here\n\nOr contact Vercel support if you need help.`;
        alert(detailedMessage);
      } else {
        alert(`Error: ${errorMessage}`);
      }
    } finally {
      setCheckingDomains(prev => ({ ...prev, [websiteId]: false }));
    }
  };

  const handleAddDomain = () => {
    router.push('/edit-website');
  };

  const handleManageDomain = (websiteId) => {
    router.push(`/edit-website?edit=${websiteId}`);
  };

  const getStatusIcon = (websiteId) => {
    const status = domainStatuses[websiteId];
    
    if (checkingDomains[websiteId]) {
      return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
    }
    
    if (!status) {
      return <div className="w-4 h-4 bg-gray-300 rounded-full"></div>;
    }
    
    if (status.status === 'configured') {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    }
    
    return <AlertTriangle className="h-4 w-4 text-red-600" />;
  };

  const getStatusText = (websiteId) => {
    const status = domainStatuses[websiteId];
    
    if (checkingDomains[websiteId]) {
      return 'Checking DNS...';
    }
    
    if (!status) {
      return 'Status not checked';
    }
    
    if (status.status === 'configured') {
      return 'DNS Configured Correctly';
    }
    
    return 'DNS not configured properly';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading domains...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Domain Management
          </h2>
          <p className="text-gray-600">
            Manage your custom domains and DNS settings.
          </p>
        </div>

        {/* Add Domain Button */}
        <div className="mb-8">
          <button
            onClick={handleAddDomain}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Custom Domain
          </button>
        </div>

        {/* Debug Info - Only show in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="text-sm font-medium text-yellow-800 mb-2">Debug Information (Development Only)</h3>
            <div className="text-xs text-yellow-700 space-y-1">
              <p><strong>Total Domains:</strong> {domains.length}</p>
              <p><strong>Domains with Custom Domain:</strong> {domains.filter(d => d.customDomain).length}</p>
              <p><strong>Published Domains:</strong> {domains.filter(d => d.isPublished).length}</p>
              <p><strong>Vercel Integration:</strong> Available</p>
              <p><strong>Backend URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}</p>
              <button 
                onClick={async () => {
                  try {
                    const config = await apiService.debugVercelConfig();
                    alert(`Vercel Config: ${JSON.stringify(config, null, 2)}`);
                  } catch (error) {
                    alert(`Error checking Vercel config: ${error.message}`);
                  }
                }}
                className="mt-2 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
              >
                Check Vercel Config
              </button>
            </div>
          </div>
        )}

        {/* Domains Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {domains.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="h-16 w-16 text-gray-300 mx-auto mb-4 flex items-center justify-center text-4xl">
                <Globe className="h-16 w-16" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No custom domains yet</h3>
              <p className="text-gray-600 mb-4">
                Add a custom domain to your website to get started
              </p>
              <button
                onClick={handleAddDomain}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Add Domain
              </button>
            </div>
          ) : (
            domains.map((domain) => (
              <div key={domain._id} className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="p-6">
                  {/* Domain Info */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <Globe className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {domain.customDomain}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {domain.title}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      domain.isPublished 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {domain.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>

                  {/* DNS Status */}
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      {getStatusIcon(domain._id)}
                      <span className="text-sm font-medium text-gray-700">
                        {getStatusText(domain._id)}
                      </span>
                    </div>
                    
                    {/* DNS Details */}
                    {domainStatuses[domain._id] && domainStatuses[domain._id].status !== 'configured' && (
                      <div className="text-xs text-gray-600 space-y-1">
                        {domainStatuses[domain._id].currentNameservers && (
                          <div>
                            <strong>Current Nameservers:</strong>
                            <div className="bg-gray-50 p-1 rounded font-mono text-xs mt-1">
                              {domainStatuses[domain._id].currentNameservers.map((ns, index) => (
                                <div key={index}>{ns}</div>
                              ))}
                            </div>
                          </div>
                        )}
                        {domainStatuses[domain._id].requiredNameservers && (
                          <div>
                            <strong>Required Nameservers:</strong>
                            <div className="bg-blue-50 p-1 rounded font-mono text-xs mt-1">
                              {domainStatuses[domain._id].requiredNameservers.map((ns, index) => (
                                <div key={index}>{ns}</div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Domain Configuration Instructions - Only show when published but not configured */}
                  {domain.customDomain && domain.isPublished && (!domainStatuses[domain._id] || domainStatuses[domain._id].status !== 'configured') && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Info className="h-4 w-4 text-blue-600" />
                        <p className="text-xs text-blue-800 font-medium">Domain Configuration Instructions:</p>
                      </div>
                      <div className="text-xs text-blue-700 space-y-1">
                        <p>1. Go to your domain provider (GoDaddy, Namecheap, etc.)</p>
                        <p>2. Find DNS/Nameserver settings</p>
                        <p>3. Replace current nameservers with:</p>
                        <div className="bg-white p-1 rounded font-mono text-xs">
                          ns1.vercel-dns.com<br/>
                          ns2.vercel-dns.com<br/>
                          ns3.vercel-dns.com<br/>
                          ns4.vercel-dns.com
                        </div>
                        <p>4. Save changes and wait 24-48 hours for propagation</p>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleManageDomain(domain._id)}
                      className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      <Settings className="h-4 w-4 mr-1" />
                      Manage
                    </button>
                    
                    <button
                      onClick={() => window.open(`https://${domain.customDomain}`, '_blank')}
                      className="flex-1 bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center"
                    >
                      <Globe className="h-4 w-4 mr-1" />
                      Visit
                    </button>
                  </div>

                  {/* Refresh DNS Status Button */}
                  <div className="mt-3">
                    <button
                      onClick={() => checkCustomDomainStatus(domain.customDomain, domain._id)}
                      disabled={checkingDomains[domain._id]}
                      className="w-full px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200 disabled:opacity-50 transition-colors flex items-center justify-center"
                    >
                      <RefreshCw className={`h-3 w-3 mr-1 ${checkingDomains[domain._id] ? 'animate-spin' : ''}`} />
                      {checkingDomains[domain._id] ? 'Checking...' : 'Refresh DNS Status'}
                    </button>
                  </div>

                  {/* Add to Vercel Button - Show different states */}
                  {domain.customDomain && (
                    <div className="mt-2">
                      {vercelAddedDomains[domain._id] ? (
                        // Success state - Domain added to Vercel
                        <div className="w-full px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center justify-center text-green-700">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            <span className="text-sm font-medium">Added to Vercel</span>
                          </div>
                          <p className="text-xs text-green-600 mt-1 text-center">
                            Domain added successfully. DNS propagation may take 24-48 hours.
                          </p>
                        </div>
                      ) : vercelErrors[domain._id] === 'already_assigned' ? (
                        // Domain already assigned to another project
                        <div className="w-full px-3 py-2 bg-orange-50 border border-orange-200 rounded-lg">
                          <div className="flex items-center justify-center text-orange-700">
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            <span className="text-sm font-medium">Domain Already in Vercel</span>
                          </div>
                          <p className="text-xs text-orange-600 mt-1 text-center">
                            {domain.customDomain} is already assigned to another Vercel project
                          </p>
                          <div className="mt-2 text-xs text-orange-700">
                            <p className="font-medium">To fix this:</p>
                            <ol className="list-decimal list-inside space-y-1 mt-1">
                              <li>Go to your Vercel dashboard</li>
                              <li>Find the project that owns {domain.customDomain}</li>
                              <li>Remove {domain.customDomain} from that project</li>
                              <li>Then try adding it again here</li>
                            </ol>
                          </div>
                          <button
                            onClick={() => {
                              setVercelErrors(prev => ({ ...prev, [domain._id]: null }));
                              addCustomDomainToVercel(domain.customDomain, domain._id);
                            }}
                            className="mt-2 w-full px-2 py-1 bg-orange-600 text-white text-xs rounded hover:bg-orange-700 transition-colors"
                          >
                            Try Again
                          </button>
                        </div>
                      ) : (!domainStatuses[domain._id] || domainStatuses[domain._id].status !== 'configured') && !vercelErrors[domain._id] ? (
                        // Add to Vercel button - only show if no Vercel errors
                        <div>
                          <button
                            onClick={() => addCustomDomainToVercel(domain.customDomain, domain._id)}
                            disabled={checkingDomains[domain._id]}
                            className="w-full px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all duration-200 shadow-md hover:shadow-lg"
                          >
                            {checkingDomains[domain._id] ? (
                              <>
                                <RefreshCw className="h-4 w-4 mr-2 animate-spin inline" />
                                Adding to Vercel...
                              </>
                            ) : (
                              <>
                                <Globe className="h-4 w-4 mr-2 inline" />
                                Add to Vercel Automatically
                              </>
                            )}
                          </button>
                          <p className="text-xs text-gray-500 mt-1 text-center">
                            This will add your domain to Vercel's DNS system
                          </p>
                        </div>
                      ) : (
                        // DNS configured state
                        <div className="w-full px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center justify-center text-green-700">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            <span className="text-sm font-medium">DNS Configured</span>
                          </div>
                          <p className="text-xs text-green-600 mt-1 text-center">
                            Domain is properly configured and active
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
