# Pawtect - Lost Pet Finder 🐾

## Project Overview
Pawtect is a full-stack web application that helps users report and find lost pets. It features user profiles, community posts, adoption requests, and vet appointment scheduling.

## Tech Stack
- **Frontend**: React.js, React Router, Axios
- **Backend**: Node.js, Express.js, MongoDB
- **Styling**: CSS Modules
- **Authentication**: JWT

## Installation

### Prerequisites
- Node.js (v14+)
- MongoDB
- npm or yarn

### Backend Setup
1. Navigate to `server` directory
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` file:
   ```
   MONGODB_URI=mongodb://localhost:27017/pawtect
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```
4. Start server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to `client` directory
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm start
   ```

## Key Components

### Frontend
- **ProfilePage**: User profile management
- **CommunityPage**: Lost pet posts and interactions
- **UserLostPosts**: User's lost pet reports
- **UserAppointments**: Vet appointment management
- **UserAdoptionRequests**: Pet adoption tracking

### Backend
- **User Model**: Handles user authentication and profiles
- **Post Model**: Manages lost pet posts and comments
- **Notification Model**: Tracks user interactions
- **Routes**: API endpoints for all features

## Features
- ✅ User authentication (login/register)
- ✅ Create/view lost pet posts
- ✅ Comment and like functionality
- ✅ Profile management
- ✅ Vet appointment scheduling
- ✅ Adoption requests

## API Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth` | POST | User authentication |
| `/api/profile` | PATCH | Update user profile |
| `/api/posts` | GET/POST | Get all posts/Create new post |
| `/api/posts/user/:userId` | GET | Get user's posts |
| `/api/posts/:postId/like` | PUT | Like/unlike post |

## Environment Variables
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret for JWT tokens
- `PORT`: Server port (default: 5000)

## Deployment
1. Build frontend:
   ```bash
   npm run build
   ```
2. Deploy backend to hosting service (Heroku, AWS, etc.)
3. Configure environment variables in production

## Troubleshooting
- **Images not loading**: Verify static file serving configuration
- **404 errors**: Check API endpoint consistency
- **Authentication issues**: Verify JWT tokens and headers

## Contributors
- Romysa Siddiqui [FA21-BCS-069]
- Anza Malik [FA21-BCS-037]

## License
MIT