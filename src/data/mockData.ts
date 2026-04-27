// removed ambientTunnel import
import radarDeck from '../../image_and_videos/12352337-hd_1920_1080_60fps.mp4'
import opsGrid from '../../image_and_videos/13151652_3840_2160_30fps.mp4'
import signalMesh from '../../image_and_videos/14800468_3840_2160_60fps.mp4'
import cryptoDesk from '../../image_and_videos/8370054-hd_1920_1080_30fps.mp4'
import assetStill from '../../image_and_videos/pexels-jonathanborba-14348489.jpg'
import type {
  CaseEvidence,
  DashboardMetric,
  IntegrationCard,
  MediaAsset,
  PiracyAlert,
  PlatformBreakdown,
  ReportPoint,
  TeamMember,
  ThreatSignal,
  TrendPoint,
  UserSession,
} from '../types/models'

export const demoUsers: Record<UserSession['role'], UserSession> = {
  broadcaster: {
    id: 'user-b1',
    name: 'Aarav Mehta',
    role: 'broadcaster',
    orgName: 'Apex Sports Network',
    avatar: 'AM',
    notificationPrefs: {
      email: true,
      sms: false,
      slack: true,
    },
  },
  admin: {
    id: 'user-a1',
    name: 'Naina Roy',
    role: 'admin',
    orgName: 'Apex Sports Network',
    avatar: 'NR',
    notificationPrefs: {
      email: true,
      sms: true,
      slack: true,
    },
  },
}

export const mediaAssetsSeed: MediaAsset[] = [
  {
    id: 'asset-01',
    title: 'Championship Night Feed',
    sportCategory: 'Football',
    sourceType: 'Live broadcast',
    uploadedAt: '2026-04-18T13:00:00+05:30',
    duration: '01:58:22',
    watermarkStatus: 'secured',
    embeddingStatus: 'ready',
    indexStatus: 'indexed',
    thumbnail: assetStill,
    videoSrc: '/football-match.mp4',
  },
  {
    id: 'asset-02',
    title: 'Legends Cup Highlights',
    sportCategory: 'Cricket',
    sourceType: 'Highlights',
    uploadedAt: '2026-04-18T12:18:00+05:30',
    duration: '00:08:40',
    watermarkStatus: 'secured',
    embeddingStatus: 'ready',
    indexStatus: 'indexed',
    thumbnail: assetStill,
    videoSrc: radarDeck,
  },
  {
    id: 'asset-03',
    title: 'Sprint Qualifier Backhaul',
    sportCategory: 'Motorsport',
    sourceType: 'Satellite ingest',
    uploadedAt: '2026-04-18T11:45:00+05:30',
    duration: '00:43:12',
    watermarkStatus: 'processing',
    embeddingStatus: 'extracting',
    indexStatus: 'streaming',
    thumbnail: assetStill,
    videoSrc: opsGrid,
  },
  {
    id: 'asset-04',
    title: 'Courtside Studio Cut',
    sportCategory: 'Basketball',
    sourceType: 'Studio package',
    uploadedAt: '2026-04-18T10:52:00+05:30',
    duration: '00:17:03',
    watermarkStatus: 'queued',
    embeddingStatus: 'queued',
    indexStatus: 'pending',
    thumbnail: assetStill,
    videoSrc: signalMesh,
  },
]

export const threatSignalsSeed: ThreatSignal[] = [
  {
    id: 'signal-01',
    platform: 'Telegram',
    detectedAt: '2026-04-18T14:03:00+05:30',
    velocityScore: 92,
    anomalyScore: 88,
    url: 'https://example.com/telegram/championship-night-feed',
    clipThumb: assetStill,
    status: 'investigating',
  },
  {
    id: 'signal-02',
    platform: 'Reddit',
    detectedAt: '2026-04-18T13:58:00+05:30',
    velocityScore: 76,
    anomalyScore: 69,
    url: 'https://example.com/reddit/legends-cup',
    clipThumb: assetStill,
    status: 'new',
  },
  {
    id: 'signal-03',
    platform: 'Discord',
    detectedAt: '2026-04-18T13:51:00+05:30',
    velocityScore: 84,
    anomalyScore: 81,
    url: 'https://example.com/discord/sprint-qualifier',
    clipThumb: assetStill,
    status: 'verified',
  },
  {
    id: 'signal-04',
    platform: 'Mirror site',
    detectedAt: '2026-04-18T13:40:00+05:30',
    velocityScore: 61,
    anomalyScore: 57,
    url: 'https://example.com/mirror/courtside-studio',
    clipThumb: assetStill,
    status: 'investigating',
  },
]

