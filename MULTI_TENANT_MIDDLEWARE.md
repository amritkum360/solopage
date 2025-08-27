# Multi-Tenant Middleware Architecture

## Overview

We've implemented a **middleware-level multi-tenancy** approach that allows multiple domains to serve the same application while keeping the backend single-tenant. This is an efficient and scalable solution.

## How It Works

### 🏗️ Architecture

```
Multiple Domains → Middleware → Single Application → Single Database
```

### 📋 Domain Configuration

```javascript
// src/config/tenants.js
export const TENANT_DOMAINS = {
  'jirocash.com': {
    name: 'JiroCash',
    theme: { primary: '#3B82F6' },
    features: { customDomains: true }
  },
  'solopage.com': {
    name: 'SoloPage', 
    theme: { primary: '#10B981' },
    features: { customDomains: true }
  }
};
```

### 🔄 Middleware Flow

1. **Request comes in**: `sonu.solopage.com`
2. **Middleware detects**: Domain = `solopage.com`, Subdomain = `sonu`
3. **Route rewrite**: `/site/sonu`
4. **Application serves**: Same website data from single database

## Benefits

### ✅ **Advantages**

1. **Multiple Domains**: One application serves multiple domains
2. **Single Database**: No data duplication or complexity
3. **Easy Management**: Centralized configuration
4. **Cost Effective**: Single server, single database
5. **Scalable**: Easy to add new domains

### 🎯 **Use Cases**

- **White-label Solutions**: Different brands, same platform
- **Geographic Domains**: `us.websitebuilder.com`, `in.websitebuilder.com`
- **Brand Variations**: `pro.websitebuilder.com`, `basic.websitebuilder.com`

## Implementation Details

### 1. **Middleware Configuration**

```javascript
// middleware.js
const tenantConfig = TENANT_DOMAINS[domain];
if (tenantConfig && !isReservedSubdomain(subdomain)) {
  url.pathname = `/site/${subdomain}`;
  return NextResponse.rewrite(url);
}
```

### 2. **Tenant Context**

```javascript
// Add tenant info to headers
requestHeaders.set('x-tenant-domain', domain);
requestHeaders.set('x-tenant-name', tenantConfig.name);
requestHeaders.set('x-tenant-theme', tenantConfig.theme);
```

### 3. **Application Usage**

```javascript
// Access tenant info in components
const tenantDomain = headers.get('x-tenant-domain');
const tenantName = headers.get('x-tenant-name');
```

## URL Examples

### 🌐 **Working URLs**

```
✅ sonu.jirocash.com → /site/sonu
✅ sonu.solopage.com → /site/sonu  
✅ sonu.mywebsitebuilder.com → /site/sonu
✅ jirocash.com/site/sonu → /site/sonu
```

### 🚫 **Reserved Subdomains**

```
❌ www.jirocash.com → Not routed
❌ api.jirocash.com → Not routed
❌ admin.jirocash.com → Not routed
❌ dashboard.jirocash.com → Not routed
```

## Adding New Domains

### 1. **Update Configuration**

```javascript
// src/config/tenants.js
'newdomain.com': {
  name: 'NewDomain',
  displayName: 'New Domain Website Builder',
  theme: {
    primary: '#FF6B6B',
    secondary: '#FF5252'
  }
}
```

### 2. **DNS Configuration**

```
Type: A
Name: @
Value: YOUR_SERVER_IP

Type: A  
Name: *
Value: YOUR_SERVER_IP
```

### 3. **Vercel Configuration** (if using Vercel)

1. Add domain in Vercel dashboard
2. Add wildcard subdomain `*.newdomain.com`
3. Configure DNS records

## Security Considerations

### 🔒 **Reserved Subdomains**

```javascript
const RESERVED_SUBDOMAINS = [
  'www', 'api', 'admin', 'dashboard', 'login', 
  'register', 'auth', 'mail', 'ftp', 'blog'
];
```

### 🛡️ **Validation**

- Subdomain format validation
- Reserved subdomain protection
- Domain whitelist checking

## Monitoring & Analytics

### 📊 **Tenant Tracking**

```javascript
// Track which tenant served the request
console.log(`Tenant: ${tenantConfig.name}, Domain: ${domain}, Subdomain: ${subdomain}`);
```

### 📈 **Usage Analytics**

- Per-tenant usage statistics
- Subdomain popularity tracking
- Domain performance metrics

## Future Enhancements

### 🚀 **Potential Features**

1. **Per-Tenant Customization**
   - Custom themes per domain
   - Different templates per tenant
   - Tenant-specific features

2. **Advanced Routing**
   - Custom domain support
   - Geographic routing
   - Load balancing per tenant

3. **Tenant Management**
   - Admin panel for tenant management
   - Tenant-specific settings
   - Usage quotas per tenant

## Troubleshooting

### 🔧 **Common Issues**

1. **Subdomain Not Working**
   - Check DNS configuration
   - Verify domain in TENANT_DOMAINS
   - Check reserved subdomains list

2. **Middleware Not Routing**
   - Verify middleware.js location
   - Check console logs for tenant detection
   - Validate domain configuration

3. **Tenant Context Missing**
   - Check header forwarding
   - Verify tenant configuration
   - Debug middleware execution

## Best Practices

### ✅ **Recommendations**

1. **Keep Configuration Centralized**: All tenant config in one file
2. **Use Reserved Subdomains**: Protect system subdomains
3. **Monitor Performance**: Track per-tenant usage
4. **Plan for Scale**: Design for easy domain addition
5. **Document Changes**: Keep tenant config documented

### 🎯 **Success Metrics**

- Multiple domains serving same content
- Zero data duplication
- Easy domain addition process
- Consistent user experience across domains
