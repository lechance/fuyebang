// 评测维度常量
export const REVIEW_DIMENSIONS = [
  { key: 'earnings', label: '收益潜力', color: '#f59e0b' },
  { key: 'risk', label: '风险指数', color: '#ef4444', inverted: true },
  { key: 'marketStability', label: '市场稳定性', color: '#3b82f6' },
  { key: 'difficulty', label: '上手难度', color: '#8b5cf6', inverted: true },
  { key: 'compliance', label: '合规安全', color: '#10b981' },
] as const

export const REVIEW_DIFFICULTY_LABELS = {
  EASY: '简单',
  MEDIUM: '中等',
  HARD: '较难',
  EXPERT: '专家级',
}

export const INCOME_RANGE_LABELS = {
  beginner: '新手期月收入',
  mature: '成熟期月收入',
}