export const alertsSeed: PiracyAlert[] = [
  {
    id: 'alert-01',
    assetId: 'asset-01',
    severity: 'critical',
    confidence: 97,
    status: 'takedown_requested',
    sourcePlatform: 'Telegram',
    suspectedUrl: 'https://example.com/telegram/championship-night-feed',
    matchedAt: '2026-04-18T14:03:00+05:30',
    reviewer: 'Legal Ops',
    summary: 'Full-length rebroadcast detected with synchronized crowd audio and watermark survivability.',
  },
  {
    id: 'alert-02',
    assetId: 'asset-02',
    severity: 'high',
    confidence: 89,
    status: 'in_review',
    sourcePlatform: 'Reddit',
    suspectedUrl: 'https://example.com/reddit/legends-cup',
    matchedAt: '2026-04-18T13:58:00+05:30',
    reviewer: 'Priya S.',
    summary: 'Edited highlight reel shares 84% visual overlap and link-outs to off-platform player.',
  },
  {
    id: 'alert-03',
    assetId: 'asset-03',
    severity: 'high',
    confidence: 91,
    status: 'escalated',
    sourcePlatform: 'Discord',
    suspectedUrl: 'https://example.com/discord/sprint-qualifier',
    matchedAt: '2026-04-18T13:51:00+05:30',
    reviewer: 'Trust & Safety',
    summary: 'Invite-only stream relay is growing quickly across mirrored invite posts.',
  },
  {
    id: 'alert-04',
    assetId: 'asset-04',
    severity: 'medium',
    confidence: 71,
    status: 'open',
    sourcePlatform: 'Mirror site',
    suspectedUrl: 'https://example.com/mirror/courtside-studio',
    matchedAt: '2026-04-18T13:40:00+05:30',
    reviewer: 'Unassigned',
    summary: 'Clip appears in an aggregation page with monetized overlays and suspicious referral traffic.',
  },
]

export const evidenceSeed: Record<string, CaseEvidence> = {
  'alert-01': {
    alertId: 'alert-01',
    similarityScore: 97,
    extractedFrames: [assetStill, assetStill, assetStill],
    transcriptSnippet:
      'Watch live now, alternate feed active. No subscription required. Mirror refresh every five minutes.',
    contextText:
      'Thread advertises a full match relay with rotating short links and asks users to jump before moderators remove it.',
    reasoningSummary:
      'The suspect post distributes continuous live access to premium match footage. Visual overlap is extremely high, the contextual text explicitly promotes evasion, and no fair-use commentary is present.',
    recommendedAction: 'Maintain automated takedown request and block downstream mirrors.',
    activityLog: [
      {
        id: 'log-01',
        timestamp: '2026-04-18T14:03:00+05:30',
        actor: 'Vector Search',
        action: 'Matched official asset',
        detail: 'Nearest-neighbor lookup returned 0.97 similarity against Championship Night Feed.',
      },
      {
        id: 'log-02',
        timestamp: '2026-04-18T14:04:00+05:30',
        actor: 'Gemini verification',
        action: 'Classified as piracy',
        detail: 'Context indicates unauthorized rebroadcast and redistribution intent.',
      },
      {
        id: 'log-03',
        timestamp: '2026-04-18T14:05:00+05:30',
        actor: 'Legal Ops',
        action: 'Requested takedown',
        detail: 'Platform escalation template dispatched to host and link shortener.',
      },
    ],
  },
  'alert-02': {
    alertId: 'alert-02',
    similarityScore: 89,
    extractedFrames: [assetStill, assetStill, assetStill],
    transcriptSnippet:
      'All six boundaries from tonight bundled into one stream archive, join for the full thread.',
    contextText:
      'The post frames itself as commentary, but the outbound destination hosts the full packaged highlights video without rights language.',
    reasoningSummary:
      'Likely infringing. The edit is shorter than the official source but still reproduces substantial portions and redirects viewers to unauthorized playback.',
    recommendedAction: 'Complete human review and issue a takedown if full clip hosting is confirmed.',
    activityLog: [
      {
        id: 'log-04',
        timestamp: '2026-04-18T13:58:00+05:30',
        actor: 'Crawler',
        action: 'Indexed suspicious post',
        detail: 'Captured page metadata and outbound video destination.',
      },
      {
        id: 'log-05',
        timestamp: '2026-04-18T14:00:00+05:30',
        actor: 'Reviewer queue',
        action: 'Assigned for review',
        detail: 'Priya S. opened the case due to high overlap and monetized redirect.',
      },
    ],
  },
  'alert-03': {
    alertId: 'alert-03',
    similarityScore: 91,
    extractedFrames: [assetStill, assetStill, assetStill],
    transcriptSnippet:
      'Discord mirror online. Join the backup server if the primary stage gets clipped.',
    contextText:
      'Invite messages are coordinated across multiple channels and include repost instructions to bypass moderation.',
    reasoningSummary:
      'High-confidence piracy behavior supported by coordinated distribution language and rapid audience migration patterns.',
    recommendedAction: 'Escalate to trust and safety, preserve evidence, and request coordinated platform response.',
    activityLog: [
      {
        id: 'log-06',
        timestamp: '2026-04-18T13:51:00+05:30',
        actor: 'Anomaly detector',
        action: 'Flagged propagation burst',
        detail: 'Detected a 4.8x increase in invite sharing rate against baseline.',
      },
    ],
  },
  'alert-04': {
    alertId: 'alert-04',
    similarityScore: 71,
    extractedFrames: [assetStill, assetStill, assetStill],
    transcriptSnippet:
      'Studio clip leaked before postgame segment. Watch embedded player below.',
    contextText:
      'The page mixes sports snippets with ad-heavy clickbait and offers an embedded player that resembles scraped social clips.',
    reasoningSummary:
      'Potential infringement, but confidence is lower because clip length is short and transformation level is unclear.',
    recommendedAction: 'Gather more evidence before enforcement; monitor for escalation.',
    activityLog: [
      {
        id: 'log-07',
        timestamp: '2026-04-18T13:40:00+05:30',
        actor: 'Monitoring wall',
        action: 'Opened case',
        detail: 'Queued due to repeat uploader and rising offsite referral volume.',
      },
    ],
  },
}

