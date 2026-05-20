# 🔐 Digital Asset Protection System

> **Enterprise-grade solution for detecting, tracking, and protecting digital assets from unauthorized use and distribution**

[![Status](https://img.shields.io/badge/Status-Active-brightgreen)](https://github.com/AnkitaRay123/Digital-Asset-Protection)
[![License](https://img.shields.io/badge/License-MIT-blue)](#license)
[![Version](https://img.shields.io/badge/Version-1.0.0-orange)](#)

---

## 📋 Table of Contents
- [Overview](#overview)
- [Key Features](#key-features)
- [How It Works](#how-it-works)
- [Technology Stack](#technology-stack)
- [Project Architecture](#project-architecture)
- [Workflow & User Flow](#workflow--user-flow)
- [Installation & Setup](#installation--setup)
- [Usage Guide](#usage-guide)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

**Digital Asset Protection** is a comprehensive full-stack web application designed to help organizations monitor, detect, and protect their digital assets from unauthorized use and distribution. The system combines real-time scanning, advanced analytics, and incident tracking to provide complete visibility and control over digital intellectual property.

### What It Does:
- ✅ **Scans** the web for unauthorized asset usage
- ✅ **Detects** IP violations and unauthorized distribution
- ✅ **Tracks** incidents with detailed reporting
- ✅ **Analyzes** trends through interactive dashboards
- ✅ **Alerts** administrators in real-time
- ✅ **Manages** digital asset library with metadata

---

## ⭐ Key Features

### 📊 Analytics Dashboard
- Real-time metrics (total media, scans, violations, alerts)
- Detection time statistics
- Interactive charts and trend analysis
- Performance KPIs

### 🔍 Web Crawler & Scanning
- Automated web crawler for asset detection
- Real-time scanning across multiple sources
- Violation detection and reporting
- Configurable scan frequencies

### 📸 Media Library Management
- Upload and organize digital assets
- Asset metadata and versioning
- Search and filtering capabilities
- Quick access to frequently used assets

### ⚠️ Alert Management System
- Real-time violation alerts
- Alert categorization and priority levels
- Notification system
- Alert history and resolution tracking

### 📋 Incident Tracking
- Detailed incident reports
- Violation documentation
- Timeline and action history
- Evidence collection

### 👤 User Management
- Admin dashboard with full control
- Role-based access control
- Audit logging
- Settings and preferences

### 📈 Reports & Insights
- Comprehensive reporting engine
- Custom date range analysis
- Violation trends
- Actionable insights

---

## 🔄 How It Works

### System Workflow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    DIGITAL ASSET PROTECTION SYSTEM              │
└─────────────────────────────────────────────────────────────────┘

1. ASSET UPLOAD & REGISTRATION
   ↓
   User uploads digital asset → System catalogs asset → Stores metadata
   
2. CRAWLER INITIALIZATION
   ↓
   Web crawler configured with asset signatures → Scan rules created
   
3. CONTINUOUS SCANNING
   ↓
   Automated crawler runs periodically → Searches web for asset copies
   → Analyzes content fingerprints
   
4. VIOLATION DETECTION
   ↓
   Match found → Violation flagged → Details logged
   
5. ALERT GENERATION
   ↓
   Alert created → Admin notified → Logged in system
   
6. INCIDENT TRACKING
   ↓
   Administrator reviews → Takes action → Documents resolution
   
7. ANALYTICS & REPORTING
   ↓
   Data aggregated → Dashboards updated → Reports generated
   → Insights provided
```

### Process Flow Diagram

```
Admin User Interface
     ↓
┌─────────────────────────────────────────┐
│  React Frontend (TypeScript + Vite)     │
│  - Dashboard                            │
│  - Media Library                        │
│  - Alerts Management                    │
│  - Reports & Analytics                  │
│  - Settings                             │
└──────────────────┬──────────────────────┘
                   ↓ API Calls (Axios)
        ┌──────────────────────────┐
        │   REST API Backend       │
        │   (Python Flask)         │
        ├──────────────────────────┤
        │ • Authentication         │
        │ • Data Management        │
        │ • API Endpoints          │
        └──────────────┬───────────┘
                       ↓
        ┌──────────────────────────┐
        │   Web Crawler Module     │
        │   (Python)               │
        ├──────────────────────────┤
        │ • Scan Configuration     │
        │ • Web Search             │
        │ • Violation Detection    │
        │ • Data Collection        │
        └──────────────┬───────────┘
                       ↓
        ┌──────────────────────────┐
        │   Database               │
        │   (Data Persistence)     │
        ├──────────────────────────┤
        │ • Assets                 │
        │ • Scans                  │
        │ • Violations             │
        │ • Alerts                 │
        │ • Users                  │
        └──────────────────────────┘
```

---

## 💻 Technology Stack

### Frontend
```
├── Framework: React 19.2.4 (UI Library)
├── Language: TypeScript 6.0.2 (Type Safety)
├── Build Tool: Vite 8.0.4 (Lightning Fast)
├── Routing: React Router DOM 7.14.1
├── Styling: CSS3 with custom themes
├── HTTP Client: Axios 1.15.2
├── UI Components: Lucide React 1.11.0 (Icons)
├── Animations: Framer Motion 12.38.0
└── Charts: Recharts 3.8.1 (Data Visualization)
```

### Backend
```
├── Language: Python
├── Web Framework: Flask
├── Crawler: Custom Web Crawler Module
├── Data Format: RESTful API (JSON)
└── Dependencies: Listed in requirements.txt
```

### DevOps & Tools
```
├── Version Control: Git
├── Code Quality: ESLint 9.39.4
├── Package Manager: npm
└── Hosting: Render, GitHub Pages
```

---

## 🏗️ Project Architecture

### Directory Structure

```
Digital-Asset-Protection/
│
├── 📄 Frontend Configuration
│   ├── vite.config.ts           # Vite build configuration
│   ├── tsconfig.json            # TypeScript configuration
│   ├── tsconfig.app.json        # App TypeScript config
│   ├── tsconfig.node.json       # Node TypeScript config
│   ├── eslint.config.js         # Code linting rules
│   └── package.json             # NPM dependencies
│
├── 📁 src/                       # React Application Source
│   ├── main.tsx                 # App entry point
│   ├── App.tsx                  # Root component
│   ├── index.css                # Global styles
│   │
│   ├── components/              # Reusable components
│   │   ├── layout/
│   │   │   ├── AdminLayout.tsx  # Admin page template
│   │   │   ├── AppShell.tsx     # App wrapper
│   │   │   └── Footer.tsx       # Footer component
│   │   │
│   │   └── ui/                  # UI components
│   │       ├── ActionModal.tsx  # Modal dialogs
│   │       ├── AlertRow.tsx     # Alert display
│   │       ├── ChartFrame.tsx   # Chart wrapper
│   │       ├── EmptyState.tsx   # Empty states
│   │       ├── MediaSurface.tsx # Media display
│   │       ├── StatCard.tsx     # Stat cards
│   │       ├── StatusBadge.tsx  # Status indicators
│   │       └── ToastStack.tsx   # Notifications
│   │
│   ├── pages/                   # Page components
│   │   ├── LandingPage.tsx      # Public landing page
│   │   ├── LoginPage.tsx        # Authentication
│   │   │
│   │   └── app/                 # Protected admin pages
│   │       ├── AboutUsPage.tsx
│   │       ├── AdminDashboardPage.tsx    # Main dashboard
│   │       ├── AdminIncidentsPage.tsx    # Incident management
│   │       ├── AdminMediaLibraryPage.tsx # Asset library
│   │       ├── AlertDetailPage.tsx       # Alert details
│   │       ├── AlertsPage.tsx            # Alerts list
│   │       ├── ContactUsPage.tsx
│   │       ├── LibraryPage.tsx
│   │       ├── MonitoringPage.tsx        # Real-time monitoring
│   │       ├── OverviewPage.tsx
│   │       ├── PrivacyPolicyPage.tsx
│   │       ├── ReportsPage.tsx           # Reports generation
│   │       ├── SettingsPage.tsx          # Configuration
│   │       └── UploadPage.tsx            # Asset upload
│   │
│   ├── context/                 # State Management
│   │   └── AppContext.tsx       # Global app state
│   │
│   ├── config/                  # Configuration
│   │   └── api.ts               # API endpoints config
│   │
│   ├── types/                   # TypeScript types
│   │   └── models.ts            # Data models
│   │
│   ├── data/                    # Mock data
│   │   └── mockData.ts
│   │
│   └── assets/                  # Static files
│       └── (images, fonts, etc.)
│
├── 📁 backend/                  # Python Backend
│   ├── app.py                   # Flask application
│   ├── crawler.py               # Web crawler module
│   ├── test_upload.py           # Testing utilities
│   ├── requirements.txt         # Python dependencies
│   │
│   └── query/                   # Query/Database modules
│
├── 📁 public/                   # Static assets
│   └── tick-tick-timer.mpeg
│
├── 📄 Deployment & Documentation
│   ├── DEPLOYMENT_GUIDE.md      # Deployment instructions
│   ├── GITHUB_DEPLOY.md         # GitHub deployment
│   ├── HOSTING_OPTIONS.md       # Hosting providers
│   ├── render.yaml              # Render.com config
│   └── README.md                # This file
│
└── 📄 index.html                # HTML entry point
```

---

## 🔄 Workflow & User Flow

### 1️⃣ **Admin Onboarding Flow**
```
Login → Dashboard → Upload Assets → Configure Scanning → Monitor Alerts
```

### 2️⃣ **Asset Protection Workflow**
```
UPLOAD ASSET
     ↓
[System catalogs and fingerprints asset]
     ↓
CONFIGURE CRAWLER
     ↓
[Set scanning rules, frequency, sources]
     ↓
START SCANNING
     ↓
[Web crawler searches for matches]
     ↓
DETECT VIOLATIONS
     ↓
[System identifies unauthorized copies]
     ↓
GENERATE ALERTS
     ↓
[Admin notified of violations]
     ↓
REVIEW & TAKE ACTION
     ↓
[Document incident, track resolution]
     ↓
VIEW ANALYTICS
     ↓
[Analyze trends and insights]
```

### 3️⃣ **User Interface Sections**

#### 📊 **Dashboard** (Overview)
- Total Media Count
- Total Scans Performed
- Total Violations Found
- Total Alerts Generated
- Average Detection Time
- Real-time chart of scanning activity

#### 📸 **Media Library**
- Upload new digital assets
- View asset inventory
- Search and filter assets
- View asset details and metadata
- Configure scanning for each asset

#### 🔍 **Monitoring**
- Real-time scanning status
- Active crawler operations
- Live violation detection
- System performance metrics

#### ⚠️ **Alerts Management**
- View all violations/alerts
- Filter by severity and date
- See alert details
- Take action on violations
- Mark as resolved

#### 📋 **Incidents**
- Detailed incident records
- Timeline of events
- Evidence and documentation
- Resolution history
- Export reports

#### 📈 **Reports**
- Generate custom reports
- Date range selection
- Violation analysis
- Trends visualization
- Export functionality

#### ⚙️ **Settings**
- Configure scanning preferences
- Manage notification rules
- Set alert thresholds
- User management
- System configuration

---

## 🚀 Installation & Setup

### Prerequisites
```bash
Node.js 18+ (for frontend)
Python 3.8+ (for backend)
npm or yarn (package manager)
Git
```

### Frontend Setup

```bash
# 1. Navigate to project directory
cd Digital-Asset-Protection

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Build for production
npm run build

# 5. Preview production build
npm run preview
```

### Backend Setup

```bash
# 1. Navigate to backend directory
cd backend

# 2. Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 3. Install Python dependencies
pip install -r requirements.txt

# 4. Run Flask application
python app.py

# 5. Test web crawler
python test_upload.py
```

### Configuration

1. **API Configuration** (`src/config/api.ts`)
   ```typescript
   export default "http://localhost:5000/api"
   ```

2. **Environment Variables** (Create `.env` file)
   ```
   VITE_API_URL=http://localhost:5000
   FLASK_ENV=development
   FLASK_DEBUG=True
   ```

---

## 💡 Usage Guide

### For Administrators

1. **Upload Assets**
   - Go to Media Library → Upload
   - Add asset file and metadata
   - System automatically creates fingerprint

2. **Configure Scanning**
   - Select asset from library
   - Set scan frequency
   - Choose search sources
   - Enable notifications

3. **Monitor Violations**
   - Dashboard shows real-time stats
   - Alerts section lists all violations
   - Click alert for detailed information

4. **Track Incidents**
   - Go to Incidents section
   - Review violation details
   - Document actions taken
   - Mark as resolved

5. **Analyze Trends**
   - Reports section shows analytics
   - Filter by date and type
   - Export data for further analysis

### API Endpoints

```
GET  /api/analytics       - Get dashboard metrics
POST /api/assets/upload   - Upload new asset
GET  /api/assets          - List all assets
GET  /api/scans           - Get scan history
GET  /api/violations      - Get violations list
POST /api/alerts          - Create alert
GET  /api/reports         - Generate reports
```

---

## 📁 Project Structure Details

### Component Architecture

```
App (Root)
├── Context (Global State)
├── Router (React Router)
└── Pages
    ├── Landing Page
    ├── Login Page
    └── Protected Routes
        ├── Dashboard
        ├── Media Library
        ├── Monitoring
        ├── Alerts
        ├── Incidents
        ├── Reports
        └── Settings
```

### Data Flow

```
User Action
    ↓
Component State Update
    ↓
API Call (Axios)
    ↓
Backend Processing
    ↓
Database Operation
    ↓
Response to Frontend
    ↓
State Update & Re-render
```

---

## 🛠️ Development

### Code Quality

```bash
# Lint code
npm run lint

# Build TypeScript
npm run build
```

### Scripts Available

```json
{
  "dev": "vite",
  "build": "tsc -b && vite build",
  "lint": "eslint .",
  "preview": "vite preview"
}
```

---

## 🤝 Contributing

### Guidelines
1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Code Standards
- Use TypeScript for type safety
- Follow ESLint rules
- Write meaningful commit messages
- Add comments for complex logic
- Test before submitting PR

---

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 📞 Support

For issues, questions, or suggestions:
- Create an issue on GitHub
- Contact the development team
- Check documentation in DEPLOYMENT_GUIDE.md

---

## 🎉 Acknowledgments

Built with modern web technologies to provide enterprise-grade asset protection.

**Last Updated:** May 2026  
**Version:** 1.0.0  
**Status:** Active & Maintained
