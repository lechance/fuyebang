// 分类常量
export const HOME_CATEGORIES = [
  { key: '居家线上', icon: '🏠', desc: '零出门' },
  { key: '线下轻资产', icon: '🚶', desc: '地摊、上门服务' },
  { key: '技能变现', icon: '💻', desc: '设计、剪辑、写作' },
  { key: '短期兼职', icon: '📅', desc: '日结、周末' },
  { key: '小众冷门', icon: '💡', desc: '高利润副业' },
]

// 副业标签
export const HUSTLE_TAGS = [
  '日结',
  '长期',
  '零成本',
  '轻资产',
  '不用人脉',
  '一台电脑即可',
  '适合学生',
  '适合宝妈',
  '适合上班族',
]

// 适合人群
export const TARGET_AUDIENCES = ['上班族', '学生', '宝妈', '自由职业者', '退休人员']

// 投入成本档位
export const COST_TIERS = [
  { key: 'free', label: '0 元', max: 0 },
  { key: 'budget', label: '百元档', max: 500 },
  { key: 'medium', label: '千元档', max: 5000 },
  { key: 'premium', label: '万元档', max: 50000 },
  { key: 'investment', label: '大额投资', max: Infinity },
]

// 收益周期
export const INCOME_PERIODS = ['hourly', 'daily', 'weekly', 'monthly', 'yearly'] as const
export const INCOME_PERIOD_LABELS: Record<string, string> = {
  hourly: '时薪',
  daily: '日结',
  weekly: '周结',
  monthly: '月结',
  yearly: '年收入',
}
