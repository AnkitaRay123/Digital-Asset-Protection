# 📡 API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production: https://api.example.com/api
```

## Authentication

All endpoints except login require authentication using JWT tokens.

### Authentication Header
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### 1. Login
**POST** `/auth/login`

**Description:** Authenticate user and receive JWT token

**Request Body:**
```json
{
  "username": "admin",
  "password": "secure_password"
}
```

**Success Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

**Error Response (401):**
```json
{
  "error": "Invalid credentials"
}
```

---

### 2. Logout
**POST** `/auth/logout`

**Description:** Invalidate JWT token (clear session)

**Headers:** `Authorization: Bearer <token>`

**Success Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

---

### 3. Get User Profile
**GET** `/auth/profile`

**Description:** Retrieve authenticated user's profile

**Headers:** `Authorization: Bearer <token>`

**Success Response (200):**
```json
{
  "id": 1,
  "username": "admin",
  "email": "admin@example.com",
  "role": "admin",
  "created_date": "2026-01-15T10:30:00Z",
  "last_login": "2026-05-20T14:22:00Z"
}
```

---

## Asset Management Endpoints

### 1. List All Assets
**GET** `/assets`

**Query Parameters:**
- `page` (int, optional): Page number (default: 1)
- `limit` (int, optional): Items per page (default: 20)
- `status` (string, optional): Filter by status (active, archived)
- `search` (string, optional): Search asset name

**Headers:** `Authorization: Bearer <token>`

**Success Response (200):**
```json
{
  "total": 45,
  "page": 1,
  "limit": 20,
  "assets": [
    {
      "id": 1,
      "name": "Logo Design",
      "description": "Company logo vector file",
      "file_hash": "abc123def456...",
      "upload_date": "2026-05-10T08:00:00Z",
      "status": "active",
      "owner_id": 1,
      "metadata": {
        "file_type": "AI",
        "size_bytes": 2048000,
        "dimensions": "1024x1024"
      }
    }
  ]
}
```

---

### 2. Get Asset Details
**GET** `/assets/:id`

**URL Parameters:**
- `id` (int, required): Asset ID

**Headers:** `Authorization: Bearer <token>`

**Success Response (200):**
```json
{
  "id": 1,
  "name": "Logo Design",
  "description": "Company logo vector file",
  "file_hash": "abc123def456...",
  "upload_date": "2026-05-10T08:00:00Z",
  "status": "active",
  "owner_id": 1,
  "metadata": {
    "file_type": "AI",
    "size_bytes": 2048000,
    "dimensions": "1024x1024"
  },
  "recent_scans": [
    {
      "scan_id": 5,
      "scan_date": "2026-05-20T10:00:00Z",
      "violations_found": 2
    }
  ],
  "total_violations": 12
}
```

---

### 3. Upload Asset
**POST** `/assets`

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Form Data:**
```
- file (file, required): Asset file
- name (string, required): Asset name
- description (string, optional): Asset description
- metadata (JSON, optional): Custom metadata
```

**Success Response (201):**
```json
{
  "id": 2,
  "name": "Logo Design",
  "message": "Asset uploaded successfully",
  "file_hash": "abc123def456...",
  "upload_date": "2026-05-20T15:30:00Z"
}
```

**Error Response (413):**
```json
{
  "error": "File too large. Maximum size: 100MB"
}
```

---

### 4. Update Asset
**PUT** `/assets/:id`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "Updated Logo Design",
  "description": "Updated description",
  "status": "archived"
}
```

**Success Response (200):**
```json
{
  "id": 1,
  "name": "Updated Logo Design",
  "description": "Updated description",
  "status": "archived",
  "message": "Asset updated successfully"
}
```

---

### 5. Delete Asset
**DELETE** `/assets/:id`

**Headers:** `Authorization: Bearer <token>`

**Success Response (200):**
```json
{
  "message": "Asset deleted successfully"
}
```

---

## Scanning Endpoints

### 1. List Scans
**GET** `/scans`

**Query Parameters:**
- `asset_id` (int, optional): Filter by asset
- `status` (string, optional): running, completed, failed
- `date_from` (string, optional): Start date (YYYY-MM-DD)
- `date_to` (string, optional): End date (YYYY-MM-DD)

**Headers:** `Authorization: Bearer <token>`

