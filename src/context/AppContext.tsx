import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'
import {
  alertsSeed,
  dashboardMetricsSeed,
  demoUsers,
  evidenceSeed,
  mediaAssetsSeed,
  platformBreakdownSeed,
  realtimeTrendSeed,
  reportTrendSeed,
  threatSignalsSeed,
} from '../data/mockData'
import type {
  AlertStatus,
  CaseEvidence,
  DashboardMetric,
  MediaAsset,
  ModalAction,
  ModalState,
  PiracyAlert,
  PlatformBreakdown,
  ReportPoint,
  ThreatSignal,
  ToastMessage,
  TrendPoint,
  UserRole,
  UserSession,
} from '../types/models'

interface UploadInput {
  title: string
  sportCategory: string
  sourceType: string
  file: File
  filename?: string
}

interface AppContextValue {
  session: UserSession | null
  mediaAssets: MediaAsset[]
  threatSignals: ThreatSignal[]
  alerts: PiracyAlert[]
  evidence: Record<string, CaseEvidence>
  dashboardMetrics: DashboardMetric[]
  liveTrend: TrendPoint[]
  reportTrend: ReportPoint[]
  platformBreakdown: PlatformBreakdown[]
  modal: ModalState | null
  toasts: ToastMessage[]
  recentUploadId: string | null
  loginAs: (role: UserRole) => void
  logout: () => void
  addUpload: (input: UploadInput) => string
  openModal: (action: ModalAction, alertId: string) => void
  closeModal: () => void
  confirmModal: (payload?: { reviewer?: string }) => void
  dismissToast: (id: string) => void
  toggleNotification: (channel: keyof UserSession['notificationPrefs']) => void
}

const AppContext = createContext<AppContextValue | undefined>(undefined)

const storageKey = 'digital-asset-protection-session'

const modalCopy: Record<ModalAction, Omit<ModalState, 'alertId'>> = {
  assign: {
    action: 'assign',
    title: 'Assign review owner',
    description: 'Route this case to a reviewer so the evidence chain stays accountable.',
    confirmLabel: 'Assign case',
  },
  escalate: {
    action: 'escalate',
    title: 'Escalate incident',
    description: 'Move this alert into the priority response track for legal and trust & safety.',
    confirmLabel: 'Escalate now',
  },
  takedown: {
    action: 'takedown',
    title: 'Request takedown',
    description: 'Record a takedown request and notify downstream enforcement stakeholders.',
    confirmLabel: 'Request takedown',
  },
  false_positive: {
    action: 'false_positive',
    title: 'Mark as false positive',
    description: 'Close the case as non-infringing while preserving the review history.',
    confirmLabel: 'Mark false positive',
  },
}

