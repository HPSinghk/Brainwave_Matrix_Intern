# Expense Tracker - MERN Stack Application

A comprehensive expense tracking web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

- User Authentication
- Expense Management (Add/Edit/Delete)
- Expense Categorization
- Dashboard with Analytics
- Budget Tracking
- Expense Reports and Visualizations
- Multiple Currency Support
- Receipt Image Upload
- Expense Reminders

## Tech Stack

- Frontend: React.js, Redux Toolkit, Material-UI
- Backend: Node.js, Express.js
- Database: MongoDB
- Authentication: JWT
- File Storage: AWS S3 (for receipt images)

## Project Structure

```
expense-tracker/
├── client/                 # React frontend
├── server/                 # Node.js backend
├── .gitignore
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a .env file with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a .env file with the following variables:
   ```
   REACT_APP_API_URL=http://localhost:5000
   ```

4. Start the development server:
   ```bash
   npm start
   ```

## API Documentation

The API documentation will be available at `/api-docs` when the server is running.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 