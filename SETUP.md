# Quick Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Frontend dependencies
npm install

# Backend dependencies
cd backendserver
npm install
cd ..
```

### 2. Setup MongoDB

Make sure MongoDB is running on your system:
- **Windows**: Start MongoDB service
- **Mac**: `brew services start mongodb-community`
- **Linux**: `sudo systemctl start mongod`

Or use MongoDB Atlas (cloud database)

### 3. Configure Environment

Create `.env` file in `backendserver/` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/solopage
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

### 4. Start the Application

```bash
# Terminal 1 - Start Backend
cd backendserver
npm run dev

# Terminal 2 - Start Frontend
npm run dev
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

## 🎯 Features Now Working

✅ **User Authentication**
- Register new account
- Login with credentials
- JWT token management
- Secure logout

✅ **Website Management**
- Create new websites
- Edit existing websites
- Publish/unpublish websites
- Delete websites
- View website list in dashboard

✅ **Real-time Data**
- All data stored in MongoDB
- Live preview while editing
- Template-specific forms
- Published websites accessible via unique URLs

✅ **Dashboard**
- View all user websites
- Manage website status
- Quick actions (edit, view, delete, publish)

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Websites
- `POST /api/websites` - Create website
- `GET /api/websites` - Get user's websites
- `GET /api/websites/:id` - Get specific website
- `PUT /api/websites/:id` - Update website
- `DELETE /api/websites/:id` - Delete website

### Public
- `GET /api/sites/:slug` - Get published website
- `GET /api/health` - Health check

## 🎨 Templates Available

1. **Portfolio Template**
   - Professional portfolio layout
   - Skills, experience, education sections
   - Social media links

2. **Business Template**
   - Company information
   - Services offered
   - Team details

3. **Personal Template**
   - Simple personal website
   - Basic information
   - Social links

## 🚀 Usage Flow

1. **Register/Login** → Create account or login
2. **Choose Template** → Select from available templates
3. **Edit Information** → Fill in your details
4. **Preview** → See live preview
5. **Publish** → Make website public
6. **Manage** → Use dashboard to manage websites

## 🛠️ Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`

2. **Port Already in Use**
   - Change PORT in `.env` file
   - Kill existing processes

3. **CORS Errors**
   - Backend CORS is configured for localhost:3000
   - Check frontend URL matches

4. **JWT Token Issues**
   - Clear localStorage and login again
   - Check JWT_SECRET in `.env`

### Debug Commands

```bash
# Check MongoDB connection
mongo --eval "db.runCommand('ping')"

# Check backend health
curl http://localhost:5000/api/health

# Check frontend
curl http://localhost:3000
```

## 📝 Next Steps

- [ ] Add image upload functionality
- [ ] Implement custom domains
- [ ] Add analytics tracking
- [ ] Create more templates
- [ ] Add SEO optimization
- [ ] Implement caching

---

**Happy Website Building! 🎉**
