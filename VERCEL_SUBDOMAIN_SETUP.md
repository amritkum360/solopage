# Vercel Subdomain Setup Guide

## Problem
Aapka website Vercel par deploy hai, lekin subdomains work nahi kar rahe. `sonu.jirocash.com` 404 error de raha hai.

## Solution Steps

### 1. Vercel Dashboard mein Domain Add karein

1. **Vercel Dashboard** mein jao
2. **Your Project** select karein
3. **Settings** tab mein jao
4. **Domains** section mein jao
5. **Add Domain** button click karein
6. `jirocash.com` add karein

### 2. Wildcard Subdomain Configure karein

Vercel par wildcard subdomain add karne ke liye:

1. **Domains** section mein `jirocash.com` ke liye **Configure** click karein
2. **Add Domain** mein `*.jirocash.com` add karein
3. **Add** button click karein

### 3. DNS Records Update karein

Aapke domain provider (GoDaddy, Namecheap, etc.) mein ye DNS records add karein:

#### Main Domain:
```
Type: A
Name: @ (or jirocash.com)
Value: 76.76.19.34
TTL: 300
```

#### Wildcard Subdomain:
```
Type: A
Name: *
Value: 76.76.19.34
TTL: 300
```

#### WWW (Optional):
```
Type: CNAME
Name: www
Value: jirocash.com
TTL: 300
```

### 4. Vercel Environment Variables

Aapke Vercel project mein ye environment variables add karein:

1. **Settings** → **Environment Variables**
2. Add these variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api
   ```

### 5. Middleware Configuration for Vercel

Vercel par middleware properly work karne ke liye, ensure karein ki `middleware.js` root directory mein hai.

### 6. Alternative Solution: Custom Domain per Website

Agar wildcard subdomain Vercel par work nahi karta, to aap custom domain approach use kar sakte hain:

#### Backend API Update
```javascript
// Add custom domain field to website schema
const websiteSchema = new mongoose.Schema({
  // ... existing fields
  customDomain: {
    type: String,
    trim: true,
    lowercase: true
  }
});
```

#### Frontend Update
- Users ko custom domain option dein
- Domain verification system add karein

## Testing Steps

1. **DNS Propagation**: 24-48 hours wait karein
2. **Test Subdomain**: `test.jirocash.com` try karein
3. **Check Vercel Logs**: Deployment logs check karein

## Troubleshooting

### Common Vercel Issues:

1. **Domain Not Verified**
   - DNS records check karein
   - Vercel domain verification wait karein

2. **Middleware Not Working**
   - `middleware.js` root directory mein hai na check karein
   - Vercel logs check karein

3. **API Connection Issues**
   - Environment variables check karein
   - Backend server running hai na verify karein

## Alternative: VPS Deployment

Agar Vercel par subdomains work nahi karte, to VPS deployment consider karein:

1. **DigitalOcean/AWS** par server setup
2. **Nginx** configure wildcard subdomains ke liye
3. **SSL Certificate** wildcard certificate setup
4. **Domain DNS** point to VPS IP

## Quick Fix for Testing

Agar aap immediately test karna chahte hain:

1. **Local Testing**: Hosts file mein add karein:
   ```
   127.0.0.1 sonu.jirocash.com
   ```

2. **Development Server**: Local server run karein:
   ```bash
   npm run dev
   ```

3. **Test URL**: `http://sonu.jirocash.com:3000` visit karein

## Support

Agar problem persist karta hai:
1. Vercel support contact karein
2. DNS provider support contact karein
3. Check Vercel documentation for subdomain setup
