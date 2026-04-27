export type UserRole = 'broadcaster' | 'admin'

export type WatermarkStatus = 'secured' | 'processing' | 'queued'
export type EmbeddingStatus = 'ready' | 'extracting' | 'queued'
export type IndexStatus = 'indexed' | 'streaming' | 'pending'
export type ThreatStatus = 'new' | 'investigating' | 'verified' | 'resolved'
export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low'
export type AlertStatus =
  | 'open'
  | 'in_review'
  | 'escalated'
  | 'takedown_requested'
  | 'false_positive'
  | 'resolved'

export interface NotificationPrefs {
  email: boolean
  sms: boolean
  slack: boolean
}

export interface UserSession {
  id: string
  name: string
  role: UserRole
  orgName: string
  avatar: string
  notificationPrefs: NotificationPrefs
}

export interface MediaAsset {
  id: string
  title: string
  sportCategory: string
  sourceType: string
  uploadedAt: string
  duration: string
  watermarkStatus: WatermarkStatus
  embeddingStatus: EmbeddingStatus
  indexStatus: IndexStatus
  thumbnail: string
  videoSrc: string
}

export interface ThreatSignal {
  id: string
  platform: string
  detectedAt: string
  velocityScore: number
  anomalyScore: number
  url: string
  clipThumb: string
  status: ThreatStatus
}

export interface PiracyAlert {
  id: string
  assetId: string
  severity: AlertSeverity
  confidence: number
  status: AlertStatus
  sourcePlatform: string
  suspectedUrl: string
  matchedAt: string
  reviewer: string
  summary: string
}

export interface ActivityLogEntry {
  id: string
  timestamp: string
  actor: string
  action: string
  detail: string
}

export interface CaseEvidence {
  alertId: string
  similarityScore: number
  extractedFrames: string[]
  transcriptSnippet: string
  contextText: string
  reasoningSummary: string
  recommendedAction: string
  activityLog: ActivityLogEntry[]
}

export interface DashboardMetric {
  label: string
  value: string
  delta: string
  trend: 'up' | 'down' | 'steady'
  status: 'healthy' | 'warning' | 'critical'
}

export interface TrendPoint {
  label: string
  liveMatches: number
  anomalyIndex: number
  takedowns: number
}

export interface ReportPoint {
  label: string
  takedowns: number
  falsePositives: number
  responseMinutes: number
}

export interface PlatformBreakdown {
  platform: string
  incidents: number
  enforcementRate: number
}

export interface TeamMember {
  name: string
  role: string
  coverage: string
}

export interface IntegrationCard {
  name: string
  description: string
  status: string
}

export interface ToastMessage {
  id: string
  title: string
  message: string
  tone: 'info' | 'success' | 'warning'
}

export type ModalAction = 'assign' | 'escalate' | 'takedown' | 'false_positive'

export interface ModalState {
  action: ModalAction
  alertId: string
  title: string
  description: string
  confirmLabel: string
}
