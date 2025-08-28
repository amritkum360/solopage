'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Eye, Trash2, RefreshCw, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import apiService from '@/services/api';
import Header from '@/components/Header';

export default function DashboardPage() {
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [domainStatuses, setDomainStatuses] = useState({});
  const [checkingDomains, setCheckingDomains] = useState({});
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

        // Get user's websites
        const websitesResponse = await apiService.getUserWebsites();
        setWebsites(websitesResponse.websites);
        
        // Set loading state for DNS checks
        const websitesWithCustomDomains = websitesResponse.websites.filter(website => website.customDomain);
        const initialCheckingState = {};
        websitesWithCustomDomains.forEach(website => {
          initialCheckingState[website._id] = true;
        });
        setCheckingDomains(initialCheckingState);
        
        // Check DNS status after dashboard loads
        setTimeout(() => {
          websitesWithCustomDomains.forEach(website => {
            checkCustomDomainStatus(website.customDomain, website._id);
          });
        }, 1000);
      } catch (error) {
        console.error('Dashboard error:', error);
        if (error.message.includes('token') || error.message.includes('unauthorized')) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          router.push('/login');
        } else {
          setError('Failed to load dashboard data');
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndLoadData();
  }, [router]);



  const handleCreateWebsite = () => {
    router.push('/edit-website');
  };

  const handleEditWebsite = (websiteId) => {
    router.push(`/edit-website?edit=${websiteId}`);
  };

  const handleViewWebsite = (slug) => {
    window.open(`/site/${slug}`, '_blank');
  };

  const handleDeleteWebsite = async (websiteId) => {
    if (!confirm('Are you sure you want to delete this website?')) {
      return;
    }

    try {
      await apiService.deleteWebsite(websiteId);
      setWebsites(websites.filter(website => website._id !== websiteId));
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete website');
    }
  };

  const handlePublishToggle = async (websiteId, currentStatus) => {
    try {
      // If trying to publish, check for custom domain conflicts first
      if (!currentStatus) {
        const website = websites.find(w => w._id === websiteId);
        if (website && website.customDomain) {
          try {
            const domainCheck = await apiService.checkCustomDomainUsage(website.customDomain, websiteId);
            if (domainCheck.isUsed) {
              alert(`Cannot publish: ${domainCheck.message}. Please unpublish the other website first or choose a different domain.`);
              return;
            }
          } catch (domainError) {
            console.error('Domain check error:', domainError);
            alert('Failed to check custom domain availability. Please try again.');
            return;
          }
        }
      }

      const result = await apiService.toggleWebsitePublish(websiteId);
      
      setWebsites(websites.map(website => 
        website._id === websiteId 
          ? { ...website, isPublished: result.website.isPublished }
          : website
      ));
    } catch (error) {
      console.error('Publish toggle error:', error);
      alert('Failed to update website status');
    }
  };

  // Check custom domain status
  const checkCustomDomainStatus = async (domain, websiteId) => {
    try {
      setCheckingDomains(prev => ({ ...prev, [websiteId]: true }));
      
      const result = await apiService.checkCustomDomainStatus(domain);
      
      // Also check if domain is accessible
      try {
        const response = await fetch(`https://${domain}`, { 
          method: 'HEAD',
          mode: 'no-cors'
        });
        result.accessible = true;
      } catch (accessError) {
        result.accessible = false;
        result.accessError = 'Domain not accessible';
      }
      
      setDomainStatuses(prev => ({
        ...prev,
        [websiteId]: result
      }));
    } catch (error) {
      console.error('Domain status check error:', error);
      setDomainStatuses(prev => ({
        ...prev,
        [websiteId]: {
          status: 'error',
          message: 'Failed to check domain status'
        }
      }));
    } finally {
      setCheckingDomains(prev => ({ ...prev, [websiteId]: false }));
    }
  };

  // Add custom domain to Vercel automatically
  const addCustomDomainToVercel = async (domain, websiteId) => {
    try {
      setCheckingDomains(prev => ({ ...prev, [websiteId]: true }));
      
      const result = await apiService.addCustomDomainToVercel(domain);
      
      // Update website status
      setWebsites(websites.map(website => 
        website._id === websiteId 
          ? { ...website, domainStatus: 'pending' }
          : website
      ));
      
      alert('Domain added to Vercel successfully! Please wait 24-48 hours for activation.');
      
    } catch (error) {
      console.error('Add domain to Vercel error:', error);
      alert('Failed to add domain to Vercel: ' + error.message);
    } finally {
      setCheckingDomains(prev => ({ ...prev, [websiteId]: false }));
    }
  };

  // Get status color and message
  const getStatusInfo = (status) => {
    switch (status) {
      case 'configured':
        return { color: 'green', message: 'Domain configured correctly' };
      case 'not_found':
        return { color: 'red', message: 'Domain not found in system' };
      case 'not_published':
        return { color: 'yellow', message: 'Website not published' };
      case 'dns_not_configured':
        return { color: 'red', message: 'DNS not configured properly' };
      case 'dns_error':
        return { color: 'orange', message: 'DNS check failed' };
      case 'error':
        return { color: 'red', message: 'Error checking domain' };
      default:
        return { color: 'gray', message: 'Unknown status' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.username}!
          </h2>
          <p className="text-gray-600">
            Manage your websites and create new ones to showcase your work.
          </p>
        </div>

        {/* Create New Website Button */}
        <div className="mb-8">
          <button
            onClick={handleCreateWebsite}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create New Website
          </button>
        </div>

        {/* Websites Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {websites.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="h-16 w-16 text-gray-300 mx-auto mb-4 flex items-center justify-center text-4xl">🌐</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No websites yet</h3>
              <p className="text-gray-600 mb-4">
                Create your first website to get started
              </p>
              <button
                onClick={handleCreateWebsite}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Create Website
              </button>
            </div>
          ) : (
            websites.map((website) => (
              <div key={website._id} className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col min-h-[400px]">
                <div className="flex justify-between items-start p-6 pb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {website.title}
                    </h3>
                    <p className="text-sm text-gray-600 capitalize font-medium">
                      {website.template} template
                    </p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${
                    website.isPublished 
                      ? 'bg-green-100 text-green-800 border border-green-200' 
                      : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                  }`}>
                    {website.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>

                <div className="px-6 flex-1">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <p className="text-sm text-gray-600">
                        <strong>Subdomain:</strong> <a 
                            href={`https://${website.slug}.jirocash.com`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-green-700 hover:text-green-800 underline "
                          >
                            {website.slug}.jirocash.com
                          </a>
                      </p>
                    </div>
                    {website.customDomain && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {domainStatuses[website._id] && domainStatuses[website._id].status === 'configured' ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : domainStatuses[website._id] ? (
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                          ) : (
                            <div className="h-4 w-4" /> // Empty space when no status checked yet
                          )}
                  <p className="text-sm text-gray-600">
                            <strong>Custom Domain:</strong> <a 
                            href={`https://${website.customDomain}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-green-700 hover:text-green-800 underline "
                          >
                            {website.customDomain}
                          </a>
                          </p>
                        </div>
                        
                        {/* Domain Status */}
                        <div className="flex items-center space-x-2">
                          {checkingDomains[website._id] ? (
                            <div className="flex items-center space-x-2">
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                              <span className="text-xs text-gray-600">Checking DNS...</span>
                            </div>
                          ) : domainStatuses[website._id] ? (
                            <div className={`px-2 py-1 text-xs rounded-full ${
                              getStatusInfo(domainStatuses[website._id].status).color === 'green' 
                                ? 'bg-green-100 text-green-800'
                                : getStatusInfo(domainStatuses[website._id].status).color === 'red'
                                ? 'bg-red-100 text-red-800'
                                : getStatusInfo(domainStatuses[website._id].status).color === 'orange'
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                            {getStatusInfo(domainStatuses[website._id].status).message}
                          </div>
                          ) : (
                            <div className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                              Status not checked
                            </div>
                          )}
                          
                          <button
                            onClick={() => checkCustomDomainStatus(website.customDomain, website._id)}
                            disabled={checkingDomains[website._id]}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                            title="Check domain status"
                          >
                            <RefreshCw 
                              size={12} 
                              className={`${checkingDomains[website._id] ? 'animate-spin' : ''}`}
                            />
                          </button>
                        </div>
                        
                        
                        {/* Success Configuration Info */}
                        {domainStatuses[website._id] && domainStatuses[website._id].status === 'configured' && (
                          <div className="p-2 bg-green-50 border border-green-200 rounded">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <p className="text-xs text-green-800 font-medium">DNS Configured Correctly</p>
                            </div>
                            <p className="text-xs text-green-700 mt-1">
                              {domainStatuses[website._id].message}
                            </p>
                            
                            {/* Domain Accessibility Warning */}
                            {domainStatuses[website._id].accessible === false && (
                              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                                <div className="flex items-center gap-2">
                                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                                  <p className="text-xs text-yellow-800 font-medium">Domain Not Accessible</p>
                                </div>
                                <p className="text-xs text-yellow-700 mt-1">
                                  Domain is configured but not accessible. Click the button below to add it to Vercel automatically.
                                </p>
                                <button
                                  onClick={() => addCustomDomainToVercel(website.customDomain, website._id)}
                                  disabled={checkingDomains[website._id]}
                                  className="mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:opacity-50"
                                >
                                  {checkingDomains[website._id] ? 'Adding...' : 'Add to Vercel Automatically'}
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Domain Configuration Instructions - Show when there's a custom domain warning */}
                        {website.customDomain && (!domainStatuses[website._id] || domainStatuses[website._id].status !== 'configured') && (
                          <div className="p-2 bg-blue-50 border border-blue-200 rounded mt-2">
                            <div className="flex items-center gap-2">
                              <Info className="h-4 w-4 text-blue-600" />
                              <p className="text-xs text-blue-800 font-medium">Domain Configuration Instructions:</p>
                            </div>
                            <div className="text-xs text-blue-700 mt-1 space-y-1">
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
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Section - Dates and Buttons */}
                <div className="mt-auto px-6 pb-6">
                  <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600">
                    <strong>Created:</strong> {new Date(website.createdAt).toLocaleDateString()}
                  </p>
                  {website.updatedAt && (
                    <p className="text-sm text-gray-600">
                      <strong>Updated:</strong> {new Date(website.updatedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>

                  {/* Action Buttons */}
                  <div className="pt-4">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditWebsite(website._id)}
                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </button>
                  
                  {website.isPublished && (
                    <button
                      onClick={() => handleViewWebsite(website.slug)}
                      className="flex-1 bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </button>
                  )}
                  
                  <button
                    onClick={() => handlePublishToggle(website._id, website.isPublished)}
                    className={`flex-1 px-3 py-2 rounded-md transition-colors flex items-center justify-center ${
                      website.isPublished
                        ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    <span className="mr-1">🌐</span>
                    {website.isPublished ? 'Unpublish' : 'Publish'}
                  </button>
                  
                  <button
                    onClick={() => handleDeleteWebsite(website._id)}
                    className="bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
