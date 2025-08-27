// Multi-tenant domain configuration
export const TENANT_DOMAINS = {
  'jirocash.com': {
    name: 'JiroCash',
    displayName: 'JiroCash Website Builder',
    theme: {
      primary: '#3B82F6',
      secondary: '#1E40AF',
      accent: '#60A5FA'
    },
    allowedSubdomains: ['www', 'api', 'admin', 'dashboard'],
    features: {
      customDomains: true,
      analytics: true,
      seo: true
    },
    branding: {
      logo: '/logo-jirocash.png',
      favicon: '/favicon-jirocash.ico'
    }
  },
  'solopage.com': {
    name: 'SoloPage',
    displayName: 'SoloPage - Create Your Website',
    theme: {
      primary: '#10B981',
      secondary: '#059669',
      accent: '#34D399'
    },
    allowedSubdomains: ['www', 'api', 'admin', 'dashboard'],
    features: {
      customDomains: true,
      analytics: true,
      seo: true
    },
    branding: {
      logo: '/logo-solopage.png',
      favicon: '/favicon-solopage.ico'
    }
  },
  'mywebsitebuilder.com': {
    name: 'MyWebsiteBuilder',
    displayName: 'My Website Builder',
    theme: {
      primary: '#8B5CF6',
      secondary: '#7C3AED',
      accent: '#A78BFA'
    },
    allowedSubdomains: ['www', 'api', 'admin', 'dashboard'],
    features: {
      customDomains: true,
      analytics: true,
      seo: true
    },
    branding: {
      logo: '/logo-mywebsitebuilder.png',
      favicon: '/favicon-mywebsitebuilder.ico'
    }
  }
};

// Reserved subdomains that should not be treated as website slugs
export const RESERVED_SUBDOMAINS = [
  'www', 'api', 'admin', 'mail', 'ftp', 'blog', 'shop', 'store', 
  'support', 'help', 'docs', 'status', 'cdn', 'static', 'assets',
  'app', 'dashboard', 'login', 'register', 'auth', 'dashboard'
];

// Get tenant configuration by domain
export function getTenantConfig(domain) {
  return TENANT_DOMAINS[domain] || null;
}

// Check if subdomain is reserved
export function isReservedSubdomain(subdomain) {
  return RESERVED_SUBDOMAINS.includes(subdomain);
}

// Get all tenant domains
export function getAllTenantDomains() {
  return Object.keys(TENANT_DOMAINS);
}

// Validate tenant domain
export function isValidTenantDomain(domain) {
  return domain in TENANT_DOMAINS;
}
