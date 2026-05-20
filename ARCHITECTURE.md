# 🏗️ System Architecture Documentation

## Overview

Digital Asset Protection is built using a **modern full-stack architecture** with clear separation of concerns between frontend, backend, and crawler components.

---

## High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                                │
│                    (React + TypeScript + Vite)                      │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │  User Interface                                              │  │
│  │  ├─ Authentication (Login)                                  │  │
│  │  ├─ Dashboard (Analytics & KPIs)                            │  │
│  │  ├─ Media Library Management                                │  │
│  │  ├─ Violation Monitoring                                    │  │
│  │  ├─ Alert Management                                        │  │
│  │  ├─ Incident Tracking                                       │  │
│  │  ├─ Reports & Analytics                                     │  │
│  │  └─ Settings & Configuration                                │  │
│  └─────────────────────────────────────────────────────────────┘  │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                    HTTP/HTTPS (Axios)
                               │
                               ↓
┌─────────────────────────────────────────────────────────────────────┐
│                         API LAYER                                   │
│                    (Flask REST API)                                 │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  API Endpoints                                                │  │
│  │  ├─ /api/auth/* ................. Authentication            │  │
│  │  ├─ /api/assets/* .............. Asset Management           │  │
│  │  ├─ /api/scans/* ............... Scan Operations            │  │
│  │  ├─ /api/violations/* .......... Violation Detection        │  │
│  │  ├─ /api/alerts/* .............. Alert Management           │  │
│  │  ├─ /api/incidents/* ........... Incident Tracking          │  │
│  │  ├─ /api/reports/* ............. Report Generation          │  │
│  │  └─ /api/users/* ............... User Management            │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Business Logic Layer                                         │  │
│  │  ├─ Authentication & Authorization                           │  │
│  │  ├─ Request Validation                                       │  │
│  │  ├─ Data Processing                                          │  │
│  │  ├─ Business Rules                                           │  │
│  │  └─ Error Handling                                           │  │
│  └──────────────────────────────────────────────────────────────┘  │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                        SQL Queries
                               │
                               ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      CRAWLER LAYER                                  │
│                    (Python Web Crawler)                             │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Crawler Engine                                               │  │
│  │  ├─ Configuration Manager                                    │  │
│  │  ├─ Fingerprint Generator                                    │  │
│  │  ├─ Web Search Module                                        │  │
│  │  ├─ Content Analyzer                                         │  │
│  │  ├─ Violation Detector                                       │  │
│  │  └─ Report Generator                                         │  │
│  └──────────────────────────────────────────────────────────────┘  │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                    File & API Calls
                               │
                               ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      DATA LAYER                                     │
│                    (Database & Storage)                             │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Primary Database                                             │  │
│  │  ├─ Assets Table ........... Digital asset records           │  │
│  │  ├─ Users Table ............ User accounts & roles           │  │
│  │  ├─ Scans Table ............ Scanning history               │  │
│  │  ├─ Violations Table ....... Detected violations            │  │
│  │  ├─ Alerts Table ........... Alert records                  │  │
│  │  └─ Incidents Table ........ Incident documentation         │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  File Storage                                                 │  │
│  │  ├─ Asset Files                                              │  │
│  │  ├─ Report Files                                             │  │
│  │  └─ Log Files                                                │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Frontend Architecture

### Component Hierarchy

```
<App>
├── <Router>
│   ├── <LandingPage>
│   ├── <LoginPage>
│   └── <ProtectedRoutes>
│       ├── <AdminLayout>
│       │   ├── <AppShell>
│       │   │   ├── Header/Navigation
│       │   │   ├── <Route Pages>
│       │   │   │   ├── <Dashboard>
│       │   │   │   │   ├── <StatCard>
│       │   │   │   │   ├── <ChartFrame>
│       │   │   │   │   └── Analytics
│       │   │   │   │
│       │   │   │   ├── <MediaLibrary>
│       │   │   │   │   ├── Upload Module
│       │   │   │   │   └── <MediaSurface>
│       │   │   │   │
│       │   │   │   ├── <Alerts>
│       │   │   │   │   ├── <AlertRow>
│       │   │   │   │   └── Filter/Search
│       │   │   │   │
│       │   │   │   ├── <Incidents>
│       │   │   │   │   └── Incident Management
│       │   │   │   │
│       │   │   │   ├── <Reports>
│       │   │   │   │   └── Report Generation
│       │   │   │   │
│       │   │   │   └── <Settings>
│       │   │   │       └── Configuration
│       │   │   │
│       │   │   ├── <Modal Components>
│       │   │   │   └── <ActionModal>
│       │   │   │
│       │   │   └── <Notifications>
│       │   │       └── <ToastStack>
│       │   │
│       │   └── <Footer>
│       │
│       └── <AppContext>
│           └── Global State Management
```

### State Management

```
AppContext (Global State)
├── User Authentication
│   ├── Current User
│   ├── Auth Token
│   └── User Permissions
│
├── Dashboard Data
│   ├── Metrics
│   ├── Charts Data
│   └── Real-time Stats
│
├── Assets Data
│   ├── Asset List
│   ├── Selected Asset
│   └── Asset Metadata
│
├── Violations & Alerts
│   ├── Alerts List
│   ├── Filter State
│   └── Selected Alert
│
└── UI State
    ├── Loading States
    ├── Modal Visibility
    ├── Notification Queue
    └── Sidebar State
```

---

## Backend Architecture

### API Layer Structure

```
Flask Application (app.py)
│
├── Blueprint: /api/auth
│   ├── POST /login ................. User authentication
│   ├── POST /logout ................ User logout
│   └── GET /profile ................ Get user profile
│
├── Blueprint: /api/assets
│   ├── GET / ...................... List all assets
│   ├── POST / ..................... Create asset
│   ├── GET /<id> .................. Get asset details
│   ├── PUT /<id> .................. Update asset
│   └── DELETE /<id> ............... Delete asset
│
├── Blueprint: /api/scans
│   ├── GET / ...................... List scans
│   ├── POST / ..................... Create scan
│   ├── GET /<id> .................. Get scan details
│   └── GET /<id>/status ........... Get scan status
│
├── Blueprint: /api/violations
│   ├── GET / ...................... List violations
│   ├── GET /<id> .................. Get violation details
│   └── POST /<id>/action .......... Record action taken
│
├── Blueprint: /api/alerts
│   ├── GET / ...................... List alerts
│   ├── GET /<id> .................. Get alert details
│   ├── PUT /<id> .................. Update alert status
│   └── DELETE /<id> ............... Delete alert
│
├── Blueprint: /api/incidents
│   ├── GET / ...................... List incidents
│   ├── POST / ..................... Create incident
│   ├── GET /<id> .................. Get incident details
│   └── PUT /<id> .................. Update incident
│
├── Blueprint: /api/reports
│   ├── POST / ..................... Generate report
│   ├── GET /<id> .................. Get report
│   └── GET /<id>/export ........... Export report
│
└── Blueprint: /api/users
    ├── GET / ...................... List users
    ├── POST / ..................... Create user
    ├── GET /<id> .................. Get user details
    ├── PUT /<id> .................. Update user
    └── DELETE /<id> ............... Delete user
```

### Crawler Architecture

```
Crawler Engine (crawler.py)
│
├── Configuration Manager
│   ├── Load scan settings
│   ├── Set search parameters
│   └── Configure frequency
│
├── Fingerprint Generator
│   ├── Hash content
│   ├── Generate signature
│   └── Create search queries
│
├── Web Search Module
│   ├── Search sources
│   ├── Fetch results
│   └── Parse content
│
├── Content Analyzer
│   ├── Extract features
│   ├── Compare signatures
│   └── Calculate similarity
│
├── Violation Detector
│   ├── Identify matches
│   ├── Assess severity
│   └── Generate alerts
│
└── Report Generator
    ├── Aggregate data
    ├── Create reports
    └── Export results
```

---

## Database Schema

### Assets Table
```sql
assets
├── id (PRIMARY KEY)
├── name (VARCHAR)
├── description (TEXT)
├── file_path (VARCHAR)
├── file_hash (VARCHAR)
├── upload_date (TIMESTAMP)
├── owner_id (FOREIGN KEY -> users)
├── status (ENUM: active, archived)
└── metadata (JSON)
```

### Scans Table
```sql
scans
├── id (PRIMARY KEY)
├── asset_id (FOREIGN KEY -> assets)
├── scan_date (TIMESTAMP)
├── duration (INTEGER)
├── status (ENUM: running, completed, failed)
├── results_count (INTEGER)
└── details (JSON)
```

### Violations Table
```sql
violations
├── id (PRIMARY KEY)
├── scan_id (FOREIGN KEY -> scans)
├── asset_id (FOREIGN KEY -> assets)
├── detection_date (TIMESTAMP)
├── severity (ENUM: low, medium, high, critical)
├── source_url (VARCHAR)
├── description (TEXT)
├── similarity_score (DECIMAL)
└── status (ENUM: new, reviewed, resolved)
```

### Alerts Table
```sql
alerts
├── id (PRIMARY KEY)
├── violation_id (FOREIGN KEY -> violations)
├── user_id (FOREIGN KEY -> users)
├── alert_date (TIMESTAMP)
├── notification_sent (BOOLEAN)
├── status (ENUM: active, acknowledged, resolved)
└── notes (TEXT)
```

### Incidents Table
```sql
incidents
├── id (PRIMARY KEY)
├── violation_id (FOREIGN KEY -> violations)
├── creation_date (TIMESTAMP)
├── investigation_notes (TEXT)
├── action_taken (TEXT)
├── resolution_date (TIMESTAMP)
├── assigned_to (FOREIGN KEY -> users)
└── status (ENUM: open, investigating, resolved, closed)
```

### Users Table
```sql
users
├── id (PRIMARY KEY)
├── username (VARCHAR, UNIQUE)
├── email (VARCHAR, UNIQUE)
├── password_hash (VARCHAR)
├── role (ENUM: admin, user, viewer)
├── created_date (TIMESTAMP)
├── last_login (TIMESTAMP)
└── is_active (BOOLEAN)
```

---

## Data Flow Patterns

### Asset Upload Flow

```
1. User uploads file (Frontend)
2. File validation (API)
3. File storage (Backend)
4. Hash generation (Crawler)
5. Metadata extraction (Crawler)
6. Database record creation (API)
7. Response to user (Frontend)
```

### Scanning Flow

```
1. Admin initiates scan (Frontend)
2. Scan request sent (API)
3. Crawler receives request (Backend)
4. Configure parameters (Crawler)
5. Search web (Crawler)
6. Analyze results (Crawler)
7. Detect violations (Crawler)
8. Store results (Database)
9. Generate alerts (Backend)
10. Notify admin (Frontend)
```

### Alert Generation Flow

```
1. Violation detected (Crawler)
2. Alert created (Backend)
3. User notified (API)
4. Alert appears in UI (Frontend)
5. Admin acknowledges (Frontend)
6. Status updated (API)
7. Incident created (Backend)
8. Investigation begins (Admin)
```

---

## Performance Considerations

### Frontend
- **Code Splitting**: Route-based lazy loading
- **Caching**: API response caching
- **Virtual Scrolling**: For large lists
- **Debouncing**: For search and filters
- **Memoization**: For expensive components

### Backend
- **Database Indexing**: On frequently queried fields
- **Connection Pooling**: For database connections
- **Query Optimization**: Efficient joins and queries
- **Caching**: Redis for frequent queries
- **Rate Limiting**: API endpoint protection

### Crawler
- **Concurrent Requests**: Parallel scanning
- **Rate Limiting**: Respectful to target servers
- **Batch Processing**: Process multiple assets
- **Result Caching**: Avoid redundant searches
- **Resource Management**: Memory and CPU optimization

---

## Security Architecture

### Authentication & Authorization
```
Login Request
    ↓
Validate Credentials
    ↓
Generate JWT Token
    ↓
Store in Session
    ↓
Include in API Requests
    ↓
Verify Token
    ↓
Check Permissions
    ↓
Grant/Deny Access
```

### Data Protection
- **Encryption**: In-transit (HTTPS) and at-rest
- **Password Hashing**: bcrypt or similar
- **Input Validation**: Sanitize all inputs
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Output encoding

---

## Deployment Architecture

### Development Environment
```
Local Machine
├── React Dev Server (Vite)
├── Flask Dev Server
├── SQLite Database
└── Local File Storage
```

### Production Environment
```
Cloud Platform (Render/AWS/etc)
├── React Static Build (CDN)
├── Flask API Server
├── PostgreSQL Database
└── Cloud Storage (S3/etc)
```

---

## Error Handling & Logging

### Frontend Error Handling
- Try-catch blocks for API calls
- Error boundaries for components
- User-friendly error messages
- Error logging to backend

### Backend Error Handling
- Exception handling on endpoints
- Validation error responses
- Database error recovery
- Comprehensive logging

### Logging Strategy
```
DEBUG   - Detailed information for debugging
INFO    - General information about operations
WARNING - Warning about potential issues
ERROR   - Error in operations
CRITICAL - Critical system errors
```

---

## Scalability Considerations

### Horizontal Scaling
- **Stateless API**: Multiple server instances
- **Load Balancing**: Distribute traffic
- **Database Replication**: Read replicas
- **Crawler Distribution**: Multiple crawler nodes

### Vertical Scaling
- **Optimize Queries**: Database performance
- **Increase Resources**: More CPU/Memory
- **Caching Layer**: Redis implementation
- **Asynchronous Tasks**: Background job processing

---

## Integration Points

### Third-Party Services
- **Web Search APIs**: For crawler enhancement
- **Email Service**: For notifications
- **Storage Service**: Cloud file storage
- **Analytics Service**: Usage tracking

### Webhook Endpoints
- **Scan Completion**: Notify on completion
- **Alert Triggered**: Real-time notifications
- **Report Generated**: Send via webhook

---

## Version Control Strategy

```
main (Production)
    ↓
develop (Testing)
    ├── feature/new-feature
    ├── bugfix/issue-fix
    └── hotfix/production-issue
```

---

**Document Version:** 1.0  
**Last Updated:** May 2026