'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Maximize2, X } from 'lucide-react';

// Import templates
import { 
  PortfolioTemplate, 
  BusinessTemplate, 
  PersonalTemplate,
  defaultPortfolioData,
  defaultBusinessData,
  defaultPersonalData,
  LocalBusinessTemplate,
  defaultLocalBusinessData
} from './templates';

// Import forms
import { PortfolioForm, BusinessForm, PersonalForm, LocalBusinessForm } from './forms';

// Import API service
import apiService from '../services/api';

// Import Header
import Header from './Header';

export default function WebsiteBuilder() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');

  // Template selection
  const [selectedTemplate, setSelectedTemplate] = useState('portfolio');

  // Template-specific data states
  const [portfolioData, setPortfolioData] = useState(defaultPortfolioData);
  const [businessData, setBusinessData] = useState(defaultBusinessData);
  const [personalData, setPersonalData] = useState(defaultPersonalData);
  const [localBusinessData, setLocalBusinessData] = useState(defaultLocalBusinessData);

  // UI states
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [iframeContent, setIframeContent] = useState('');
  const previewRef = useRef(null);
  
  // Slug states
  const [slug, setSlug] = useState('');
  const [slugAvailable, setSlugAvailable] = useState(null);
  const [checkingSlug, setCheckingSlug] = useState(false);
  const [originalSlug, setOriginalSlug] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [useCustomDomain, setUseCustomDomain] = useState(false);
  const [customDomainAvailable, setCustomDomainAvailable] = useState(null);
  const [checkingCustomDomain, setCheckingCustomDomain] = useState(false);

  // Get current data based on selected template
  const getCurrentData = () => {
    switch (selectedTemplate) {
      case 'portfolio':
        return portfolioData;
      case 'business':
        return businessData;
      case 'personal':
        return personalData;
      case 'localbusiness':
        return localBusinessData;
      default:
        return portfolioData;
    }
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    switch (selectedTemplate) {
      case 'portfolio':
        setPortfolioData(prev => ({ ...prev, [field]: value }));
        break;
      case 'business':
        setBusinessData(prev => ({ ...prev, [field]: value }));
        break;
      case 'personal':
        setPersonalData(prev => ({ ...prev, [field]: value }));
        break;
      case 'localbusiness':
        setLocalBusinessData(prev => ({ ...prev, [field]: value }));
        break;
    }
  };

  // const handleToggleVisibility = (field) => {
  //   setPortfolioData(prev => ({
  //     ...prev,
  //     visibility: {
  //       ...prev.visibility,
  //       [field]: !prev.visibility[field]
  //     }
  //   }));
  // };

  const handleToggleVisibility = (field) => {
    switch (selectedTemplate) {
      case 'portfolio':
        setPortfolioData(prev => ({
          ...prev,
          visibility: {
            ...prev.visibility,
            [field]: !prev.visibility?.[field]
          }
        }));
        break;
      case 'business':
        setBusinessData(prev => ({
          ...prev,
          visibility: {
            ...prev.visibility,
            [field]: !prev.visibility?.[field]
          }
        }));
        break;
      case 'personal':
        setPersonalData(prev => ({
          ...prev,
          visibility: {
            ...prev.visibility,
            [field]: !prev.visibility?.[field]
          }
        }));
        break;
      case 'localbusiness':
        setLocalBusinessData(prev => ({
          ...prev,
          visibility: {
            ...prev.visibility,
            [field]: !prev.visibility?.[field]
          }
        }));
        break;
    }
  };

  // Check slug availability with debouncing
  const checkSlugAvailability = async (slugToCheck) => {
    if (!slugToCheck || slugToCheck.length < 3) {
      setSlugAvailable(null);
      return;
    }

    // If editing and slug hasn't changed, mark as available
    if (editId && slugToCheck === originalSlug) {
      setSlugAvailable(true);
      return;
    }

    setCheckingSlug(true);
    try {
      const result = await apiService.checkSlugAvailability(slugToCheck);
      setSlugAvailable(result.available);
    } catch (error) {
      console.error('Error checking slug:', error);
      setSlugAvailable(false);
    } finally {
      setCheckingSlug(false);
    }
  };

  // Check custom domain availability with debouncing
  const checkCustomDomainAvailability = async (domainToCheck) => {
    if (!domainToCheck || domainToCheck.length < 3) {
      setCustomDomainAvailable(null);
      return;
    }

    // If editing and domain hasn't changed, mark as available
    if (editId && domainToCheck === customDomain) {
      setCustomDomainAvailable(true);
      return;
    }

    setCheckingCustomDomain(true);
    try {
      const result = await apiService.checkCustomDomainUsage(domainToCheck, editId);
      setCustomDomainAvailable(!result.isUsed);
    } catch (error) {
      console.error('Error checking custom domain:', error);
      setCustomDomainAvailable(false);
    } finally {
      setCheckingCustomDomain(false);
    }
  };

  // Debounced slug checking
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (slug) {
        checkSlugAvailability(slug);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [slug]);

  // Debounced custom domain checking
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (customDomain) {
        checkCustomDomainAvailability(customDomain);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [customDomain]);
  // Handle template change
  const handleTemplateChange = (template) => {
    setSelectedTemplate(template);
    setShowTemplateModal(false);
  };

  // Handle website publish
  const handlePublish = async () => {
    try {
      setLoading(true);
      setError('');

      // Always validate slug (mandatory)
      if (!slug || slug.length < 3) {
        setError('Please enter a valid subdomain (at least 3 characters). Subdomain is required for all websites.');
        setLoading(false);
        return;
      }

      if (slugAvailable === false) {
        setError('This subdomain is already taken. Please choose a different one.');
        setLoading(false);
        return;
      }

      if (slugAvailable === null) {
        setError('Please wait for subdomain validation to complete.');
        setLoading(false);
        return;
      }

      // Check custom domain availability if using custom domain
      if (useCustomDomain && customDomain) {
        if (customDomainAvailable === false) {
          setError('This custom domain is already being used by another website. Please choose a different domain or unpublish the other website first.');
          setLoading(false);
          return;
        }
        
        if (customDomainAvailable === null) {
          setError('Please wait for custom domain validation to complete.');
          setLoading(false);
          return;
        }
      }

      const currentData = getCurrentData();
      const websiteData = {
        title: currentData.name || currentData.title || `${selectedTemplate.charAt(0).toUpperCase() + selectedTemplate.slice(1)} Website`,
        template: selectedTemplate,
        data: currentData,
        isPublished: false, // Save as unpublished first
        slug: slug
      };

      // Always include custom domain if it exists, regardless of toggle state
      if (customDomain && customDomain.trim()) {
        websiteData.customDomain = customDomain.trim();
      }

      let result;
      if (editId) {
        // Update existing website
        result = await apiService.updateWebsite(editId, websiteData);
      } else {
        // Create new website
        result = await apiService.createWebsite(websiteData);
      }

      if (result.message) {
        const message = editId 
          ? 'Website updated successfully!' 
          : 'Website saved successfully! You can now publish it from the dashboard.';
        alert(message);
        router.push('/dashboard');
      } else {
        setError(result.message || 'Failed to save website');
      }
    } catch (err) {
      setError('Failed to publish website. Please try again.');
      console.error('Publish error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load existing website data for editing
  useEffect(() => {
    const loadWebsiteForEdit = async () => {
      console.log('Edit ID:', editId);
      if (editId) {
        try {
          setLoading(true);
          const result = await apiService.getWebsite(editId);
          console.log('Website data loaded:', result);
          
          if (result.website) {
            const website = result.website;
            setSelectedTemplate(website.template);
            setSlug(website.slug || '');
            setOriginalSlug(website.slug || '');
            setCustomDomain(website.customDomain || '');
            setUseCustomDomain(!!website.customDomain);
            
            // Set the appropriate data based on template
            switch (website.template) {
              case 'portfolio':
                setPortfolioData(website.data);
                break;
              case 'business':
                setBusinessData(website.data);
                break;
              case 'personal':
                setPersonalData(website.data);
                break;
              case 'localbusiness':
                setLocalBusinessData(website.data);
                break;
              default:
                setError('Unknown template type');
            }
          } else {
            setError('Failed to load website for editing');
          }
        } catch (err) {
          setError('Failed to load website for editing: ' + err.message);
          console.error('Load website error:', err);
        } finally {
          setLoading(false);
        }
      }
    };

    loadWebsiteForEdit();
  }, [editId]);

  // Keyboard shortcut for closing modals
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (showFullPreview) {
          setShowFullPreview(false);
        }
        if (showTemplateModal) {
          setShowTemplateModal(false);
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showFullPreview, showTemplateModal]);

  // Template data array
  const templates = [
    {
      id: 'portfolio',
      name: 'Portfolio',
      description: 'Professional',
      icon: '👨‍💼',
      color: 'blue'
    },
    {
      id: 'business',
      name: 'Business',
      description: 'Corporate',
      icon: '🏢',
      color: 'green'
    },
    {
      id: 'personal',
      name: 'Personal',
      description: 'Simple',
      icon: '👤',
      color: 'purple'
    },
    {
      id: 'localbusiness',
      name: 'Local Business',
      description: 'Business Portfolio',
      icon: '🏪',
      color: 'orange'
    }
  ];

  // Get current form component
  const getCurrentForm = () => {
    const currentData = getCurrentData();
    const handleChange = handleInputChange;

    switch (selectedTemplate) {
      case 'portfolio':
        return <PortfolioForm data={currentData} onInputChange={handleChange} onToggleVisibility={handleToggleVisibility} />;
      case 'business':
        return <BusinessForm data={currentData} onInputChange={handleChange} onToggleVisibility={handleToggleVisibility}/>;
      case 'personal':
        return <PersonalForm data={currentData} onInputChange={handleChange} onToggleVisibility={handleToggleVisibility}/>;
      case 'localbusiness':
        return <LocalBusinessForm data={currentData} onInputChange={handleChange} onToggleVisibility={handleToggleVisibility}/>;
      default:
        return <PortfolioForm data={currentData} onInputChange={handleChange} />;
    }
  };

  // Update iframe content when data changes
  useEffect(() => {
    if (previewRef.current) {
      const htmlContent = previewRef.current.innerHTML;
      setIframeContent(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Mobile Preview</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
              * { box-sizing: border-box; }
            </style>
          </head>
          <body>
            <div style="width: 100%; height: 100%; overflow: auto; padding: 1rem;">
              ${htmlContent}
            </div>
          </body>
        </html>
      `);
    }
  }, [portfolioData, businessData, personalData, localBusinessData, selectedTemplate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-screen">
          {/* Left Side - Form */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden flex flex-col">
            {/* Sticky Header - Template Selection and Publish Button */}
            <div className="sticky top-0 bg-white border-b p-6 z-10">
              <div className="space-y-4">
                {/* Template Selection */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <h2 className="text-lg font-semibold text-gray-900">Template</h2>
                    <button
                      onClick={() => setShowTemplateModal(true)}
                      className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-2xl">
                        {templates.find(t => t.id === selectedTemplate)?.icon}
                      </span>
                      <div className="text-left">
                        <div className="font-medium text-gray-900">
                          {templates.find(t => t.id === selectedTemplate)?.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {templates.find(t => t.id === selectedTemplate)?.description}
                        </div>
                      </div>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                  <button
                    onClick={handlePublish}
                    disabled={loading || (!slug || slugAvailable === false)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Publishing...
                      </>
                    ) : (
                      editId ? 'Update Website' : 'Publish Website'
                    )}
                  </button>
                </div>

                
              </div>
            </div>

            {/* Scrollable Form Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Website URL Configuration */}
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={!useCustomDomain}
                        onChange={() => setUseCustomDomain(false)}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">Subdomain Only</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={useCustomDomain}
                        onChange={() => setUseCustomDomain(true)}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">Custom Domain + Subdomain</span>
                    </label>
                  </div>
                  <p className="text-xs text-gray-600 bg-blue-50 p-2 rounded">
                    <strong>Note:</strong> Subdomain is always required. Custom domain is optional and works alongside the subdomain.
                  </p>
                </div>

                                {/* Subdomain Input - Always Visible */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Website Subdomain <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 relative">
                      {/* <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                        jirocash.com/
                      </span> */}
                      <input
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                        placeholder="your-website-name"
                        className={`w-full pl-2 pr-12 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          !slug || slug.length < 3 ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        required
                      />
                      {checkingSlug && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        </div>
                      )}
                      {!checkingSlug && slug && slug.length >= 3 && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          {slugAvailable === true ? (
                            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : slugAvailable === false ? (
                            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          ) : null}
                        </div>
                      )}
                    </div>
                  </div>
                  {!slug || slug.length < 3 ? (
                    <p className="text-sm text-red-600 font-medium">
                      ⚠️ Subdomain is required (minimum 3 characters)
                    </p>
                  ) : slug && slug.length >= 3 && !checkingSlug && (
                    <p className={`text-sm ${slugAvailable === true ? 'text-green-600' : slugAvailable === false ? 'text-red-600' : 'text-gray-500'}`}>
                      {slugAvailable === true ?  `✓ ${slug}.jirocash.com is available!` : slugAvailable === false ? `✗ ${slug}.jirocash.com is already taken` : ''}
                    </p>
                  )}
                  
                  <p className="text-xs text-gray-500">
                    <strong>Required:</strong> Enter a unique subdomain for your website (only lowercase letters, numbers, and hyphens allowed)
                  </p>
                </div>

                {/* Custom Domain Input - Only visible when Custom Domain + Subdomain is selected */}
                {useCustomDomain && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Custom Domain <span className="text-gray-400">(Optional)</span>
                    </label>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={customDomain}
                          onChange={(e) => setCustomDomain(e.target.value.toLowerCase())}
                          placeholder="yourdomain.com"
                          className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {checkingCustomDomain && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                          </div>
                        )}
                        {!checkingCustomDomain && customDomain && customDomain.length >= 3 && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            {customDomainAvailable === true ? (
                              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            ) : customDomainAvailable === false ? (
                              <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            ) : null}
                          </div>
                        )}
                      </div>
                    </div>
                    {/* {customDomain && customDomain.length >= 3 && !checkingCustomDomain && (
                      <p className={`text-sm ${customDomainAvailable === true ? 'text-green-600' : customDomainAvailable === false ? 'text-red-600' : 'text-gray-500'}`}>
                        {customDomainAvailable === true ? `✓ ${customDomain} is available!` : customDomainAvailable === false ? `✗ ${customDomain} is already being used by another website. Unpublish it Then You can use it` : ''}
                      </p>
                    )} */}
                    {/* {customDomain && (
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800 font-medium">Custom Domain Setup Required:</p>
                        <p className="text-sm text-yellow-700 mt-1">

                          You will need to configure DNS records to point {`${customDomain}`} to our servers.
                        </p>
                      </div>
                    )} */}
                    {customDomain && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg mt-2">
                        <p className="text-sm text-red-800 font-medium">Add these nameservers in your domain provider:</p>
                        <div className="mt-2 space-y-1">
                          <p className="text-sm font-mono text-red-700">ns1.vercel-dns.com</p>
                          <p className="text-sm font-mono text-red-700">ns2.vercel-dns.com</p>
                        </div>
                      </div>
                    )}
                    <p className="text-xs text-gray-500">
                      Enter your custom domain (e.g., yourdomain.com)
                    </p>
                  </div>
                )}
              </div>
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Edit Your Information</h2>
                {getCurrentForm()}
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Live Preview */}
          <div className="bg-white rounded-lg shadow-sm border p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Live Preview</h2>
              <button
                onClick={() => setShowFullPreview(true)}
                className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-lg text-sm transition-colors"
              >
                <Maximize2 size={16} />
                <span>Full Screen</span>
              </button>
            </div>

            {/* Hidden div to capture template HTML */}
            <div 
              ref={previewRef} 
              className="hidden"
              style={{ width: '400px' }}
            >
              {selectedTemplate === 'portfolio' && <PortfolioTemplate data={getCurrentData()} />}
              {selectedTemplate === 'business' && <BusinessTemplate data={getCurrentData()} />}
              {selectedTemplate === 'personal' && <PersonalTemplate data={getCurrentData()} />}
              {selectedTemplate === 'localbusiness' && <LocalBusinessTemplate data={getCurrentData()} />}
            </div>

            {/* Mobile-like Preview Container */}
            <div className="border rounded-lg overflow-hidden bg-gray-50">
              {/* Browser Header */}
              <div className="bg-gray-100 px-4 py-2 border-b">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-gray-600 ml-2">Mobile Preview</span>
                </div>
              </div>
              
              {/* Mobile Frame with iframe */}
              <div className="flex justify-center p-4">
                <div className="w-full max-w-sm h-[600px] bg-white relative border rounded-lg overflow-hidden">
                  {/* Mobile Status Bar */}
                  <div className="bg-gray-800 text-white text-xs px-3 py-1 flex justify-between items-center">
                    <span>9:41</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-4 h-2 bg-white rounded-sm"></div>
                      <div className="w-1 h-1 bg-white rounded-full"></div>
                    </div>
                  </div>
                  
                  {/* iframe for mobile preview */}
                  <iframe
                    srcDoc={iframeContent}
                    className="w-full h-full border-0"
                    title="Mobile Preview"
                    sandbox="allow-scripts allow-same-origin"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Screen Preview Modal */}
      {showFullPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
              <h3 className="text-lg font-semibold">Full Screen Preview</h3>
              <button
                onClick={() => setShowFullPreview(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Desktop Browser Frame */}
            {/* Desktop Browser Frame */}
<div className="flex-1 p-4 min-h-0 flex flex-col">
  <div className="border rounded-lg overflow-hidden bg-gray-50 h-full flex flex-col">
    
    {/* Browser Header */}
    <div className="bg-gray-100 px-4 py-2 border-b flex-shrink-0">
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        <span className="text-xs text-gray-600 ml-2">Desktop Preview</span>
      </div>
    </div>

    {/* Desktop Content */}
    <div className="flex-1 overflow-y-auto min-h-0 bg-white">
      <div className="p-8">
        {selectedTemplate === 'portfolio' && <PortfolioTemplate data={getCurrentData()} />}
        {selectedTemplate === 'business' && <BusinessTemplate data={getCurrentData()} />}
        {selectedTemplate === 'personal' && <PersonalTemplate data={getCurrentData()} />}
        {selectedTemplate === 'localbusiness' && <LocalBusinessTemplate data={getCurrentData()} />}
      </div>
    </div>
  </div>

            </div>
          </div>
        </div>
      )}

            {/* Template Selection Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[80vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-900">Choose Your Template</h3>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Template Grid */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateChange(template.id)}
                    className={`p-6 border-2 rounded-xl text-center transition-all duration-200 hover:shadow-lg ${
                      selectedTemplate === template.id
                        ? `border-${template.color}-500 bg-${template.color}-50 shadow-md`
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="text-4xl mb-4">{template.icon}</div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{template.name}</h4>
                    <p className="text-sm text-gray-600">{template.description}</p>
                    {selectedTemplate === template.id && (
                      <div className="mt-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${template.color}-100 text-${template.color}-800`}>
                          Selected
                        </span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t bg-gray-50">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowTemplateModal(false)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowTemplateModal(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Confirm Selection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
