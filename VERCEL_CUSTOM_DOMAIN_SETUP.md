# Vercel Custom Domain Setup Guide

## Problem
DNS properly configured hai, lekin custom domain `hyfreefire.com` 404 error de raha hai.

## Solution Steps

### 1. Vercel Dashboard mein Custom Domain Add karein

1. **Vercel Dashboard** mein jao
2. **Your Project** select karein
3. **Settings** tab mein jao
4. **Domains** section mein jao
5. **Add Domain** button click karein
6. `hyfreefire.com` enter karein
7. **Add** button click karein

### 2. Domain Verification

Vercel automatically verify karega ki domain properly configured hai:
- ✅ **DNS Check**: Nameservers verify karega
- ✅ **Domain Ownership**: Domain aapka hai ya nahi check karega

### 3. Wait for Propagation

- **24-48 hours** wait karein DNS propagation ke liye
- **Vercel Status**: Domain status check karein Vercel dashboard mein

### 4. Test Custom Domain

- `https://hyfreefire.com` visit karein
- Website content dikhna chahiye

## Alternative: Manual DNS Records

Agar Vercel nameservers work nahi karte, to manual DNS records add karein:

### A Records:
```
Type: A
Name: @
Value: 76.76.19.34
TTL: 300

Type: A
Name: *
Value: 76.76.19.34
TTL: 300
```

### CNAME Records:
```
Type: CNAME
Name: www
Value: hyfreefire.com
TTL: 300
```

## Troubleshooting

### Issue 1: Domain Not Verified
- DNS propagation wait karein
- Vercel dashboard mein status check karein

### Issue 2: 404 Error
- Vercel mein domain add karein
- Project settings check karein

### Issue 3: SSL Certificate
- Vercel automatically SSL certificate provide karega
- Wait for certificate generation

## Quick Test

1. **Vercel Dashboard** → **Domains** → **Add Domain**
2. `hyfreefire.com` add karein
3. **Verify** button click karein
4. Status check karein

## Expected Result

After setup:
- `https://hyfreefire.com` → John Doe ka portfolio website
- Same content as `https://amrit.jirocash.com`
- SSL certificate automatically applied
