# Vercel Environment Variables Setup

## Required Environment Variables

Aapko backend server mein ye environment variables add karne honge:

### 1. Vercel Token
```bash
VERCEL_TOKEN=your_vercel_token_here
```

**How to get Vercel Token:**
1. Go to https://vercel.com/account/tokens
2. Click "Create Token"
3. Give it a name (e.g., "Domain Management")
4. Select "Full Account" scope
5. Copy the token

### 2. Vercel Project ID
```bash
VERCEL_PROJECT_ID=your_project_id_here
```

**How to get Project ID:**
1. Go to your Vercel project
2. Click "Settings" tab
3. Scroll down to "General"
4. Copy "Project ID"

### 3. Vercel Team ID (Optional)
```bash
VERCEL_TEAM_ID=your_team_id_here
```

**Only needed if using Vercel Teams**

## Backend Configuration

Add these to your `backendserver/config.env`:

```env
VERCEL_TOKEN=your_vercel_token_here
VERCEL_PROJECT_ID=your_project_id_here
VERCEL_TEAM_ID=your_team_id_here  # Optional
```

## How It Works

1. **User adds custom domain** in website builder
2. **DNS check** verifies nameservers are correct
3. **Auto-add button** appears if domain not in Vercel
4. **One click** adds domain to Vercel automatically
5. **Status updates** show domain activation progress

## Security Notes

- Keep VERCEL_TOKEN secure
- Don't commit tokens to git
- Use environment variables
- Token has full account access

## Testing

After setup:
1. Create website with custom domain
2. Check DNS status
3. Click "Add to Vercel Automatically"
4. Verify domain appears in Vercel dashboard
