<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { reviewApi } from '@/api/review'

const slug = ref('')
const review = ref<any>(null)
const steps = ref<any[]>([])
const loading = ref(true)

onLoad((query) => {
  if (query?.slug) {
    slug.value = query.slug
    loadDetail()
  }
})

async function loadDetail() {
  loading.value = true
  try {
    const [detailRes, stepsRes] = await Promise.all([
      reviewApi.getBySlug(slug.value),
      reviewApi.getSteps(slug.value),
    ])
    review.value = detailRes.data || detailRes
    steps.value = stepsRes.data || stepsRes
  } catch (err) {
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

const scores = computed(() => {
  if (!review.value) return []
  return [
    { label: '收益潜力', score: Number(review.value.scoreEarnings), color: '#f59e0b' },
    { label: '风险指数', score: Number(review.value.scoreRisk), color: '#ef4444', inverted: true },
    { label: '市场稳定性', score: Number(review.value.scoreMarketStability), color: '#3b82f6' },
    { label: '上手难度', score: Number(review.value.scoreDifficulty), color: '#8b5cf6', inverted: true },
    { label: '合规安全', score: Number(review.value.scoreCompliance), color: '#10b981' },
  ]
})

function scoreColor(score: number): string {
  if (score >= 8) return '#10b981'
  if (score >= 6) return '#07c160'
  if (score >= 4) return '#f59e0b'
  return '#ef4444'
}
</script>

<template>
  <view v-if="loading" class="loading-page">
    <text>加载中...</text>
  </view>

  <view v-else-if="review" class="detail-page">
    <!-- 封面 -->
    <image v-if="review.coverImage" :src="review.coverImage" class="cover-image" mode="aspectFill" />
    <view class="cover-placeholder" v-else>
      <text class="cover-title">{{ review.title }}</text>
    </view>

    <!-- 标题区 -->
    <view class="title-section">
      <text class="review-title">{{ review.title }}</text>
      <view class="title-tags">
        <text class="tag" :style="{ background: scoreColor(Number(review.scoreOverall)) }">
          {{ review.scoreOverall }} 分
        </text>
        <text class="tag">💰 {{ review.startupCost ? `¥${review.startupCost}` : '零成本' }}</text>
        <text class="tag">⏱ {{ review.timeCommitment || '灵活' }}</text>
        <text class="tag">{{ review.difficulty === 'EASY' ? '🌟简单' : review.difficulty === 'MEDIUM' ? '中等' : '较难' }}</text>
      </view>
      <text class="review-summary">{{ review.summary }}</text>
    </view>

    <!-- 综合评分 -->
    <view class="section">
      <text class="section-title">📊 综合评分</text>
      <view class="score-overall">
        <view class="score-circle">
          <text class="score-big" :style="{ color: scoreColor(Number(review.scoreOverall)) }">
            {{ review.scoreOverall }}
          </text>
          <text class="score-label">综合评分</text>
        </view>
        <view class="score-details">
          <view v-for="s in scores" :key="s.label" class="score-row">
            <text class="score-row-label">{{ s.label }}</text>
            <view class="score-bar-bg">
              <view
                class="score-bar-fill"
                :style="{ width: (s.inverted ? 10 - s.score : s.score) * 10 + '%', background: s.color }"
              ></view>
            </view>
            <text class="score-row-value" :style="{ color: s.color }">{{ s.score }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 收入区间 -->
    <view class="section" v-if="review.incomeMin !== null">
      <text class="section-title">💰 收入区间</text>
      <view class="income-box">
        <view class="income-range">
          <text class="income-amount">{{ review.incomeMin }}-{{ review.incomeMax }}</text>
          <text class="income-unit">元/月</text>
        </view>
        <view class="income-periods">
          <view class="period-item">
            <text class="period-label">新手期</text>
            <text class="period-value">{{ review.incomeMin }}元/月</text>
          </view>
          <view class="period-divider"></view>
          <view class="period-item">
            <text class="period-label">成熟期</text>
            <text class="period-value">{{ review.incomeMax }}元/月</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 优点/缺点 -->
    <view class="section">
      <text class="section-title">✅ 优势亮点</text>
      <view v-for="(p, i) in review.pros" :key="i" class="pros-item">
        <text class="bullet">✓</text>
        <text>{{ p }}</text>
      </view>
    </view>

    <view class="section">
      <text class="section-title">⚠️ 缺点 & 潜在风险</text>
      <view v-for="(c, i) in review.cons" :key="i" class="cons-item">
        <text class="bullet">✗</text>
        <text>{{ c }}</text>
      </view>
    </view>

    <!-- 实操步骤 -->
    <view class="section" v-if="steps.length > 0">
      <text class="section-title">📝 怎么做：实操步骤</text>
      <view v-for="step in steps" :key="step.id" class="step-item">
        <view class="step-number">{{ step.stepNumber }}</view>
        <view class="step-body">
          <text class="step-title">{{ step.title }}</text>
          <text class="step-content">{{ step.content }}</text>
        </view>
      </view>
    </view>

    <!-- 详细内容 -->
    <view class="section">
      <text class="section-title">📖 详细评测</text>
      <rich-text class="content-rich" :nodes="review.content"></rich-text>
    </view>

    <!-- 避坑提醒 -->
    <view class="scam-alert" v-if="review.scamAlerts?.length">
      <text class="alert-title">🚨 避坑提醒</text>
      <view v-for="(alert, i) in review.scamAlerts" :key="i" class="alert-item">
        <text>{{ alert }}</text>
      </view>
    </view>

    <!-- 适合人群 -->
    <view class="section" v-if="review.requirements?.length">
      <text class="section-title">👥 适合 / 不适合人群</text>
      <view class="audience-list">
        <view class="audience-fit">
          <text class="audience-label">✅ 适合</text>
          <text v-for="req in review.requirements" :key="req" class="audience-tag">{{ req }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss">
.loading-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
  color: #999;
}

.detail-page {
  padding-bottom: 40rpx;
}

.cover-image {
  width: 100%;
  height: 400rpx;
}

.cover-placeholder {
  width: 100%;
  height: 300rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #07c160, #10b981);

  .cover-title {
    color: #fff;
    font-size: 36rpx;
    font-weight: 700;
    padding: 40rpx;
    text-align: center;
  }
}

.title-section {
  padding: 24rpx 20rpx;
  background: #fff;

  .review-title {
    font-size: 36rpx;
    font-weight: 700;
    color: #1a1a1a;
  }

  .title-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10rpx;
    margin-top: 16rpx;

    .tag {
      padding: 4rpx 16rpx;
      background: #f0fdf4;
      color: #07c160;
      font-size: 22rpx;
      border-radius: 20rpx;
    }

    .tag:first-child { color: #fff; }
  }

  .review-summary {
    display: block;
    margin-top: 16rpx;
    font-size: 28rpx;
    color: #666;
    line-height: 1.6;
  }
}

.section {
  background: #fff;
  margin-top: 16rpx;
  padding: 24rpx 20rpx;

  .section-title {
    font-size: 30rpx;
    font-weight: 600;
    color: #1a1a1a;
    display: block;
    margin-bottom: 16rpx;
  }

  .score-overall {
    display: flex;
    align-items: flex-start;

    .score-circle {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-right: 30rpx;
      border-right: 2rpx solid #f0f0f0;

      .score-big {
        font-size: 72rpx;
        font-weight: 800;
      }

      .score-label {
        font-size: 22rpx;
        color: #999;
        margin-top: 4rpx;
      }
    }

    .score-details {
      flex: 1;
      padding-left: 24rpx;

      .score-row {
        display: flex;
        align-items: center;
        margin-bottom: 12rpx;

        .score-row-label {
          width: 120rpx;
          font-size: 24rpx;
          color: #666;
          flex-shrink: 0;
        }

        .score-bar-bg {
          flex: 1;
          height: 16rpx;
          background: #f0f0f0;
          border-radius: 8rpx;
          margin: 0 12rpx;
          overflow: hidden;

          .score-bar-fill {
            height: 100%;
            border-radius: 8rpx;
            transition: width 0.3s;
          }
        }

        .score-row-value {
          width: 50rpx;
          text-align: right;
          font-size: 26rpx;
          font-weight: 600;
        }
      }
    }
  }

  .income-box {
    background: linear-gradient(135deg, #fef3c7, #fde68a);
    border-radius: 16rpx;
    padding: 24rpx;

    .income-range {
      display: flex;
      align-items: baseline;
      justify-content: center;

      .income-amount {
        font-size: 52rpx;
        font-weight: 800;
        color: #92400e;
      }

      .income-unit {
        font-size: 26rpx;
        color: #92400e;
        margin-left: 8rpx;
      }
    }

    .income-periods {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 16rpx;
      padding-top: 16rpx;
      border-top: 1rpx solid rgba(146, 64, 14, 0.2);

      .period-item {
        text-align: center;

        .period-label {
          font-size: 22rpx;
          color: #92400e;
        }

        .period-value {
          font-size: 28rpx;
          font-weight: 600;
          color: #92400e;
          margin-top: 4rpx;
          display: block;
        }
      }

      .period-divider {
        width: 1rpx;
        height: 40rpx;
        background: rgba(146, 64, 14, 0.3);
        margin: 0 40rpx;
      }
    }
  }

  .pros-item, .cons-item {
    display: flex;
    align-items: flex-start;
    padding: 8rpx 0;

    .bullet {
      margin-right: 12rpx;
      font-weight: 700;
    }
  }

  .pros-item .bullet { color: #10b981; }
  .cons-item .bullet { color: #ef4444; }

  .step-item {
    display: flex;
    margin-bottom: 24rpx;

    .step-number {
      width: 44rpx;
      height: 44rpx;
      border-radius: 50%;
      background: #07c160;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22rpx;
      font-weight: 600;
      flex-shrink: 0;
    }

    .step-body {
      flex: 1;
      margin-left: 16rpx;

      .step-title {
        font-size: 28rpx;
        font-weight: 500;
        color: #333;
      }

      .step-content {
        font-size: 26rpx;
        color: #666;
        margin-top: 8rpx;
        line-height: 1.6;
        display: block;
      }
    }
  }

  .content-rich {
    line-height: 1.8;
    font-size: 28rpx;
    color: #444;
  }

  .audience-list {
    .audience-fit {
      .audience-label {
        font-size: 26rpx;
        font-weight: 500;
        display: block;
        margin-bottom: 12rpx;
      }

      .audience-tag {
        display: inline-block;
        padding: 6rpx 20rpx;
        background: #f0fdf4;
        color: #07c160;
        font-size: 24rpx;
        border-radius: 20rpx;
        margin-right: 12rpx;
        margin-bottom: 8rpx;
      }
    }
  }
}

.scam-alert {
  margin: 16rpx 20rpx;
  padding: 20rpx;
  background: linear-gradient(135deg, #fef2f2, #fee2e2);
  border-radius: 16rpx;
  border: 1rpx solid #fecaca;

  .alert-title {
    font-size: 28rpx;
    font-weight: 600;
    color: #dc2626;
    display: block;
    margin-bottom: 12rpx;
  }

  .alert-item {
    font-size: 26rpx;
    color: #991b1b;
    padding: 6rpx 0;
    &:before {
      content: '⚠ ';
    }
  }
}
</style>