**Success Response (200):**
```json
{
  "total": 120,
  "scans": [
    {
      "id": 1,
      "asset_id": 1,
      "asset_name": "Logo Design",
      "scan_date": "2026-05-20T10:00:00Z",
      "duration": 3600,
      "status": "completed",
      "results_count": 5,
      "details": {
        "sources_scanned": 15,
        "pages_analyzed": 250
      }
    }
  ]
}
```

---

### 2. Start New Scan
**POST** `/scans`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "asset_id": 1,
  "scan_type": "web",
  "sources": ["google", "bing", "reverse_image"],
  "priority": "high"
}
```

**Success Response (201):**
```json
{
  "id": 101,
  "asset_id": 1,
  "status": "queued",
  "message": "Scan initiated successfully",
  "estimated_duration": 3600
}
```

---

### 3. Get Scan Details
**GET** `/scans/:id`

**Headers:** `Authorization: Bearer <token>`

**Success Response (200):**
```json
{
  "id": 1,
  "asset_id": 1,
  "scan_date": "2026-05-20T10:00:00Z",
  "duration": 3600,
  "status": "completed",
  "results_count": 5,
  "details": {
    "sources_scanned": 15,
    "pages_analyzed": 250,
    "start_time": "2026-05-20T10:00:00Z",
    "end_time": "2026-05-20T11:00:00Z"
  },
  "violations": [
    {
      "id": 10,
      "source_url": "https://example.com/stolen-logo.html",
      "similarity_score": 0.98,
      "severity": "high"
    }
  ]
}
```

---

### 4. Get Scan Status
**GET** `/scans/:id/status`

**Headers:** `Authorization: Bearer <token>`

**Success Response (200):**
```json
{
  "id": 1,
  "status": "running",
  "progress": 65,
  "elapsed_time": 1200,
  "estimated_remaining": 600,
  "current_operation": "Analyzing page 150 of 250"
}
```

---

## Violation Endpoints

### 1. List Violations
**GET** `/violations`

**Query Parameters:**
- `asset_id` (int, optional): Filter by asset
- `severity` (string, optional): low, medium, high, critical
- `status` (string, optional): new, reviewed, resolved
- `date_from` (string, optional): Start date
- `date_to` (string, optional): End date

**Headers:** `Authorization: Bearer <token>`

**Success Response (200):**
```json
{
  "total": 42,
  "violations": [
    {
      "id": 1,
      "asset_id": 1,
      "asset_name": "Logo Design",
      "detection_date": "2026-05-20T10:30:00Z",
      "severity": "high",
      "source_url": "https://example.com/stolen-logo",
      "similarity_score": 0.98,
      "status": "new",
      "description": "Exact copy of logo found on competitor website"
    }
  ]
}
```

---

### 2. Get Violation Details
**GET** `/violations/:id`

**Headers:** `Authorization: Bearer <token>`

**Success Response (200):**
```json
{
  "id": 1,
  "asset_id": 1,
  "scan_id": 5,
  "detection_date": "2026-05-20T10:30:00Z",
  "severity": "high",
  "source_url": "https://example.com/stolen-logo",
  "description": "Exact copy of logo",
  "similarity_score": 0.98,
  "status": "new",
  "evidence": {
    "screenshot_url": "https://...",
    "html_content": "..."
  },
  "actions_taken": []
}
```

---

### 3. Record Action on Violation
**POST** `/violations/:id/action`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "action_type": "dmca_notice",
  "description": "DMCA takedown notice sent",
  "outcome": "pending_response"
}
```

**Success Response (200):**
```json
{
  "message": "Action recorded successfully",
  "violation_id": 1,
  "action_id": 101,
  "status": "reviewed"
}
```

---

## Alert Endpoints

### 1. List Alerts
**GET** `/alerts`

**Query Parameters:**
- `status` (string, optional): active, acknowledged, resolved
- `severity` (string, optional): Filter by severity
- `limit` (int, optional): Number of alerts (default: 20)

**Headers:** `Authorization: Bearer <token>`

**Success Response (200):**
```json
{
  "total": 12,
  "alerts": [
    {
      "id": 1,
      "violation_id": 1,
      "alert_date": "2026-05-20T10:35:00Z",
      "severity": "high",
      "asset_name": "Logo Design",
      "status": "active",
      "notification_sent": true,
      "violation_details": {
        "source_url": "https://example.com/stolen-logo",
        "similarity": 0.98
      }
    }
  ]
}
```

---

### 2. Get Alert Details
**GET** `/alerts/:id`

**Headers:** `Authorization: Bearer <token>`

