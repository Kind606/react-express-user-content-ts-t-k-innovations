# User Based Content Platform

A full-stack TypeScript application for managing user-generated content with image support, authentication, and role-based access control.

## Overview

This project is a content platform where users can register, login, and create posts with images. It features:

- User authentication (register, login, logout)
- Content creation with image uploads
- Role-based access control (user/admin roles)
- Admin dashboard for user management
- Responsive UI for all screen sizes

## Tech Stack

### Backend

- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- Authentication via cookie-session
- Password encryption with argon2
- File uploads using Multer
- MongoDB GridFS for image storage

### Frontend

- React 19+ with TypeScript
- React Router v7+ for navigation
- TanStack Query (React Query) for data fetching
- Context API for state management
- Material UI v7+ for UI components

## Features

- **User Authentication**: Register and login securely
- **Content Management**: Create, read, update, and delete posts
- **Image Upload**: Support for jpeg, jpg, png, gif, and webp images
- **GridFS Storage**: Efficient storage and retrieval of images
- **Authorization**: Owner-based access control for content
- **Admin Dashboard**: User management and role editing
- **Responsive Design**: Works on mobile and desktop

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (v6+)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/user-based-content.git
cd user-based-content
```

2. Install backend dependencies

```bash
cd server
npm install
```

3. Install frontend dependencies

```bash
cd ../client
npm install
```

### Configuration

1. Create a `.env` file in the server directory:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/user-content
SESSION_SECRET=your_secret_key
```

### Running the Application

1. Start MongoDB (if running locally)

2. Start the backend server

```bash
cd server
npm run dev
```

3. Start the frontend development server

```bash
cd client
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Testing

Run backend tests:

```bash
cd server
npm test
```

## API Endpoints

### Authentication

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login
- `POST /api/users/logout` - Logout

### Posts

- `GET /api/posts` - Get all posts (public)
- `GET /api/posts/:id` - Get a specific post (public)
- `POST /api/posts` - Create a post (authenticated)
- `PUT /api/posts/:id` - Update a post (owner/admin only)
- `DELETE /api/posts/:id` - Delete a post (owner/admin only)

### Admin

- `GET /api/users` - Get all users (admin only)
- `PUT /api/users/:id` - Update user role (admin only)
- `DELETE /api/users/:id` - Delete a user (admin only)

### Files

- `POST /api/files` - Upload a file (authenticated)
- `GET /api/files/:fileId` - Get a file (public)

## Project Structure

### Backend

```
server/
├── src/
│   ├── app.ts              # Express app configuration
│   ├── server.ts           # Server entry point
│   ├── middlewares.ts      # Auth middlewares
│   ├── controllers/        # Request handlers
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   └── utils/              # Utility functions
└── tests/                  # Test files
```

### Frontend

```
client/
├── src/
│   ├── components/         # UI components
│   ├── pages/              # Page components
│   ├── context/            # React contexts
│   ├── services/           # API client services
│   ├── hooks/              # Custom hooks
│   ├── types/              # TypeScript types
│   └── App.tsx             # Main component
└── public/                 # Static assets
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Created as a school project at Tomas Maldonis and Kevin Hellgren
- Built by T & K Innovation