function createToast(title: string, message: string, tone: ToastMessage['tone']): ToastMessage {
  return {
    id: `${title}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    title,
    message,
    tone,
  }
}

export function AppProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<UserSession | null>(() => {
    const raw = window.localStorage.getItem(storageKey)

    if (!raw) {
      return null
    }

    try {
      return JSON.parse(raw) as UserSession
    } catch {
      return null
    }
  })
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>(() => {
    const raw = window.localStorage.getItem('digital-asset-protection-assets')
    if (raw) {
      try {
        return JSON.parse(raw) as MediaAsset[]
      } catch {
        return mediaAssetsSeed
      }
    }
    return mediaAssetsSeed
  })
  const [threatSignals, setThreatSignals] = useState<ThreatSignal[]>(threatSignalsSeed)
  const [alerts, setAlerts] = useState<PiracyAlert[]>(alertsSeed)
  const [evidence, setEvidence] = useState<Record<string, CaseEvidence>>(structuredClone(evidenceSeed))
  const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetric[]>(dashboardMetricsSeed)
  const [liveTrend, setLiveTrend] = useState<TrendPoint[]>(realtimeTrendSeed)
  const [reportTrend] = useState<ReportPoint[]>(reportTrendSeed)
  const [platformBreakdown] = useState<PlatformBreakdown[]>(platformBreakdownSeed)
  const [modal, setModal] = useState<ModalState | null>(null)
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const [recentUploadId, setRecentUploadId] = useState<string | null>(null)

  useEffect(() => {
    if (session) {
      window.localStorage.setItem(storageKey, JSON.stringify(session))
      return
    }

    window.localStorage.removeItem(storageKey)
  }, [session])

  useEffect(() => {
    window.localStorage.setItem('digital-asset-protection-assets', JSON.stringify(mediaAssets))
  }, [mediaAssets])

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setThreatSignals((currentSignals) =>
        currentSignals.map((signal, index) => ({
          ...signal,
          velocityScore:
            index === 0
              ? Math.min(99, signal.velocityScore + 1)
              : Math.max(48, signal.velocityScore + (index % 2 === 0 ? -1 : 1)),
          anomalyScore:
            index === 0
              ? Math.min(97, signal.anomalyScore + 1)
              : Math.max(44, signal.anomalyScore + (index % 2 === 0 ? 1 : -1)),
        })),
      )

      setLiveTrend((currentTrend) => {
        const lastPoint = currentTrend[currentTrend.length - 1]
        const nextMinute = String((Number.parseInt(lastPoint.label.slice(-2), 10) + 10) % 60).padStart(2, '0')
        const nextHour = lastPoint.label.slice(0, 2)
        const nextLabel = `${nextHour}:${nextMinute}`

        return [
          ...currentTrend.slice(-5),
          {
            label: nextLabel,
            liveMatches: Math.max(4, lastPoint.liveMatches + (Math.random() > 0.5 ? 1 : -1)),
            anomalyIndex: Math.max(36, Math.min(94, lastPoint.anomalyIndex + (Math.random() > 0.5 ? 4 : -3))),
            takedowns: Math.max(1, lastPoint.takedowns + (Math.random() > 0.65 ? 1 : 0)),
          },
        ]
      })

      setDashboardMetrics((currentMetrics) =>
        currentMetrics.map((metric) =>
          metric.label === 'Average detection latency'
            ? { ...metric, value: `${(2.1 + Math.random() * 0.8).toFixed(1)} min` }
            : metric,
        ),
      )

      setToasts((currentToasts) => {
        if (currentToasts.length > 2) {
          return currentToasts
        }

        return [
          ...currentToasts,
          createToast(
            'Watchlist update',
            'Crawler telemetry detected a fresh burst of suspicious repost activity.',
            'info',
          ),
        ]
      })
    }, 8000)

    return () => window.clearInterval(intervalId)
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id))
  }, [])

  const loginAs = useCallback((role: UserRole) => {
    setSession(demoUsers[role])
    setToasts((currentToasts) => [
      ...currentToasts,
      createToast('Demo session ready', `Signed in as ${demoUsers[role].name}.`, 'success'),
    ])
  }, [])

  const logout = useCallback(() => {
    setSession(null)
  }, [])

  const addEvidenceLog = useCallback((alertId: string, actor: string, action: string, detail: string) => {
    setEvidence((currentEvidence) => {
      const targetEvidence = currentEvidence[alertId]

      if (!targetEvidence) {
        return currentEvidence
      }

      return {
        ...currentEvidence,
        [alertId]: {
          ...targetEvidence,
          activityLog: [
            {
              id: `log-${Date.now()}-${Math.random().toString(16).slice(2)}`,
              timestamp: new Date().toISOString(),
              actor,
              action,
              detail,
            },
            ...targetEvidence.activityLog,
          ],
        },
      }
    })
  }, [])

  const updateAlertStatus = useCallback(
    (alertId: string, status: AlertStatus, actor: string, detail: string, reviewer?: string) => {
      setAlerts((currentAlerts) =>
        currentAlerts.map((alert) =>
          alert.id === alertId
            ? {
                ...alert,
                status,
                reviewer: reviewer ?? alert.reviewer,
              }
            : alert,
        ),
      )

      addEvidenceLog(alertId, actor, status.replace(/_/g, ' '), detail)
    },
    [addEvidenceLog],
  )

  const openModal = useCallback((action: ModalAction, alertId: string) => {
    setModal({
      alertId,
      ...modalCopy[action],
    })
  }, [])

  const closeModal = useCallback(() => {
    setModal(null)
  }, [])

  const confirmModal = useCallback(
    (payload?: { reviewer?: string }) => {
      if (!modal) {
        return
      }

      if (modal.action === 'assign') {
        const reviewer = payload?.reviewer ?? 'Legal Ops'
        updateAlertStatus(modal.alertId, 'in_review', reviewer, `Case ownership moved to ${reviewer}.`, reviewer)
        setToasts((currentToasts) => [
          ...currentToasts,
          createToast('Reviewer assigned', `${reviewer} now owns this case.`, 'success'),
        ])
      }

      if (modal.action === 'escalate') {
        updateAlertStatus(
          modal.alertId,
          'escalated',
          'Trust & Safety',
          'Escalated into coordinated enforcement response lane.',
          'Trust & Safety',
        )
        setToasts((currentToasts) => [
          ...currentToasts,
          createToast('Escalation sent', 'Priority routing applied to this incident.', 'warning'),
        ])
      }

      if (modal.action === 'takedown') {
        updateAlertStatus(
          modal.alertId,
          'takedown_requested',
          'Legal Ops',
          'Automated takedown request logged with evidence bundle attached.',
          'Legal Ops',
        )
        setToasts((currentToasts) => [
          ...currentToasts,
          createToast('Takedown queued', 'The enforcement workflow has been simulated.', 'success'),
        ])
      }

      if (modal.action === 'false_positive') {
        updateAlertStatus(
          modal.alertId,
          'false_positive',
          'Reviewer queue',
          'Case closed as fair-use or non-infringing after review.',
        )
        setToasts((currentToasts) => [
          ...currentToasts,
          createToast('Case closed', 'Marked as false positive and preserved in history.', 'info'),
        ])
      }

      setModal(null)
    },
    [modal, updateAlertStatus],
  )

  const addUpload = useCallback((input: UploadInput) => {
    const previewUrl = input.filename ? `http://localhost:5000/uploads/${input.filename}` : URL.createObjectURL(input.file)
    const assetId = `asset-upload-${Date.now()}`
    const asset: MediaAsset = {
      id: assetId,
      title: input.title,
      sportCategory: input.sportCategory,
      sourceType: input.sourceType,
      uploadedAt: new Date().toISOString(),
      duration: input.file.type.startsWith('video/') ? '00:12:00' : '00:00:18',
      watermarkStatus: 'processing',
      embeddingStatus: 'queued',
      indexStatus: 'pending',
      thumbnail: previewUrl,
      videoSrc: previewUrl,
    }

    setMediaAssets((currentAssets) => [asset, ...currentAssets])
    setRecentUploadId(assetId)
    setToasts((currentToasts) => [
      ...currentToasts,
      createToast('Upload received', `${input.title} entered the mock processing pipeline.`, 'success'),
    ])

    window.setTimeout(() => {
      setMediaAssets((currentAssets) =>
        currentAssets.map((item) =>
          item.id === assetId ? { ...item, embeddingStatus: 'extracting' } : item,
        ),
      )
    }, 1400)

    window.setTimeout(() => {
      setMediaAssets((currentAssets) =>
        currentAssets.map((item) =>
          item.id === assetId ? { ...item, watermarkStatus: 'secured', embeddingStatus: 'ready', indexStatus: 'streaming' } : item,
        ),
      )
    }, 3200)

    window.setTimeout(() => {
      setMediaAssets((currentAssets) =>
        currentAssets.map((item) =>
          item.id === assetId ? { ...item, indexStatus: 'indexed' } : item,
        ),
      )
      setToasts((currentToasts) => [
        ...currentToasts,
        createToast('Vector index updated', `${input.title} is now searchable in the simulated index.`, 'info'),
      ])
    }, 5200)

    return assetId
  }, [])

  const toggleNotification = useCallback((channel: keyof UserSession['notificationPrefs']) => {
    setSession((currentSession) => {
      if (!currentSession) {
        return currentSession
      }

      return {
        ...currentSession,
        notificationPrefs: {
          ...currentSession.notificationPrefs,
          [channel]: !currentSession.notificationPrefs[channel],
        },
      }
    })
  }, [])

  const value = useMemo<AppContextValue>(
    () => ({
      session,
      mediaAssets,
      threatSignals,
      alerts,
      evidence,
      dashboardMetrics,
      liveTrend,
      reportTrend,
      platformBreakdown,
      modal,
      toasts,
      recentUploadId,
      loginAs,
      logout,
      addUpload,
      openModal,
      closeModal,
      confirmModal,
      dismissToast,
      toggleNotification,
    }),
    [
      session,
      mediaAssets,
      threatSignals,
      alerts,
      evidence,
      dashboardMetrics,
      liveTrend,
      reportTrend,
      platformBreakdown,
      modal,
      toasts,
      recentUploadId,
      loginAs,
      logout,
      addUpload,
      openModal,
      closeModal,
      confirmModal,
      dismissToast,
      toggleNotification,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAppContext() {
  const context = useContext(AppContext)

  if (!context) {
    throw new Error('useAppContext must be used within AppProvider')
  }

  return context
}
