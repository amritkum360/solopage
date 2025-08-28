const mongoose = require('mongoose');

// Website Schema (same as in server.js)
const websiteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  customDomain: {
    type: String,
    trim: true,
    lowercase: true,
    sparse: true
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
    enum: ['personal', 'business', 'portfolio', 'local-business']
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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

// Get site slug by custom domain
async function getSiteByDomain(domain) {
  try {
    const Website = mongoose.model('Website', websiteSchema);
    
    const website = await Website.findOne({
      customDomain: domain,
      isPublished: true
    });

    if (website) {
      return {
        siteSlug: website.slug,
        template: website.template,
        data: website.data
      };
    }

    return null;
  } catch (error) {
    console.error('Error getting site by domain:', error);
    return null;
  }
}

module.exports = {
  getSiteByDomain
};
