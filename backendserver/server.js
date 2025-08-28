const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');
require('dotenv').config({ path: path.join(__dirname, 'config.env') });

// Debug: Log environment variables (only in development)
if (process.env.NODE_ENV === 'development') {
  console.log('Environment Variables Debug:');
  console.log('VERCEL_TOKEN:', process.env.VERCEL_TOKEN ? 'Present' : 'Missing');
  console.log('VERCEL_PROJECT_ID:', process.env.VERCEL_PROJECT_ID ? 'Present' : 'Missing');
  console.log('VERCEL_TEAM_ID:', process.env.VERCEL_TEAM_ID ? 'Present' : 'Missing');
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/solopage', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Website Schema
const websiteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  customDomain: {
    type: String,
    trim: true,
    lowercase: true,
    sparse: true // Allows multiple null values
  },
  domainStatus: {
    type: String,
    enum: ['pending', 'valid', 'invalid', 'not_added'],
    default: 'not_added'
  },
  vercelDomainId: {
    type: String,
    trim: true
  },
  template: {
    type: String,
    required: true,
    enum: ['portfolio', 'business', 'personal', 'localbusiness']
  },
  data: {
    type: Object,
    required: true
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema);
const Website = mongoose.model('Website', websiteSchema);

// Multer configuration for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const userId = req.user.userId;
    const userDir = path.join(__dirname, 'userassets', userId.toString());
    
    // Create user directory if it doesn't exist
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }
    
    cb(null, userDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// JWT Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// User Registration
app.post('/api/auth/register', [
  body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const user = new User({
      username,
      email,
      password: hashedPassword
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// User Login
app.post('/api/auth/login', [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user profile
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create website
app.post('/api/websites', authenticateToken, [
  body('title').notEmpty().withMessage('Title is required'),
  body('slug').notEmpty().withMessage('Slug is required'),
  body('template').isIn(['portfolio', 'business', 'personal', 'localbusiness']).withMessage('Invalid template'),
  body('data').isObject().withMessage('Data is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, slug, template, data, customDomain, isPublished } = req.body;

    // Check if slug already exists
    const existingWebsite = await Website.findOne({ slug });
    if (existingWebsite) {
      return res.status(400).json({ message: 'Slug already exists' });
    }

    // Check if custom domain already exists (if provided and trying to publish)
    if (customDomain && isPublished) {
      const existingCustomDomain = await Website.findOne({ customDomain, isPublished: true });
      if (existingCustomDomain) {
        return res.status(400).json({ 
          message: 'Custom domain already exists',
          details: `This custom domain is already being used by another published website: "${existingCustomDomain.title}". Please unpublish the other website first or choose a different domain.`
        });
      }
    }

    const website = new Website({
      userId: req.user.userId,
      title,
      slug,
      customDomain,
      template,
      data,
      isPublished: isPublished || false
    });

    await website.save();

    res.status(201).json({
      message: 'Website created successfully',
      website
    });

  } catch (error) {
    console.error('Create website error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's websites
app.get('/api/websites', authenticateToken, async (req, res) => {
  try {
    const websites = await Website.find({ userId: req.user.userId })
      .sort({ createdAt: -1 });
    
    res.json({ websites });
  } catch (error) {
    console.error('Get websites error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific website
app.get('/api/websites/:id', authenticateToken, async (req, res) => {
  try {
    const website = await Website.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!website) {
      return res.status(404).json({ message: 'Website not found' });
    }

    res.json({ website });
  } catch (error) {
    console.error('Get website error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update website
app.put('/api/websites/:id', authenticateToken, [
  body('title').optional().notEmpty().withMessage('Title cannot be empty if provided'),
  body('template').optional().isIn(['portfolio', 'business', 'personal', 'localbusiness']).withMessage('Invalid template'),
  body('data').optional().isObject().withMessage('Data must be an object if provided')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, template, data, isPublished, slug, customDomain } = req.body;

    // Check if slug already exists (if being updated)
    if (slug) {
      const existingWebsite = await Website.findOne({ slug, _id: { $ne: req.params.id } });
      if (existingWebsite) {
        return res.status(400).json({ message: 'Slug already exists' });
      }
    }

    // Check if custom domain already exists (if being updated and trying to publish)
    if (customDomain && isPublished) {
      const existingCustomDomain = await Website.findOne({ customDomain, _id: { $ne: req.params.id }, isPublished: true });
      if (existingCustomDomain) {
        return res.status(400).json({ 
          message: 'Custom domain already exists',
          details: `This custom domain is already being used by another published website: "${existingCustomDomain.title}". Please unpublish the other website first or choose a different domain.`
        });
      }
    }

    // Build update object with only provided fields
    const updateData = { updatedAt: Date.now() };
    if (title !== undefined) updateData.title = title;
    if (template !== undefined) updateData.template = template;
    if (data !== undefined) updateData.data = data;
    if (isPublished !== undefined) updateData.isPublished = isPublished;
    if (slug !== undefined) updateData.slug = slug;
    if (customDomain !== undefined) updateData.customDomain = customDomain;

    const website = await Website.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      updateData,
      { new: true }
    );

    if (!website) {
      return res.status(404).json({ message: 'Website not found' });
    }

    res.json({
      message: 'Website updated successfully',
      website
    });

  } catch (error) {
    console.error('Update website error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle website publish status
app.patch('/api/websites/:id/toggle-publish', authenticateToken, async (req, res) => {
  try {
    const website = await Website.findOne({ _id: req.params.id, userId: req.user.userId });
    
    if (!website) {
      return res.status(404).json({ message: 'Website not found' });
    }

    website.isPublished = !website.isPublished;
    website.updatedAt = Date.now();
    await website.save();

    res.json({
      message: 'Website publish status updated successfully',
      website
    });

  } catch (error) {
    console.error('Toggle publish error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete website
app.delete('/api/websites/:id', authenticateToken, async (req, res) => {
  try {
    const website = await Website.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!website) {
      return res.status(404).json({ message: 'Website not found' });
    }

    res.json({ message: 'Website deleted successfully' });

  } catch (error) {
    console.error('Delete website error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Check slug availability
app.get('/api/check-slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    // Check if slug exists
    const existingWebsite = await Website.findOne({ slug });
    
    res.json({ 
      available: !existingWebsite,
      message: existingWebsite ? 'Slug already exists' : 'Slug is available'
    });
  } catch (error) {
    console.error('Check slug error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get published website by slug (public route)
app.get('/api/sites/:slug', async (req, res) => {
  try {
    const website = await Website.findOne({
      slug: req.params.slug,
      isPublished: true
    });

    if (!website) {
      return res.status(404).json({ message: 'Website not found' });
    }

    res.json({ website });
  } catch (error) {
    console.error('Get published website error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Check custom domain status
app.get('/api/check-domain-status/:domain', async (req, res) => {
  try {
    const { domain } = req.params;
    
    // Check if domain exists in our database
    const website = await Website.findOne({ customDomain: domain });
    
    if (!website) {
      return res.json({ 
        status: 'not_found',
        message: 'Domain not found in our system'
      });
    }

    // Note: We don't check if the website is published here because we want to show DNS status
    // regardless of the website's publish status. The frontend will handle showing/hiding
    // DNS instructions based on the website's publish status.

    // Perform real DNS nameserver check
    try {
      const dns = require('dns').promises;
      
      // Get nameservers for the domain
      const nameservers = await dns.resolveNs(domain);
      
      // Check if Vercel nameservers are configured
      const vercelNameservers = [
        'ns1.vercel-dns.com',
        'ns2.vercel-dns.com',
        'ns3.vercel-dns.com',
        'ns4.vercel-dns.com'
      ];
      
      const hasVercelNameservers = nameservers.some(ns => 
        vercelNameservers.some(vercelNs => 
          ns.toLowerCase().includes(vercelNs.toLowerCase())
        )
      );
      
      if (hasVercelNameservers) {
        return res.json({ 
          status: 'configured',
          message: 'Domain is properly configured with Vercel nameservers',
          nameservers: nameservers,
          website: {
            slug: website.slug,
            title: website.title
          }
        });
      } else {
        return res.json({ 
          status: 'dns_not_configured',
          message: 'Domain nameservers are not pointing to Vercel. Please add Vercel nameservers in your domain provider.',
          currentNameservers: nameservers,
          requiredNameservers: vercelNameservers,
          website: {
            slug: website.slug,
            title: website.title
          }
        });
      }
      
    } catch (dnsError) {
      console.error('DNS check error:', dnsError);
      return res.json({ 
        status: 'dns_error',
        message: 'Unable to check DNS configuration. Please ensure domain is properly configured.',
        website: {
          slug: website.slug,
          title: website.title
        }
      });
    }

  } catch (error) {
    console.error('Check domain status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Check if custom domain is already used by another published website
app.get('/api/check-domain-usage/:domain', async (req, res) => {
  try {
    const { domain } = req.params;
    const { exclude } = req.query; // Website ID to exclude from check (for updates)
    
    // Build query to find published websites with this custom domain
    const query = {
      customDomain: domain,
      isPublished: true
    };
    
    // Exclude current website if updating
    if (exclude) {
      query._id = { $ne: exclude };
    }
    
    const existingWebsite = await Website.findOne(query);
    
    if (existingWebsite) {
      return res.json({
        isUsed: true,
        message: `This custom domain is already being used by another published website: "${existingWebsite.title}"`,
        existingWebsite: {
          id: existingWebsite._id,
          title: existingWebsite.title,
          slug: existingWebsite.slug
        }
      });
    } else {
      return res.json({
        isUsed: false,
        message: 'Custom domain is available'
      });
    }
    
  } catch (error) {
    console.error('Check domain usage error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get published website by custom domain
app.get('/api/custom-domain/:domain', async (req, res) => {
  try {
    const { domain } = req.params;
    
    const website = await Website.findOne({
      customDomain: domain,
      isPublished: true
    });

    if (!website) {
      return res.status(404).json({ 
        success: false,
        message: 'Website not found' 
      });
    }

    res.json({ 
      success: true,
      website: website 
    });
  } catch (error) {
    console.error('Get custom domain website error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add custom domain to Vercel automatically
app.post('/api/add-custom-domain', authenticateToken, async (req, res) => {
  try {
    const { domain } = req.body;
    
    if (!domain) {
      return res.status(400).json({ message: 'Domain is required' });
    }

    // Check if domain exists in our database
    const website = await Website.findOne({ 
      customDomain: domain,
      userId: req.user.userId 
    });
    
    if (!website) {
      return res.status(404).json({ message: 'Domain not found in your websites' });
    }

    // Vercel API configuration
    const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
    const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID;
    const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID;

    if (!VERCEL_TOKEN || !VERCEL_PROJECT_ID) {
      return res.status(500).json({ 
        message: 'Vercel configuration missing. Please contact administrator.' 
      });
    }

    // Add domain to Vercel using API
    const vercelResponse = await fetch(`https://api.vercel.com/v1/projects/${VERCEL_PROJECT_ID}/domains`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${VERCEL_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: domain,
        ...(VERCEL_TEAM_ID && { teamId: VERCEL_TEAM_ID })
      })
    });

    const vercelData = await vercelResponse.json();

    if (!vercelResponse.ok) {
      console.error('Vercel API error:', vercelData);
      return res.status(400).json({ 
        message: `Failed to add domain to Vercel: ${vercelData.error?.message || 'Unknown error'}` 
      });
    }

    // Update website with domain status
    website.domainStatus = 'pending';
    website.vercelDomainId = vercelData.id;
    await website.save();

    res.json({
      message: 'Domain added to Vercel successfully',
      domain: domain,
      status: 'pending',
      vercelData: vercelData
    });

  } catch (error) {
    console.error('Add custom domain error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Check custom domain status in Vercel
app.get('/api/check-vercel-domain/:domain', authenticateToken, async (req, res) => {
  try {
    const { domain } = req.params;
    
    // Check if domain exists in our database
    const website = await Website.findOne({ 
      customDomain: domain,
      userId: req.user.userId 
    });
    
    if (!website) {
      return res.status(404).json({ message: 'Domain not found' });
    }

    // Vercel API configuration
    const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
    const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID;
    const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID;

    if (!VERCEL_TOKEN || !VERCEL_PROJECT_ID) {
      return res.status(500).json({ 
        message: 'Vercel configuration missing' 
      });
    }

    // Check domain status in Vercel
    const vercelResponse = await fetch(`https://api.vercel.com/v1/projects/${VERCEL_PROJECT_ID}/domains/${domain}`, {
      headers: {
        'Authorization': `Bearer ${VERCEL_TOKEN}`,
        ...(VERCEL_TEAM_ID && { 'x-team-id': VERCEL_TEAM_ID })
      }
    });

    if (!vercelResponse.ok) {
      // Domain not found in our project, check if it's assigned to another project
      try {
        const allDomainsResponse = await fetch(`https://api.vercel.com/v1/domains`, {
          headers: {
            'Authorization': `Bearer ${VERCEL_TOKEN}`,
            ...(VERCEL_TEAM_ID && { 'x-team-id': VERCEL_TEAM_ID })
          }
        });

        if (allDomainsResponse.ok) {
          const allDomains = await allDomainsResponse.json();
          const domainInfo = allDomains.domains?.find(d => d.name === domain);
          
          if (domainInfo) {
            // Domain exists but assigned to another project
            return res.json({
              success: true,
              domain: {
                name: domain,
                projectId: domainInfo.projectId,
                assignedToOtherProject: domainInfo.projectId !== VERCEL_PROJECT_ID
              },
              status: 'assigned_to_other',
              message: 'Domain is assigned to another Vercel project'
            });
          }
        }
      } catch (error) {
        console.error('Error checking all domains:', error);
      }

      return res.json({
        success: true,
        domain: null,
        status: 'not_added',
        message: 'Domain not added to Vercel yet'
      });
    }

    const vercelData = await vercelResponse.json();

    // Update website status
    website.domainStatus = vercelData.verification?.state || 'pending';
    await website.save();

    res.json({
      success: true,
      domain: {
        name: domain,
        projectId: VERCEL_PROJECT_ID,
        assignedToOtherProject: false
      },
      status: vercelData.verification?.state || 'pending',
      message: vercelData.verification?.state === 'VALID' ? 'Domain is active' : 'Domain verification pending',
      vercelData: vercelData
    });

  } catch (error) {
    console.error('Check Vercel domain error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Debug: Check all custom domains in database
app.get('/api/debug/custom-domains', async (req, res) => {
  try {
    const websites = await Website.find({ customDomain: { $exists: true, $ne: null } });
    
    res.json({
      success: true,
      count: websites.length,
      websites: websites.map(w => ({
        id: w._id,
        slug: w.slug,
        customDomain: w.customDomain,
        isPublished: w.isPublished,
        template: w.template
      }))
    });
  } catch (error) {
    console.error('Debug custom domains error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Debug: Check Vercel configuration
app.get('/api/debug/vercel-config', async (req, res) => {
  try {
    const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
    const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID;
    const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID;
    
    res.json({
      success: true,
      vercelToken: VERCEL_TOKEN ? 'Present' : 'Missing',
      vercelProjectId: VERCEL_PROJECT_ID ? 'Present' : 'Missing',
      vercelTeamId: VERCEL_TEAM_ID ? 'Present' : 'Missing',
      allConfigured: !!(VERCEL_TOKEN && VERCEL_PROJECT_ID),
      message: VERCEL_TOKEN && VERCEL_PROJECT_ID ? 'Vercel configuration is complete' : 'Vercel configuration is incomplete'
    });
  } catch (error) {
    console.error('Debug Vercel config error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Image upload routes
app.post('/api/upload-image', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const imageUrl = `/api/user-images/${req.user.userId}/${req.file.filename}`;
    
    res.json({
      message: 'Image uploaded successfully',
      imageUrl: imageUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ message: 'Failed to upload image' });
  }
});

// Get user's uploaded images
app.get('/api/user-images/:userId', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    const userDir = path.join(__dirname, 'userassets', userId);
    
    if (!fs.existsSync(userDir)) {
      return res.json({ images: [] });
    }

    const files = fs.readdirSync(userDir);
    const images = files
      .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .map(file => ({
        filename: file,
        url: `/api/user-images/${userId}/${file}`,
        uploadedAt: fs.statSync(path.join(userDir, file)).mtime
      }))
      .sort((a, b) => b.uploadedAt - a.uploadedAt);

    res.json({ images });
  } catch (error) {
    console.error('Get user images error:', error);
    res.status(500).json({ message: 'Failed to get images' });
  }
});

// Serve user images (public endpoint - no authentication required)
app.get('/api/user-images/:userId/:filename', (req, res) => {
  try {
    const { userId, filename } = req.params;
    const imagePath = path.join(__dirname, 'userassets', userId, filename);
    
    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({ message: 'Image not found' });
    }

    res.sendFile(imagePath);
  } catch (error) {
    console.error('Serve image error:', error);
    res.status(500).json({ message: 'Failed to serve image' });
  }
});

// Delete user image
app.delete('/api/user-images/:userId/:filename', authenticateToken, async (req, res) => {
  try {
    const { userId, filename } = req.params;
    const imagePath = path.join(__dirname, 'userassets', userId, filename);
    
    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({ message: 'Image not found' });
    }

    fs.unlinkSync(imagePath);
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ message: 'Failed to delete image' });
  }
});

// Get site slug by custom domain (for middleware)
app.get('/api/site-by-domain/:domain', async (req, res) => {
  try {
    const { domain } = req.params;
    
    const website = await Website.findOne({
      customDomain: domain,
      isPublished: true
    });

    if (website) {
      res.json({
        success: true,
        siteSlug: website.slug,
        template: website.template
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Site not found for this domain'
      });
    }
  } catch (error) {
    console.error('Get site by domain error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get website by slug
app.get('/api/websites/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    const website = await Website.findOne({
      slug: slug,
      isPublished: true
    });

    if (!website) {
      return res.status(404).json({ 
        success: false,
        message: 'Website not found' 
      });
    }

    res.json({ 
      success: true,
      website: website 
    });
  } catch (error) {
    console.error('Get website by slug error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
