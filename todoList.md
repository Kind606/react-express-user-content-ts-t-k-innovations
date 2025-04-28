# Todo List - User Based Content Project

## Git & Setup

- [ ] Setup Git repository
- [ ] Create proper README.md with project description and setup instructions

## Backend (Express API)

- [ ] Setup Express server with TypeScript
- [ ] Connect to MongoDB
- [ ] Implement User model with required fields
  - [ ] username (string)
  - [ ] password (string, encrypted)
  - [ ] isAdmin (boolean)
- [ ] Implement Post model with required fields
  - [ ] title (string)
  - [ ] content (string)
  - [ ] author (ObjectId)
  - [ ] image support
- [ ] Create user authentication routes
  - [ ] Register endpoint
  - [ ] Login endpoint
  - [ ] Authentication middleware
- [ ] Create post routes with proper authorization
  - [ ] Create post (authenticated)
  - [ ] Read posts (public)
  - [ ] Update post (owner only)
  - [ ] Delete post (owner only)
- [ ] Implement image upload functionality
- [ ] Create admin routes
  - [ ] List all users
  - [ ] Update user roles
  - [ ] Delete users
  - [ ] CRUD operations on all posts

## Frontend (React)

- [ ] Setup React client with TypeScript
- [ ] Create authentication UI
  - [ ] Registration form
  - [ ] Login form
  - [ ] Authentication state management
- [ ] Create post management UI
  - [ ] Create post form with image upload
  - [ ] Display all posts (public view)
  - [ ] Edit/Delete options for own posts
- [ ] Create admin dashboard
  - [ ] User management interface
  - [ ] Role modification interface

## Testing

- [ ] Run the provided tests
- [ ] Ensure all requirements are met
- [ ] Manual testing of all features

## Presentation

- [ ] Prepare demo showcasing all functionality
- [ ] Prepare slides for 10-15 minute presentation
