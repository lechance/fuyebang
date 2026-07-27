export enum ScamSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum ScamStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  DISMISSED = 'DISMISSED',
}

export const ScamSeverityLabels: Record<ScamSeverity, string> = {
  [ScamSeverity.LOW]: '低风险',
  [ScamSeverity.MEDIUM]: '中风险',
  [ScamSeverity.HIGH]: '高风险',
  [ScamSeverity.CRITICAL]: '严重危险',
}

export const ScamSeverityColors: Record<ScamSeverity, string> = {
  [ScamSeverity.LOW]: '#67c23a',
  [ScamSeverity.MEDIUM]: '#e6a23c',
  [ScamSeverity.HIGH]: '#f56c6c',
  [ScamSeverity.CRITICAL]: '#b91c1c',
}

export interface ScamReport {
  id: string
  title: string
  description: string
  scamType: string
  severity: ScamSeverity
  targetPlatform: string | null
  evidenceUrls: string[]
  preventionTips: string | null
  status: ScamStatus
  viewCount: number
  reporterId: string
  relatedHustleId: string | null
  createdAt: string
  updatedAt: string
}

export interface ScamReportCard {
  id: string
  title: string
  scamType: string
  severity: ScamSeverity
  targetPlatform: string | null
  status: ScamStatus
  viewCount: number
  createdAt: string
}

export interface ScamSubmitInput {
  title: string
  description: string
  scamType: string
  targetPlatform?: string
  evidenceUrls?: string[]
  relatedHustleId?: string
}

export interface ScamStats {
  total: number
  bySeverity: Record<ScamSeverity, number>
  byType: Record<string, number>
}
