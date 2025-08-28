const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  // Helper method to handle API responses
  async handleResponse(response) {
    try {
      const data = await response.json();
      
      if (!response.ok) {
        console.error('API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          data: data
        });
        throw new Error(data.message || data.errors?.[0]?.msg || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      return data;
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('JSON')) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }
      throw error;
    }
  }

  // Auth APIs
  async register(userData) {
    const response = await fetch(`${this.baseURL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return this.handleResponse(response);
  }

  async login(credentials) {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    return this.handleResponse(response);
  }

  async getCurrentUser() {
    const response = await fetch(`${this.baseURL}/auth/me`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // Website APIs
  async createWebsite(websiteData) {
    try {
      const response = await fetch(`${this.baseURL}/websites`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(websiteData),
      });
      return this.handleResponse(response);
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error: Please check if the backend server is running');
      }
      throw error;
    }
  }

  async getUserWebsites() {
    const response = await fetch(`${this.baseURL}/websites`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async getWebsite(id) {
    const response = await fetch(`${this.baseURL}/websites/${id}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async updateWebsite(id, websiteData) {
    try {
      const response = await fetch(`${this.baseURL}/websites/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(websiteData),
      });
      return this.handleResponse(response);
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error: Please check if the backend server is running');
      }
      throw error;
    }
  }

  async toggleWebsitePublish(id) {
    try {
      const response = await fetch(`${this.baseURL}/websites/${id}/toggle-publish`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
      });
      return this.handleResponse(response);
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error: Please check if the backend server is running');
      }
      throw error;
    }
  }

  async deleteWebsite(id) {
    const response = await fetch(`${this.baseURL}/websites/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // Public website API
  async getPublishedWebsite(slug) {
    const response = await fetch(`${this.baseURL}/sites/${slug}`);
    return this.handleResponse(response);
  }

  // Health check
  async healthCheck() {
    const response = await fetch(`${this.baseURL}/health`);
    return this.handleResponse(response);
  }

  // Check slug availability
  async checkSlugAvailability(slug) {
    const response = await fetch(`${this.baseURL}/check-slug/${slug}`);
    return this.handleResponse(response);
  }

  // Check subdomain availability
  async checkSubdomainAvailability(subdomain) {
    try {
      const response = await fetch(`${this.baseURL}/check-slug/${subdomain}`);
      return this.handleResponse(response);
    } catch (error) {
      throw error;
    }
  }

  // Validate subdomain format
  validateSubdomain(subdomain) {
    // Subdomain rules:
    // - 3-63 characters long
    // - Only lowercase letters, numbers, and hyphens
    // - Cannot start or end with hyphen
    // - Cannot contain consecutive hyphens
    const subdomainRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
    
    if (!subdomain || subdomain.length < 3 || subdomain.length > 63) {
      return { valid: false, message: 'Subdomain must be 3-63 characters long' };
    }
    
    if (!subdomainRegex.test(subdomain)) {
      return { valid: false, message: 'Subdomain can only contain lowercase letters, numbers, and hyphens. Cannot start or end with hyphen.' };
    }
    
    // Reserved subdomains
    const reservedSubdomains = [
      'www', 'api', 'admin', 'mail', 'ftp', 'blog', 'shop', 'store', 
      'support', 'help', 'docs', 'status', 'cdn', 'static', 'assets'
    ];
    
    if (reservedSubdomains.includes(subdomain)) {
      return { valid: false, message: 'This subdomain is reserved and cannot be used' };
    }
    
    return { valid: true, message: 'Subdomain is valid' };
  }

  // Image upload APIs
  async uploadImage(file) {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${this.baseURL}/upload-image`, {
        method: 'POST',
        headers: {
          ...(this.getAuthHeaders()['Authorization'] && { 'Authorization': this.getAuthHeaders()['Authorization'] })
        },
        body: formData,
      });
      return this.handleResponse(response);
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error: Please check if the backend server is running');
      }
      throw error;
    }
  }

  async getUserImages() {
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    
    const response = await fetch(`${this.baseURL}/user-images/${userData.id}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  async deleteUserImage(filename) {
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    
    const response = await fetch(`${this.baseURL}/user-images/${userData.id}/${filename}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse(response);
  }

  // Check custom domain status
  async checkCustomDomainStatus(domain) {
    try {
      const response = await fetch(`${this.baseURL}/check-domain-status/${domain}`);
      return this.handleResponse(response);
    } catch (error) {
      throw error;
    }
  }

  // Get website by custom domain
  async getWebsiteByCustomDomain(domain) {
    try {
      const response = await fetch(`${this.baseURL}/custom-domain/${domain}`);
      return this.handleResponse(response);
    } catch (error) {
      throw error;
    }
  }

  // Add custom domain to Vercel
  async addCustomDomainToVercel(domain) {
    try {
      const response = await fetch(`${this.baseURL}/add-custom-domain`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ domain })
      });
      return this.handleResponse(response);
    } catch (error) {
      throw error;
    }
  }

  // Check Vercel domain status
  async checkVercelDomainStatus(domain) {
    try {
      const response = await fetch(`${this.baseURL}/check-vercel-domain/${domain}`, {
        headers: this.getAuthHeaders()
      });
      return this.handleResponse(response);
    } catch (error) {
      throw error;
    }
  }

  // Debug: Check all custom domains
  async debugCustomDomains() {
    try {
      const response = await fetch(`${this.baseURL}/debug/custom-domains`);
      return this.handleResponse(response);
    } catch (error) {
      throw error;
    }
  }
}

export default new ApiService();
