# EventSphere - Tech Event Booking Platform

A comprehensive React-based event booking platform with admin capabilities, payment integration, and professional UI.

## 🎯 Features Overview

### Core Features
- ✅ **User Authentication** - Login and signup with JWT tokens
- ✅ **Dashboard** - Real-time statistics and recent events
- ✅ **Event Browsing** - View all tech events with details
- ✅ **Advanced Filtering** - Filter by:
  - Search term (title/description)
  - Event type (Web Dev, AI/ML, DevOps, etc.)
  - Status (Upcoming/Past events)
- ✅ **Seat Booking** - Cinema-style seat selection
- ✅ **Payment Processing** - Multiple payment methods:
  - Credit/Debit Card
  - PayPal
  - Apple Pay
  - Google Pay
  - Bank Transfer
- ✅ **Booking Management** - View, manage, and cancel bookings
- ✅ **User Profile** - Edit profile information

### Admin Features
- ✅ **Admin Panel** - Exclusive admin dashboard
- ✅ **Event Management**:
  - Create new events
  - Delete events
  - Assign rooms with different capacities
- ✅ **Room Management**:
  - Create rooms with specific capacity
  - Delete rooms
  - Assign rooms to events
- ✅ **User Management**:
  - View all users
  - Assign roles (Admin, User, Event Organizer)
  - Role-based access control

### UI/UX Features
- ✅ **Responsive Sidebar Navigation** - Easy access to all features
- ✅ **Modern Dashboard** - Statistics cards and recent events
- ✅ **Professional Styling** - Gradient colors, smooth animations
- ✅ **Mobile Responsive** - Works on all device sizes
- ✅ **Alert System** - Success/error notifications
- ✅ **Loading States** - Spinner animations during data fetching
- ✅ **Tab Navigation** - Organized content sections

## 📁 Project Structure

```
src/
├── pages/
│   ├── Dashboard.js          # Main dashboard with stats
│   ├── Events.js             # Event listing with filters
│   ├── Booking.js            # Seat selection and booking
│   ├── MyBookings.js         # User's bookings management
│   ├── Profile.js            # User profile with edit capability
│   ├── Rooms.js              # Room management (Admin)
│   ├── Payments.js           # Payment processing
│   ├── AdminPanel.js         # Complete admin dashboard
│   └── Login.js              # Authentication
├── components/
│   ├── Sidebar.js            # Navigation sidebar
│   ├── Sidebar.css           # Sidebar styling
│   ├── Header.js             # Top header bar
│   ├── Footer.js             # Footer
│   ├── Alert.js              # Notification component
│   ├── EventCard.js          # Event display card
│   ├── EventFilters.js       # Filter component
│   ├── Loading.js            # Loading spinner
│   └── EmptyState.js         # Empty state message
├── services/
│   └── api.js                # API client with axios
├── styles/
│   └── global.css            # Global styling
└── App.js                    # Main app component
```

## 🔑 Key Pages & Functionality

### 1. Dashboard
- Total events, bookings, and rooms statistics
- Recent events listing
- Quick overview of platform activity

### 2. Events
- Browse all tech events
- Filter by:
  - Event name/description (search)
  - Event type (Web Development, AI/ML, DevOps, etc.)
  - Status (Upcoming/Past)
- One-click booking

### 3. Booking
- Cinema-style seat layout
- Visual seat status (Available/Booked/Selected)
- Real-time seat updates
- Automatic redirect after booking

### 4. Payments
- View all pending bookings
- 6 payment methods available
- Payment confirmation
- Status tracking (Paid/Pending)

### 5. Admin Panel
**Events Tab:**
- Create new events with room assignment
- Set event date and time
- Delete events
- Real-time event list

**Users Tab:**
- View all users
- Assign roles (Admin, User, Event Organizer)
- Role-based administration

### 6. Rooms
- View all available rooms
- Room capacity display
- Admin can create and delete rooms

### 7. Profile
- View user information
- Edit profile details
- Display admin status
- Show member since date

## 🎨 Design Features

### Color Scheme
- Primary: #667eea (Purple-Blue)
- Secondary: #764ba2 (Purple)
- Success: #4caf50 (Green)
- Error: #ef5350 (Red)
- Neutral: #2c3e50 (Dark)

### Responsive Design
- Sidebar: Collapses on mobile
- Sidebar overlay: Appears on small screens
- Grid layouts: Adjust based on screen size
- Mobile-friendly forms and buttons

### Animations
- Smooth page transitions
- Card hover effects
- Button state changes
- Loading spinner

## 🔐 Security & Access Control

- **JWT Authentication** - Secure token-based auth
- **Role-Based Access** - Admin panel only for admins
- **Logout** - Clear auth token and session
- **Protected Routes** - Only authenticated users can access features

## 💾 State Management

- **React Hooks** - useState, useEffect, useCallback
- **Local Storage** - Token persistence
- **API Integration** - Axios with interceptors

## 📱 Responsive Breakpoints

- Desktop: Full layout with sidebar
- Tablet: Optimized spacing
- Mobile: Collapsed sidebar with toggle, single column grids

## 🚀 Ready for Integration

All components are built to seamlessly integrate with your .NET backend:
- Event CRUD operations
- User authentication and role management
- Booking management
- Room and seat management
- Payment processing endpoints

## 📝 Notes

The frontend is production-ready and includes:
- Error handling
- Loading states
- Form validation
- User feedback
- Accessibility considerations

Admin features are properly gated and only visible/accessible to users with Admin role.
