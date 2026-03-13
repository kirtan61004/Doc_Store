
<div align="center">

# 📚 Doc Store

### Modern Document Management System for Educational Institutions

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.17.1-green.svg)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/React-19.1.1-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.1.0-lightgrey.svg)](https://expressjs.com/)

A modern, full-stack MERN (MongoDB, Express, React, Node.js) document management platform designed for educational institutions. Doc Store streamlines the process of managing, uploading, and assigning PDF documents between students and faculty with a beautiful, intuitive interface featuring glassmorphism design and animated backgrounds.

[Features](#features) • [Installation](#installation) • [Usage](#usage) • [API Docs](#api-endpoints) • [Contributing](#contributing)

</div>

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/kirtankacha/online-document-repo.git
cd online-document-repo

# Install dependencies
cd Server && npm install
cd ../Client && npm install

# Start MongoDB
brew services start mongodb-community  # macOS
# or
net start MongoDB  # Windows

# Run the application (in two terminals)
# Terminal 1:
cd Server && node server.js

# Terminal 2:
cd Client && npm run dev

# Access at http://localhost:5173
# Admin panel at http://localhost:5173/adminlogin (ID: 92200103237, Pass: kirtan)
```

## 📋 Table of Contents

- [Features](#features)
- [Screenshots](#screenshots)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [User Roles](#user-roles)
- [Admin Access](#admin-access)
- [Folder Structure](#folder-structure)
- [API Endpoints](#api-endpoints)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## 🎯 Key Highlights

- ✨ **Beautiful Modern UI** - Glassmorphism design with navy blue theme
- 🎨 **Animated Backgrounds** - Dynamic formulas and code snippets floating
- 📱 **Fully Responsive** - Works seamlessly on all devices
- 🔒 **Secure & Reliable** - JWT authentication with encrypted passwords
- ⚡ **Fast Performance** - Optimized React with Vite build tool
- 🎓 **Education-Focused** - Designed specifically for academic institutions

## 📸 Screenshots

### Home Page
*Beautiful landing page with animated background featuring mathematical formulas and code snippets, stats section, how-it-works process cards, feature highlights, testimonials slider, and call-to-action section.*

### Student Dashboard
*Clean interface for viewing assigned tasks, uploading responses, and tracking submission status with real-time updates.*

### Faculty Panel
*Comprehensive dashboard for task assignment, reviewing student submissions, and managing student accounts.*

### Admin Panel
*Full system control with user management, document oversight, and system analytics.*

> **Note**: Add screenshots to showcase your application by creating an `assets` or `screenshots` folder and updating the paths here.

## ✨ Features

### For Students
- 📚 **Document Upload**: Upload PDF responses to assigned tasks with drag-and-drop support
- 📥 **View Documents**: Access and download all assigned documents anytime
- 🔍 **Smart Search**: Quickly find documents with powerful filtering capabilities
- 📊 **Submission Tracking**: Track the status of submitted assignments (pending/approved/rejected)
- 🔐 **Secure Authentication**: JWT-based secure login and registration
- 📱 **Responsive Design**: Access from any device with mobile-friendly interface

### For Faculty
- 📤 **Task Assignment**: Assign PDF documents and tasks to students
- ✅ **Review Submissions**: Approve or reject student submissions with feedback
- 👥 **Student Management**: View and manage student accounts
- 📈 **Progress Monitoring**: Track student submission rates and performance
- 🔔 **Notifications**: Real-time updates on student submissions

### For Admins
- 👨‍💼 **User Management**: Manage both student and faculty accounts
- 📂 **Document Oversight**: View all uploaded documents across the system
- 🔒 **System Security**: Monitor and control system access
- 📊 **Analytics Dashboard**: View system-wide statistics and activity

### Technical Features
- 🔐 **JWT Authentication**: Secure token-based authentication
- 🎨 **Modern UI/UX**: Glassmorphism effects with animated backgrounds featuring formulas and code snippets
- 🌈 **Navy Blue Theme**: Professional color scheme throughout the application
- ⚡ **Fast Performance**: Optimized for quick load times and smooth transitions
- 🔄 **Real-time Updates**: Instant feedback with toast notifications
- 📁 **File Management**: Multer integration for efficient file uploads
- 🔍 **OCR Support**: Tesseract.js integration for document text extraction

## 🛠 Technologies Used

### Frontend
- **React.js** (v19.1.1) - UI library
- **React Router DOM** (v7.8.0) - Client-side routing
- **Vite** (v7.1.0) - Build tool and development server
- **Axios** - HTTP client for API requests
- **React Toastify** - Toast notifications
- **React Icons** - Icon library
- **jsPDF** - PDF generation

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** (v5.1.0) - Web application framework
- **MongoDB** (v8.17.1) - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** (jsonwebtoken v9.0.2) - Authentication
- **Bcrypt** (v6.0.0) - Password hashing
- **Multer** (v2.0.2) - File upload handling
- **Tesseract.js** (v6.0.1) - OCR processing
- **CORS** - Cross-origin resource sharing
- **Nodemon** - Development server auto-restart

### Development Tools
- **Vite** - Lightning-fast build tool
- **ESLint** - Code linting
- **Git** - Version control
- **npm** - Package management

### Design & Styling
- **CSS3** - Modern styling techniques
- **Glassmorphism** - Translucent frosted glass effects
- **CSS Variables** - Dynamic theming
- **Animations** - Smooth transitions and effects
- **Responsive Design** - Mobile-first approach

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16.x or higher) - [Download](https://nodejs.org/)
- **npm** (v8.x or higher) - Comes with Node.js
- **MongoDB** (v4.x or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Git** - [Download](https://git-scm.com/)

## 🚀 Installation

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/kirtankacha/online-document-repo.git
cd online-document-repo
```

### Step 2: Install Server Dependencies

```bash
cd Server
npm install
```

**Note for macOS users**: If you encounter bcrypt issues, rebuild it:
```bash
npm rebuild bcrypt --build-from-source
```

### Step 3: Install Client Dependencies

```bash
cd ../Client
npm install
```

### Step 4: Set Up MongoDB

1. **Start MongoDB Service:**

   **On Windows:**
   ```bash
   net start MongoDB
   ```

   **On macOS:**
   ```bash
   brew services start mongodb-community
   ```

   **On Linux:**
   ```bash
   sudo systemctl start mongod
   ```

2. **Verify MongoDB is running:**
   ```bash
   mongosh
   ```

   The default connection will be: `mongodb://127.0.0.1:27017/taskdb`

### Step 5: Run the Application

Open two terminal windows:

**Terminal 1 - Start the Backend Server:**
```bash
cd Server
node server.js
```

The server will start on `http://localhost:2000`

**Terminal 2 - Start the Frontend Client:**
```bash
cd Client
npm run dev
```

The client will start on `http://localhost:5173`

### Step 6: Access the Application

- **Main Application**: Open your browser and navigate to `http://localhost:5173`
- **Admin Panel**: Navigate to `http://localhost:5173/adminlogin`

## 💻 Development

### Running in Development Mode

The application is configured for hot-reloading in development:

**Backend (with Nodemon):**
```bash
cd Server
npm start  # Uses nodemon for auto-restart
```

**Frontend (with Vite):**
```bash
cd Client
npm run dev  # Hot module replacement enabled
```

### Building for Production

**Build Frontend:**
```bash
cd Client
npm run build
```

This creates an optimized production build in the `dist` folder.

**Preview Production Build:**
```bash
npm run preview
```

### Code Quality

**Run ESLint:**
```bash
cd Client
npm run lint
```

### Recommended VS Code Extensions

- ESLint
- Prettier - Code formatter
- MongoDB for VS Code
- Thunder Client (API testing)
- React Developer Tools

## ⚙️ Configuration

### Environment Variables

The application uses the following default configurations:

**Server (Port 2000):**
- MongoDB URI: `mongodb://127.0.0.1:27017/taskdb`
- JWT Secret: (Configured in server code)
- Upload Directory: `Server/uploads/`

**Client (Port 5173):**
- API Base URL: `http://localhost:2000`

To modify these, create a `.env` file in the Server directory:

```env
PORT=2000
MONGO_URI=mongodb://127.0.0.1:27017/taskdb
JWT_SECRET=your_jwt_secret_key
```

## 📖 Usage

### Student Workflow

1. **Sign Up**: Create an account at `/signup`
2. **Login**: Access your account at `/login`
3. **View Tasks**: Navigate to `/view` to see assigned documents
4. **Upload Response**: Go to `/upload` to submit your work
5. **Track Status**: Monitor approval status in your dashboard

### Faculty Workflow

1. **Sign Up**: Register as faculty at `/facultysignup`
2. **Login**: Access faculty portal at `/login`
3. **Assign Tasks**: Upload documents and assign to students
4. **Review Submissions**: Approve or reject student responses
5. **Manage Students**: View student progress and submissions

### Admin Workflow

1. **Login**: Access admin panel at `/adminlogin`
2. **Manage Users**: View and control student/faculty accounts
3. **Monitor System**: Check uploads, activity, and system health
4. **Review Content**: Oversee all documents in the system

## 👥 User Roles

### Student
- Register and login with credentials
- View assigned documents and tasks
- Upload PDF responses
- Track submission status
- Download approved documents

### Faculty
- Register and login with faculty credentials
- Create and assign tasks to students
- Upload educational materials
- Review student submissions
- Approve/reject responses with feedback

### Admin
- Full system access
- User management (students and faculty)
- System monitoring and analytics
- Content moderation
- Database oversight

## 🔑 Admin Access

To access the admin panel and manage the system:

**Admin Login Credentials:**
- **Route**: `/adminlogin`
- **Admin ID**: `92200103237`
- **Password**: `kirtan`

**Admin Capabilities:**
- 👤 Manage student and faculty accounts
- 📂 View all uploaded documents across the system
- 🔍 Monitor system activity and user engagement
- ✅ Approve/reject student submissions
- 📊 Access system-wide analytics
- 🔒 Control user access and permissions
- 🗑️ Remove inappropriate content
- 📈 Generate reports on system usage

**Security Note**: In a production environment, admin credentials should be stored securely using environment variables and hashed passwords.

## 📁 Folder Structure

```
online-document-repo-main/
│
├── Client/                          # Frontend React Application
│   ├── public/                      # Static files
│   ├── src/
│   │   ├── Admin Panel/             # Admin dashboard components
│   │   │   ├── Admin.jsx            # Main admin panel
│   │   │   ├── Admin.css
│   │   │   ├── AdminFaculty.jsx     # Faculty management
│   │   │   ├── AdminLogin.jsx       # Admin authentication
│   │   │   ├── AdminLogin.css
│   │   │   └── AdminStudent.jsx     # Student management
│   │   │
│   │   ├── Components/              # Reusable UI components
│   │   │   ├── About/               # About page
│   │   │   │   ├── About.jsx
│   │   │   │   └── About.css
│   │   │   ├── Contact/             # Contact page
│   │   │   │   ├── Contact.jsx
│   │   │   │   └── Contact.css
│   │   │   ├── Faculty panel/       # Faculty dashboard
│   │   │   │   ├── Faculty.jsx
│   │   │   │   └── Faculty.css
│   │   │   ├── Footer/              # Footer component
│   │   │   │   ├── Footer.jsx
│   │   │   │   └── Footer.css
│   │   │   ├── Header/              # Header/Navigation
│   │   │   │   ├── Header.jsx
│   │   │   │   └── Header.css
│   │   │   ├── Home/                # Landing page
│   │   │   │   ├── Home.jsx
│   │   │   │   └── Home.css
│   │   │   ├── Login/               # User login
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Login.css
│   │   │   ├── Signup/              # Student registration
│   │   │   │   ├── Signup.jsx
│   │   │   │   └── Signup.css
│   │   │   ├── SignupFaculty/       # Faculty registration
│   │   │   │   ├── FacultySignup.jsx
│   │   │   │   └── FacultySignup.css
│   │   │   ├── Upload Page/         # Document upload
│   │   │   │   ├── Upload.jsx
│   │   │   │   └── Upload.css
│   │   │   └── View Page/           # Document viewing
│   │   │       ├── View.jsx
│   │   │       └── View.css
│   │   │
│   │   ├── App.jsx                  # Main application component
│   │   ├── App.css                  # Global styles
│   │   ├── main.jsx                 # React entry point
│   │   └── index.css                # Base CSS
│   │
│   ├── index.html                   # HTML template
│   ├── package.json                 # Client dependencies
│   ├── vite.config.js               # Vite configuration
│   └── eslint.config.js             # ESLint configuration
│
├── Server/                          # Backend Node.js Application
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   │
│   ├── middleware/
│   │   └── auth.js                  # JWT authentication middleware
│   │
│   ├── models/                      # Mongoose schemas
│   │   ├── AssignedFile.js          # Assigned task model
│   │   ├── FacultySignup.js         # Faculty user model
│   │   ├── StudentResponse.js       # Student submission model
│   │   ├── Upload.js                # Document upload model
│   │   └── User.js                  # Student user model
│   │
│   ├── routes/                      # API routes
│   │   ├── adminRoutes.js           # Admin endpoints
│   │   ├── facultyRoutes.js         # Faculty endpoints
│   │   ├── studentRoutes.js         # Student endpoints
│   │   ├── uploadRoutes.js          # File upload endpoints
│   │   └── userRoutes.js            # User authentication endpoints
│   │
│   ├── uploads/                     # Uploaded files directory
│   ├── server.js                    # Express server entry point
│   ├── package.json                 # Server dependencies
│   └── eng.traineddata              # Tesseract OCR data
│
└── README.md                        # Project documentation
```

## 🔌 API Endpoints

### Authentication Routes

**Base URL**: `http://localhost:2000`

#### User Authentication
```
POST   /users/signup          # Student registration
POST   /users/login           # User login
POST   /users/contact         # Contact form submission
```

#### Faculty Routes
```
POST   /faculty/signup        # Faculty registration
POST   /faculty/assign        # Assign task to students
GET    /faculty/responses     # Get student submissions
PUT    /faculty/approve/:id   # Approve student response
PUT    /faculty/reject/:id    # Reject student response
```

#### Student Routes
```
POST   /student/upload        # Upload response document
GET    /student/assignments   # Get assigned tasks
GET    /student/status/:id    # Check submission status
```

#### Admin Routes
```
GET    /admin/students        # Get all students
GET    /admin/faculty         # Get all faculty
GET    /admin/documents       # Get all documents
DELETE /admin/user/:id        # Delete user account
GET    /admin/stats           # System statistics
```

#### Upload Routes
```
POST   /upload                # Upload PDF document
GET    /uploads/:filename     # Retrieve uploaded file
```

### Request Examples

**Student Signup:**
```json
POST /users/signup
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepass123",
  "enrollmentId": "2023001"
}
```

**Faculty Task Assignment:**
```json
POST /faculty/assign
{
  "title": "Assignment 1",
  "description": "Complete chapters 1-3",
  "dueDate": "2026-03-01",
  "students": ["studentId1", "studentId2"]
}
```

## 🐛 Troubleshooting

### Common Issues and Solutions

#### 1. MongoDB Connection Error
**Problem**: `MongoNetworkError: failed to connect to server`

**Solution**:
```bash
# Check if MongoDB is running
mongosh

# Start MongoDB service
# macOS:
brew services start mongodb-community

# Windows:
net start MongoDB

# Linux:
sudo systemctl start mongod
```

#### 2. Bcrypt Module Error (macOS)
**Problem**: `Error: dlopen(...) code signature policy`

**Solution**:
```bash
cd Server
npm rebuild bcrypt --build-from-source
```

#### 3. Port Already in Use
**Problem**: `EADDRINUSE: address already in use :::2000`

**Solution**:
```bash
# Find process using port 2000
lsof -i :2000

# Kill the process
kill -9 <PID>
```

#### 4. CORS Errors
**Problem**: `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solution**: The server is already configured with CORS. Ensure:
- Server is running on port 2000
- Client is running on port 5173
- Both servers are started

#### 5. File Upload Fails
**Problem**: Files not uploading

**Solution**:
- Check `Server/uploads/` directory exists
- Verify file size is under limit (check Multer config)
- Ensure file is PDF format
- Check server console for specific errors

#### 6. Login Issues
**Problem**: Cannot login with correct credentials

**Solution**:
- Clear browser localStorage: `localStorage.clear()`
- Check MongoDB has user data
- Verify JWT token generation in server logs
- Ensure passwords are properly hashed

### Getting Help

If you encounter issues not listed here:
1. Check the browser console for frontend errors
2. Check the server terminal for backend errors
3. Verify all dependencies are installed
4. Ensure MongoDB is running
5. Check that both client and server are running simultaneously

## 🚢 Deployment

### Deploying to Production

#### Backend Deployment (Heroku, Railway, or Render)

1. **Prepare Environment Variables**
   ```env
   PORT=2000
   MONGO_URI=your_production_mongodb_uri
   JWT_SECRET=your_production_jwt_secret
   NODE_ENV=production
   ```

2. **Update CORS Configuration**
   ```javascript
   // In server.js, update CORS origin
   app.use(cors({
     origin: 'https://your-frontend-domain.com'
   }));
   ```

3. **Deploy to Platform**
   ```bash
   # For Heroku
   heroku create doc-store-api
   git push heroku main
   ```

#### Frontend Deployment (Vercel, Netlify, or Firebase)

1. **Update API Base URL**
   ```javascript
   // Update all API calls to use production backend URL
   const API_URL = 'https://your-backend-domain.com';
   ```

2. **Build the Application**
   ```bash
   cd Client
   npm run build
   ```

3. **Deploy**
   ```bash
   # For Vercel
   vercel --prod

   # For Netlify
   netlify deploy --prod
   ```

### Production Checklist

- ✅ Update MongoDB connection string to cloud database (MongoDB Atlas)
- ✅ Set secure JWT secret (use strong random string)
- ✅ Configure CORS for your domain
- ✅ Enable HTTPS
- ✅ Set up environment variables on hosting platform
- ✅ Configure file upload size limits
- ✅ Implement rate limiting
- ✅ Add error logging (e.g., Sentry)
- ✅ Set up backups for MongoDB
- ✅ Optimize images and assets
- ✅ Update admin credentials from defaults

## 📊 Performance & Security

### Performance Optimizations
- ✅ Code splitting with React lazy loading
- ✅ Vite production build optimization
- ✅ Database indexing on frequently queried fields
- ✅ Pagination for large data sets
- ✅ Compression middleware
- ✅ Browser caching strategies

### Security Best Practices
- 🔐 Passwords hashed using bcrypt (salt rounds: 10)
- 🎫 JWT tokens for stateless authentication
- 🛡️ Input validation and sanitization
- 🚫 CORS configuration to prevent unauthorized access
- 📝 Error handling without exposing sensitive information
- 🔒 HTTPS required for production
- ⏱️ Token expiration and refresh mechanism
- 🚨 Rate limiting to prevent abuse

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### How to Contribute

1. **Fork the Repository**
   ```bash
   # Click the 'Fork' button on GitHub
   ```

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/your-username/online-document-repo.git
   cd online-document-repo
   ```

3. **Create a Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

4. **Make Your Changes**
   - Write clean, commented code
   - Follow existing code style
   - Test your changes thoroughly

5. **Commit Your Changes**
   ```bash
   git add .
   git commit -m 'Add: Amazing new feature'
   ```

   **Commit Message Guidelines:**
   - `Add:` for new features
   - `Fix:` for bug fixes
   - `Update:` for updates to existing features
   - `Remove:` for removed features
   - `Docs:` for documentation changes

6. **Push to Your Fork**
   ```bash
   git push origin feature/amazing-feature
   ```

7. **Submit a Pull Request**
   - Go to the original repository
   - Click 'New Pull Request'
   - Select your feature branch
   - Describe your changes in detail

### Contribution Guidelines

- Ensure your code works before submitting
- Update documentation for any new features
- Add comments for complex logic
- Test on multiple browsers if making UI changes
- Respect the existing code structure
- Be responsive to feedback on your PR

### Areas for Contribution

- 🐛 Bug fixes
- ✨ New features
- 📝 Documentation improvements
- 🎨 UI/UX enhancements
- ⚡ Performance optimizations
- 🔒 Security improvements
- ♿ Accessibility features
- 🌍 Internationalization (i18n)

## �️ Roadmap

### Current Version (v1.0)
- ✅ Student/Faculty/Admin authentication
- ✅ Document upload and management
- ✅ Task assignment system
- ✅ Approval/Rejection workflow
- ✅ Modern glassmorphism UI
- ✅ Animated backgrounds

### Planned Features (v2.0)
- 🔔 Real-time notifications
- 💬 In-app messaging between faculty and students
- 📧 Email notifications for assignments
- 📊 Advanced analytics dashboard
- 🔍 Enhanced search with filters
- 📱 Mobile app (React Native)
- 🌙 Dark mode toggle
- 📁 Multiple file format support (Word, Excel, etc.)
- 🗂️ Folder organization system
- 🔄 Version control for documents
- 👥 Group assignments
- 📅 Calendar integration
- 🎯 Deadline reminders
- 📈 Student progress tracking
- 🏆 Gamification elements

### Future Enhancements (v3.0)
- 🤖 AI-powered document summarization
- 🗣️ Voice notes support
- 🎥 Video assignment submissions
- 🌐 Multi-language support
- 🔗 Integration with Learning Management Systems (LMS)
- 📊 Advanced reporting and export features
- 🔐 Two-factor authentication
- 💾 Cloud storage integration (Google Drive, Dropbox)
## ❓ FAQ

### General Questions

**Q: Is Doc Store free to use?**  
A: Yes! Doc Store is open-source and free to use under the MIT License.

**Q: Can I use this for my school/college?**  
A: Absolutely! Doc Store is designed for educational institutions of all sizes.

**Q: Do I need coding knowledge to use Doc Store?**  
A: No coding knowledge is required to use the application. However, basic technical knowledge is needed for deployment.

### Technical Questions

**Q: What file formats are supported?**  
A: Currently, Doc Store supports PDF files. Support for more formats is planned for future releases.

**Q: How many users can the system handle?**  
A: The system is designed to scale. Performance depends on your server resources and MongoDB configuration.

**Q: Can I customize the UI colors?**  
A: Yes! The application uses CSS variables in `App.css`. You can easily change the color scheme by modifying these variables.

**Q: Is the data encrypted?**  
A: Yes. Passwords are hashed using bcrypt, and JWT tokens are used for secure authentication. For production, use HTTPS for additional security.

**Q: Can I integrate this with my existing system?**  
A: Doc Store provides RESTful APIs that can be integrated with other systems. Check the API documentation section.

### Deployment Questions

**Q: Where can I deploy Doc Store?**  
A: You can deploy the backend on platforms like Heroku, Railway, or Render, and the frontend on Vercel, Netlify, or Firebase Hosting.

**Q: Do I need a dedicated server?**  
A: No, you can use cloud hosting platforms. For small institutions, free tiers might be sufficient.

**Q: How do I backup my data?**  
A: Use MongoDB's backup tools or MongoDB Atlas automated backups if using cloud hosting.
## �📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2026 Kirtan Kacha

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 📞 Contact

**Created by:** [Kirtan Kacha](https://github.com/kirtankacha)

### Get in Touch

- 📧 **Email**: docstore@email.com
- 🐙 **GitHub**: [@kirtankacha](https://github.com/kirtankacha)
- 💼 **LinkedIn**: [Kirtan Kacha](https://www.linkedin.com/in/kirtan-kacha)
- 🏛️ **Institution**: Marwadi University, Rajkot

### Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Send an email with detailed information
- Check the [Troubleshooting](#troubleshooting) section

---

## 🌟 Acknowledgments

- Thanks to all contributors who have helped improve this project
- Built with ❤️ using the MERN stack
- Special thanks to the open-source community

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

**Made with 💙 by Kirtan Kacha**

</div>