export const dashboardMetricsSeed: DashboardMetric[] = [
  {
    label: 'Live matches under watch',
    value: '18',
    delta: '+4 vs last fixture window',
    trend: 'up',
    status: 'healthy',
  },
  {
    label: 'Average detection latency',
    value: '2.4 min',
    delta: '-31% faster today',
    trend: 'down',
    status: 'healthy',
  },
  {
    label: 'Open critical incidents',
    value: '3',
    delta: '+1 in the last 10 min',
    trend: 'up',
    status: 'critical',
  },
  {
    label: 'Minutes saved vs manual',
    value: '47 min',
    delta: '+12 min',
    trend: 'up',
    status: 'warning',
  },
]

export const realtimeTrendSeed: TrendPoint[] = [
  { label: '13:20', liveMatches: 3, anomalyIndex: 34, takedowns: 1 },
  { label: '13:30', liveMatches: 5, anomalyIndex: 42, takedowns: 1 },
  { label: '13:40', liveMatches: 7, anomalyIndex: 51, takedowns: 2 },
  { label: '13:50', liveMatches: 8, anomalyIndex: 63, takedowns: 3 },
  { label: '14:00', liveMatches: 10, anomalyIndex: 74, takedowns: 4 },
  { label: '14:10', liveMatches: 9, anomalyIndex: 67, takedowns: 5 },
]

export const reportTrendSeed: ReportPoint[] = [
  { label: 'Mon', takedowns: 18, falsePositives: 2, responseMinutes: 4 },
  { label: 'Tue', takedowns: 22, falsePositives: 3, responseMinutes: 3.8 },
  { label: 'Wed', takedowns: 26, falsePositives: 4, responseMinutes: 3.4 },
  { label: 'Thu', takedowns: 31, falsePositives: 2, responseMinutes: 3.1 },
  { label: 'Fri', takedowns: 28, falsePositives: 3, responseMinutes: 2.9 },
  { label: 'Sat', takedowns: 36, falsePositives: 5, responseMinutes: 2.7 },
]

export const platformBreakdownSeed: PlatformBreakdown[] = [
  { platform: 'Telegram', incidents: 32, enforcementRate: 92 },
  { platform: 'Reddit', incidents: 18, enforcementRate: 74 },
  { platform: 'Discord', incidents: 21, enforcementRate: 81 },
  { platform: 'Mirror sites', incidents: 15, enforcementRate: 67 },
]

export const teamMembers: TeamMember[] = [
  { name: 'Priya Sharma', role: 'Review analyst', coverage: 'Highlights and social clips' },
  { name: 'Harsh Verma', role: 'Legal operations', coverage: 'DMCA and platform escalation' },
  { name: 'Tanya Bose', role: 'Trust & safety', coverage: 'Bot networks and repeat offenders' },
]

export const integrations: IntegrationCard[] = [
  {
    name: 'Firebase Auth',
    description: 'Secure broadcaster sign-in and role-aware session routing.',
    status: 'Coming soon',
  },
  {
    name: 'Vertex AI Vector Search',
    description: 'Sub-second visual matching with streaming index updates.',
    status: 'Coming soon',
  },
  {
    name: 'BigQuery ML',
    description: 'Burst detection across propagation telemetry and crawler events.',
    status: 'Coming soon',
  },
  {
    name: 'Firecrawl Agent',
    description: 'Continuous monitoring of approved public targets and watchlists.',
    status: 'Coming soon',
  },
]

export const heroMedia = {
  background: '/football-match.mp4',
  secondary: opsGrid,
  tertiary: radarDeck,
  uploadPreview: cryptoDesk,
}

export const manualVsAi = [
  { phase: 'Detect', manual: '5-15 min', automated: '1-5 min' },
  { phase: 'Verify', manual: '30-60 min', automated: '< 2 min' },
  { phase: 'Act', manual: '2-24 hr', automated: 'Minutes' },
]
