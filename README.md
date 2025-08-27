# SoloPage - Single Page Website Builder

A modern platform for creating beautiful single-page websites with pre-made templates. Built with Next.js 15, React 19, Node.js, and MongoDB.

## 🚀 Features

- **Beautiful Templates**: Portfolio, Business, and Personal website templates
- **Live Preview**: Real-time preview while editing
- **Template-specific Forms**: Customized editing forms for each template
- **User Authentication**: Secure login/registration system
- **Website Management**: Create, edit, publish, and delete websites
- **Responsive Design**: Mobile-friendly templates and interface
- **Modern UI**: Clean, professional design with Tailwind CSS

## 📁 Project Structure

```
solopage_next/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── login/             # Authentication pages
│   │   ├── dashboard/         # User dashboard
│   │   ├── site/[slug]/       # Published websites
│   │   └── page.js            # Main landing page
│   ├── components/
│   │   ├── templates/         # Website templates
│   │   ├── forms/            # Template-specific forms
│   │   └── LandingPage.js    # Landing page component
│   └── services/
│       └── api.js            # Backend API service
├── backendserver/
│   ├── server.js             # Express server
│   ├── package.json          # Backend dependencies
│   └── config.env            # Environment configuration
└── README.md
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud)
- npm or yarn

### 1. Clone the Repository

```bash
git clone <repository-url>
cd solopage_next
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backendserver

# Install dependencies
npm install

# Create environment file
cp config.env .env
# Edit .env with your MongoDB URI and JWT secret

# Start MongoDB (if running locally)
# Make sure MongoDB is running on localhost:27017

# Start the backend server
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate back to root directory
cd ..

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:3000`

### 4. Environment Configuration

#### Backend (.env file in backendserver/)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/solopage
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

#### Frontend (optional - .env.local in root)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
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

## 🎨 Templates

### Portfolio Template
- Professional portfolio layout
- Skills, experience, education sections
- Social media links (GitHub, LinkedIn, Twitter)
- Project showcase

### Business Template
- Company information
- Services offered
- Team details
- Business social links

### Personal Template
- Simple personal website
- Basic information
- Social links
- Personal projects

## 🔧 Development

### Running in Development Mode

```bash
# Terminal 1 - Backend
cd backendserver
npm run dev

# Terminal 2 - Frontend
npm run dev
```

### Building for Production

```bash
# Backend
cd backendserver
npm start

# Frontend
npm run build
npm start
```

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or other cloud database
2. Deploy to Heroku, Vercel, or any Node.js hosting
3. Set environment variables

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy to Vercel, Netlify, or any static hosting
3. Set `NEXT_PUBLIC_API_URL` to your backend URL

## 📝 Usage

1. **Register/Login**: Create an account or login
2. **Choose Template**: Select from Portfolio, Business, or Personal templates
3. **Customize**: Fill in your information using the template-specific forms
4. **Preview**: See live preview of your website
5. **Publish**: Make your website public with a unique URL
6. **Manage**: Edit, update, or delete your websites from the dashboard

## 🛡️ Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS protection
- Environment variable configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints

---

**Happy Website Building! 🎉**
