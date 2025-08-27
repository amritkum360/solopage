# Subdomain Setup Guide for jirocash.com

## Overview

Your website builder platform supports custom subdomains for user websites. When users create a website with a slug like "mybusiness", it becomes available at `mybusiness.jirocash.com`.

## How It Works

### 1. User Creates Website
- User enters a slug (e.g., "mybusiness") in the website builder
- System validates the slug format and availability
- Website is saved with the slug in the database

### 2. Subdomain Routing
- When someone visits `mybusiness.jirocash.com`:
  - Middleware detects the subdomain "mybusiness"
  - Rewrites the URL to `/site/mybusiness`
  - The site page component fetches and displays the website

### 3. Current Implementation

#### Middleware (`middleware.js`)
```javascript
// Detects subdomains and routes them to /site/[slug]
if (subdomain && subdomain !== "www" && subdomain !== "jirocash") {
  url.pathname = `/site/${subdomain}`;
  return NextResponse.rewrite(url);
}
```

#### Site Page (`src/app/site/[slug]/page.js`)
- Fetches website data by slug
- Renders the appropriate template
- Shows 404 if website doesn't exist or isn't published

## DNS Configuration Required

To make subdomains work in production, you need to configure DNS:

### 1. Wildcard DNS Record
Add this DNS record to your domain provider:

```
Type: A
Name: *
Value: YOUR_SERVER_IP
TTL: 300
```

This creates `*.jirocash.com` pointing to your server.

### 2. Main Domain Record
```
Type: A
Name: @ (or jirocash.com)
Value: YOUR_SERVER_IP
TTL: 300
```

### 3. WWW Record (Optional)
```
Type: CNAME
Name: www
Value: jirocash.com
TTL: 300
```

## Server Configuration

### 1. Web Server (Nginx/Apache)
Configure your web server to handle wildcard subdomains:

#### Nginx Example:
```nginx
server {
    listen 80;
    server_name *.jirocash.com jirocash.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### Apache Example:
```apache
<VirtualHost *:80>
    ServerName jirocash.com
    ServerAlias *.jirocash.com
    
    ProxyPreserveHost On
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/
</VirtualHost>
```

### 2. SSL Certificate
For HTTPS, you'll need a wildcard SSL certificate:
- Let's Encrypt supports wildcard certificates
- Or purchase a wildcard SSL certificate

## Subdomain Validation Rules

The system validates subdomains with these rules:

1. **Length**: 3-63 characters
2. **Characters**: Only lowercase letters, numbers, and hyphens
3. **Format**: Cannot start or end with hyphen
4. **Reserved**: Cannot use reserved subdomains (www, api, admin, etc.)

## Reserved Subdomains

These subdomains are reserved and cannot be used by users:
- www
- api
- admin
- mail
- ftp
- blog
- shop
- store
- support
- help
- docs
- status
- cdn
- static
- assets

## Testing Locally

For local development, you can test subdomains using:

1. **Hosts File** (Windows/Linux/Mac):
   ```
   127.0.0.1 test.jirocash.com
   127.0.0.1 mybusiness.jirocash.com
   ```

2. **Local DNS Server** (like dnsmasq)

3. **Browser Extensions** (like "Subdomain Redirector")

## Security Considerations

1. **Rate Limiting**: Implement rate limiting for subdomain creation
2. **Content Filtering**: Filter inappropriate content in subdomains
3. **Monitoring**: Monitor subdomain usage and abuse
4. **Backup**: Regular backups of website data

## Troubleshooting

### Common Issues:

1. **Subdomain Not Working**
   - Check DNS propagation (can take up to 48 hours)
   - Verify wildcard DNS record is set correctly
   - Check web server configuration

2. **SSL Certificate Issues**
   - Ensure wildcard certificate covers `*.jirocash.com`
   - Check certificate expiration

3. **Middleware Not Working**
   - Verify middleware.js is in the correct location
   - Check Next.js configuration

4. **Database Issues**
   - Ensure slug uniqueness in database
   - Check MongoDB connection

## Monitoring and Analytics

Consider implementing:

1. **Subdomain Analytics**: Track usage of each subdomain
2. **Error Monitoring**: Monitor 404s and other errors
3. **Performance Monitoring**: Track load times for subdomains
4. **Security Monitoring**: Detect suspicious activity

## Future Enhancements

1. **Custom Domains**: Allow users to connect their own domains
2. **Subdomain Aliases**: Allow multiple subdomains for same website
3. **Subdomain Templates**: Different templates for different subdomain types
4. **Subdomain SEO**: Individual SEO settings for each subdomain

## Support

For issues with subdomain setup:
1. Check DNS configuration
2. Verify server settings
3. Test with simple subdomain first
4. Check server logs for errors
