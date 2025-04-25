client/
├── src/
│ ├── components/
│ │ ├── layout/
│ │ │ ├── Header.tsx # Site header with navigation
│ │ │ ├── Footer.tsx # Site footer
│ │ │ └── Layout.tsx # Main layout wrapper
│ │ ├── auth/
│ │ │ ├── LoginForm.tsx # Login form component
│ │ │ └── RegisterForm.tsx # Registration form
│ │ └── posts/
│ │ ├── PostCard.tsx # Individual post display
│ │ ├── PostList.tsx # List of posts
│ │ └── PostForm.tsx # Create/edit post form
│ ├── pages/
│ │ ├── HomePage.tsx # Landing page
│ │ ├── LoginPage.tsx # Login page
│ │ ├── RegisterPage.tsx # Registration page
│ │ ├── PostsPage.tsx # All posts page
│ │ ├── PostDetailPage.tsx # Single post view
│ │ ├── CreatePostPage.tsx # Create post page
│ │ ├── EditPostPage.tsx # Edit post page
│ │ ├── ProfilePage.tsx # User profile page
│ │ └── AdminPage.tsx # Admin dashboard
│ ├── services/
│ │ ├── api.ts # API client setup
│ │ ├── authService.ts # Authentication service
│ │ └── postService.ts # Posts API service
│ ├── context/
│ │ └── AuthContext.tsx # Authentication context
│ ├── hooks/
│ │ ├── useAuth.ts # Authentication hook
│ │ └── usePosts.ts # Posts data hook
│ ├── types/
│ │ ├── User.ts # User type definitions
│ │ └── Post.ts # Post type definitions
│ ├── utils/
│ │ └── formatters.ts # Utility functions
│ ├── App.tsx # Main app with routing
│ └── main.tsx # Entry point
