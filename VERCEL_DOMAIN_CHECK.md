# Vercel Domain Configuration Check

## Step 1: Check Current Domain Setup

1. **Vercel Dashboard** mein jao
2. **Your Project** select karein
3. **Settings** tab mein jao
4. **Domains** section check karein

### Expected Setup:
```
jirocash.com ✅ (Verified)
*.jirocash.com ✅ (Wildcard subdomain)
```

## Step 2: If Domains Not Added

### Add Main Domain:
1. **Add Domain** button click karein
2. `jirocash.com` enter karein
3. **Add** button click karein
4. DNS verification wait karein

### Add Wildcard Subdomain:
1. **Add Domain** button click karein
2. `*.jirocash.com` enter karein
3. **Add** button click karein

## Step 3: DNS Records Check

Aapke domain provider mein ye records hone chahiye:

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

## Step 4: Vercel Nameservers

Agar aap Vercel nameservers use kar rahe hain:
1. Domain provider mein nameservers change karein
2. Vercel ke nameservers add karein:
   - ns1.vercel-dns.com
   - ns2.vercel-dns.com

## Step 5: Test Subdomain

1. **DNS Propagation** wait karein (24-48 hours)
2. Test karein: `https://test.jirocash.com`
3. Vercel logs check karein

## Alternative: Manual Subdomain Addition

Agar wildcard work nahi karta, to manually subdomains add karein:

1. **Add Domain** → `sonu.jirocash.com`
2. **Add Domain** → `test.jirocash.com`
3. Har user ke liye manually add karein

## Quick Test Commands

```bash
# Check DNS resolution
nslookup sonu.jirocash.com
nslookup *.jirocash.com

# Check if domain points to Vercel
dig sonu.jirocash.com
```

## Common Issues & Solutions

### Issue 1: Domain Not Verified
- DNS records check karein
- 24-48 hours wait karein

### Issue 2: Wildcard Not Working
- Manual subdomains add karein
- Vercel support contact karein

### Issue 3: Middleware Not Working
- `middleware.js` root directory mein hai na check karein
- Vercel logs check karein