**Success Response (200):**
```json
{
  "id": 1,
  "violation_id": 1,
  "alert_date": "2026-05-20T10:35:00Z",
  "severity": "high",
  "status": "active",
  "notification_sent": true,
  "notes": "",
  "full_violation": {
    "id": 1,
    "asset_name": "Logo Design",
    "source_url": "https://example.com/stolen-logo",
    "similarity_score": 0.98,
    "detection_date": "2026-05-20T10:30:00Z"
  }
}
```

---

### 3. Update Alert Status
**PUT** `/alerts/:id`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "status": "acknowledged",
  "notes": "Investigating the violation"
}
```

**Success Response (200):**
```json
{
  "message": "Alert updated successfully",
  "id": 1,
  "status": "acknowledged"
}
```

---

### 4. Delete Alert
**DELETE** `/alerts/:id`

**Headers:** `Authorization: Bearer <token>`

**Success Response (200):**
```json
{
  "message": "Alert deleted successfully"
}
```

---

## Analytics Endpoints

### 1. Get Dashboard Metrics
**GET** `/analytics/dashboard`

**Headers:** `Authorization: Bearer <token>`

**Success Response (200):**
```json
{
  "total_media": 45,
  "total_scans": 156,
  "total_violations": 42,
  "total_alerts": 38,
  "avg_detection_time": "2.5 hours",
  "active_scans": 3,
  "critical_violations": 5,
  "chart_data": [
    {
      "time": "00:00",
      "scans": 5
    },
    {
      "time": "01:00",
      "scans": 8
    }
  ]
}
```

---

### 2. Get Violation Trends
**GET** `/analytics/violations/trends`

**Query Parameters:**
- `days` (int, optional): Number of past days (default: 30)
- `asset_id` (int, optional): Filter by asset

**Headers:** `Authorization: Bearer <token>`

**Success Response (200):**
```json
{
  "period": "30_days",
  "data": [
    {
      "date": "2026-04-21",
      "violations": 1
    },
    {
      "date": "2026-04-22",
      "violations": 3
    }
  ],
  "total_violations": 42,
  "trend": "increasing"
}
```

---

## Report Endpoints

### 1. Generate Report
**POST** `/reports`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "report_type": "violations_summary",
  "date_from": "2026-05-01",
  "date_to": "2026-05-31",
  "asset_ids": [1, 2, 3],
  "format": "pdf"
}
```

**Success Response (201):**
```json
{
  "id": 101,
  "report_type": "violations_summary",
  "status": "generating",
  "created_date": "2026-05-20T15:40:00Z",
  "estimated_completion": "2026-05-20T15:45:00Z"
}
```

---

### 2. Get Report
**GET** `/reports/:id`

**Headers:** `Authorization: Bearer <token>`

**Success Response (200):**
```json
{
  "id": 101,
  "report_type": "violations_summary",
  "status": "completed",
  "created_date": "2026-05-20T15:40:00Z",
  "completed_date": "2026-05-20T15:42:00Z",
  "file_url": "https://..../report_101.pdf",
  "summary": {
    "total_violations": 42,
    "critical": 5,
    "high": 15,
    "medium": 15,
    "low": 7
  }
}
```

---

### 3. Export Report
**GET** `/reports/:id/export`

**Query Parameters:**
- `format` (string, required): pdf, csv, json

**Headers:** `Authorization: Bearer <token>`

**Response:** File download

---

## Error Responses

### Standard Error Format
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "status": 400
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `INVALID_TOKEN` | 401 | Invalid or expired authentication token |
| `UNAUTHORIZED` | 403 | User lacks required permissions |
| `NOT_FOUND` | 404 | Requested resource not found |
| `VALIDATION_ERROR` | 422 | Request data validation failed |
| `RATE_LIMITED` | 429 | Too many requests |
| `SERVER_ERROR` | 500 | Internal server error |

---

## Rate Limiting

- **Limit:** 1000 requests per hour per user
- **Headers:** 
  - `X-RateLimit-Limit: 1000`
  - `X-RateLimit-Remaining: 950`
  - `X-RateLimit-Reset: 1234567890`

---

## Pagination

All list endpoints support pagination:

**Query Parameters:**
- `page` (int): Page number (starting from 1)
- `limit` (int): Items per page (1-100, default: 20)

**Response Headers:**
```json
{
  "total": 100,
  "page": 1,
  "limit": 20,
  "pages": 5,
  "items": [...]
}
```

---

**API Version:** 1.0  
**Last Updated:** May 2026