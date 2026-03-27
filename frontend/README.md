# Smart Agricultural Support System

A comprehensive React frontend for AgroVision - an AI-powered agricultural platform that helps farmers with disease detection, crop recommendations, and soil testing.

## 🌱 Features

### Farmer Portal
- **Image Prediction**: Upload plant images for AI disease detection
- **Crop Recommendation**: Get personalized crop suggestions based on soil analysis
- **Soil Test Booking**: Schedule on-site soil testing with agricultural officers
- **Request Tracking**: Monitor all requests and view results

### Officer Portal
- **District-based Request Management**: View and claim requests from your district
- **AI Processing**: Run AI analysis on uploaded data
- **Expert Review**: Add professional recommendations to AI results
- **Workflow Management**: Complete multi-stage request processing

## 🛠 Tech Stack

- **Frontend**: React 18 with Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios with JWT interceptors
- **State Management**: React Context API
- **Authentication**: JWT tokens stored in localStorage

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- Backend API running on http://localhost:5000

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Open http://localhost:5173 in your browser

### Build for Production
```bash
npm run build
```

## 📁 Project Structure

```
src/
├── api/                 # API service layer
│   ├── axios.js        # Axios instance with interceptors
│   ├── authService.js  # Authentication API calls
│   └── requestService.js # Request management API
├── components/          # Reusable components
│   ├── Navbar.js       # Navigation bar
│   ├── ProtectedRoute.js # Route protection
│   └── RequestCard.js  # Request display component
├── context/            # React Context
│   └── AuthContext.js  # Authentication state
├── pages/              # Page components
│   ├── auth/           # Authentication pages
│   ├── farmer/         # Farmer-specific pages
│   └── officer/        # Officer-specific pages
├── routes/             # Route configuration
│   └── AppRoutes.js    # Main routing setup
└── App.jsx             # Main app component
```

## 🔐 Authentication Flow

1. **Login**: JWT token received and stored in localStorage
2. **Authorization**: Bearer token automatically attached to all API requests
3. **Role-based Access**: Routes protected by user role (farmer/officer)
4. **Auto-logout**: Token expiration handled automatically

## 📋 Request Workflow

### Farmer Flow
1. Submit request (prediction/crop/soil_test)
2. Track status updates
3. View completed results
4. Download soil reports (if applicable)

### Officer Flow
1. View district-based pending requests
2. Claim requests for processing
3. Run AI analysis
4. Review and enhance AI results
5. Complete requests and send to farmers

## 🎨 UI Features

- **Responsive Design**: Works on all device sizes
- **Status Badges**: Color-coded request status indicators
- **Loading States**: User-friendly loading indicators
- **Error Handling**: Comprehensive error messages
- **Success Feedback**: Confirmation messages for actions

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:5000
```

### Backend Integration
Ensure your backend API is running and accessible at the configured base URL. The frontend expects:

- Authentication endpoints: `/auth/*`
- Request endpoints: `/requests/*`
- JWT token validation

## 📝 API Integration

The frontend integrates with the following backend endpoints:

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/me` - Get current user

### Requests
- `GET /requests/my` - Get user's requests
- `GET /requests/pending` - Get pending requests (officer)
- `POST /requests/` - Submit new request
- `POST /requests/:id/claim` - Claim request
- `POST /requests/:id/process` - Process AI
- `POST /requests/:id/review` - Review result
- `POST /requests/:id/complete` - Complete request

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend allows requests from frontend origin
2. **Token Issues**: Check localStorage for valid JWT token
3. **API Connection**: Verify backend is running on correct port
4. **File Upload**: Ensure proper file size limits and formats

### Development Tips

- Use browser DevTools to inspect API requests
- Check Network tab for failed requests
- Verify JWT token in Application > Local Storage
- Monitor console for authentication errors

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Serve Static Files
The build output can be served by any static file server or deployed to platforms like:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Verify backend API status
3. Review browser console for errors
4. Ensure proper environment configuration
