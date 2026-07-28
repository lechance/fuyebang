<script setup lang="ts">
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { reviewApi } from '@/api/review'

const slugA = ref('')
const slugB = ref('')
const reviewA = ref<any>(null)
const reviewB = ref<any>(null)
const loading = ref(true)

onLoad((query) => {
  if (query?.a && query?.b) {
    slugA.value = query.a
    slugB.value = query.b
    loadCompare()
  }
})

async function loadCompare() {
  loading.value = true
  try {
    const [resA, resB] = await Promise.all([
      reviewApi.getBySlug(slugA.value),
      reviewApi.getBySlug(slugB.value),
    ])
    reviewA.value = resA.data || resA
    reviewB.value = resB.data || resB
  } catch (err) {
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

const scoreDimensions = computed(() => [
  { key: 'scoreEarnings', label: '收益潜力', unit: '分', better: 'high' },
  { key: 'scoreRisk', label: '风险指数', unit: '分', better: 'low' },
  { key: 'scoreMarketStability', label: '市场稳定性', unit: '分', better: 'high' },
  { key: 'scoreDifficulty', label: '上手难度', unit: '分', better: 'low' },
  { key: 'scoreCompliance', label: '合规安全', unit: '分', better: 'high' },
])

function compareValue(key: string): 'win' | 'lose' | 'tie' {
  if (!reviewA.value || !reviewB.value) return 'tie'
  const va = Number(reviewA.value[key]) || 0
  const vb = Number(reviewB.value[key]) || 0
  if (va === vb) return 'tie'

  const dim = scoreDimensions.value.find(d => d.key === key)
  if (dim?.better === 'high') return va > vb ? 'win' : 'lose'
  return va < vb ? 'win' : 'lose'
}

function compareClass(key: string, side: 'a' | 'b'): string {
  const result = compareValue(key)
  if (result === 'tie') return ''
  if (side === 'a' && result === 'win') return 'better'
  if (side === 'b' && result === 'lose') return 'better'
  if (side === 'a' && result === 'lose') return 'worse'
  if (side === 'b' && result === 'win') return 'worse'
  return ''
}

function scoreColor(score: number): string {
  if (score >= 8) return '#10b981'
  if (score >= 6) return '#07c160'
  if (score >= 4) return '#f59e0b'
  return '#ef4444'
}

function goDetail(slug: string) {
  uni.navigateTo({ url: `/pages/subpkg-review/detail?slug=${slug}` })
}
</script>

<template>
  <view v-if="loading" class="loading-page">
    <text>加载对比数据...</text>
  </view>

  <view v-else-if="reviewA && reviewB" class="compare-page">
    <!-- 对比头部 -->
    <view class="compare-header">
      <view class="compare-item" @tap="goDetail(slugA)">
        <image v-if="reviewA.coverImage" :src="reviewA.coverImage" class="compare-cover" mode="aspectFill" />
        <view class="compare-cover-placeholder" v-else>
          <text class="placeholder-text">{{ reviewA.title.slice(0, 6) }}</text>
        </view>
        <text class="compare-name">{{ reviewA.title }}</text>
      </view>
      <view class="vs-badge">VS</view>
      <view class="compare-item" @tap="goDetail(slugB)">
        <image v-if="reviewB.coverImage" :src="reviewB.coverImage" class="compare-cover" mode="aspectFill" />
        <view class="compare-cover-placeholder" v-else>
          <text class="placeholder-text">{{ reviewB.title.slice(0, 6) }}</text>
        </view>
        <text class="compare-name">{{ reviewB.title }}</text>
      </view>
    </view>

    <!-- 综合评分对比 -->
    <view class="section">
      <text class="section-title">🎯 综合评分</text>
      <view class="overall-row">
        <view class="overall-item">
          <text class="overall-score" :style="{ color: scoreColor(Number(reviewA.scoreOverall)) }">
            {{ reviewA.scoreOverall }}
          </text>
          <text class="overall-label">综合分</text>
        </view>
        <view class="overall-divider"></view>
        <view class="overall-item">
          <text class="overall-score" :style="{ color: scoreColor(Number(reviewB.scoreOverall)) }">
            {{ reviewB.scoreOverall }}
          </text>
          <text class="overall-label">综合分</text>
        </view>
      </view>
    </view>

    <!-- 分项评分对比 -->
    <view class="section">
      <text class="section-title">📊 分项评分</text>
      <view v-for="dim in scoreDimensions" :key="dim.key" class="dimension-row">
        <text class="dim-label">{{ dim.label }}</text>
        <view class="dim-values">
          <text :class="['dim-score', compareClass(dim.key, 'a')]" :style="{ color: scoreColor(Number(reviewA[dim.key])) }">
            {{ reviewA[dim.key] }}
          </text>
          <text class="dim-unit">分</text>
          <view class="dim-bar-bg">
            <view class="dim-bar-fill"
              :style="{ width: Number(reviewA[dim.key]) * 10 + '%', background: scoreColor(Number(reviewA[dim.key])) }">
            </view>
          </view>
        </view>
        <view class="dim-vs">VS</view>
        <view class="dim-values">
          <text :class="['dim-score', compareClass(dim.key, 'b')]" :style="{ color: scoreColor(Number(reviewB[dim.key])) }">
            {{ reviewB[dim.key] }}
          </text>
          <text class="dim-unit">分</text>
          <view class="dim-bar-bg">
            <view class="dim-bar-fill"
              :style="{ width: Number(reviewB[dim.key]) * 10 + '%', background: scoreColor(Number(reviewB[dim.key])) }">
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 基本信息对比 -->
    <view class="section">
      <text class="section-title">📋 基本信息</text>
      <view class="info-table">
        <view class="info-row">
          <text class="info-label">启动成本</text>
          <text class="info-value-a">{{ reviewA.startupCost ? `¥${reviewA.startupCost}` : '零成本' }}</text>
          <text class="info-value-b">{{ reviewB.startupCost ? `¥${reviewB.startupCost}` : '零成本' }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">收入区间</text>
          <text class="info-value-a">{{ reviewA.incomeMin && reviewA.incomeMax ? `${reviewA.incomeMin}-${reviewA.incomeMax}元/月` : '未提供' }}</text>
          <text class="info-value-b">{{ reviewB.incomeMin && reviewB.incomeMax ? `${reviewB.incomeMin}-${reviewB.incomeMax}元/月` : '未提供' }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">难度等级</text>
          <text class="info-value-a">{{ reviewA.difficulty === 'EASY' ? '简单' : reviewA.difficulty === 'MEDIUM' ? '中等' : reviewA.difficulty === 'HARD' ? '较难' : '专家' }}</text>
          <text class="info-value-b">{{ reviewB.difficulty === 'EASY' ? '简单' : reviewB.difficulty === 'MEDIUM' ? '中等' : reviewB.difficulty === 'HARD' ? '较难' : '专家' }}</text>
        </view>
        <view class="info-row">
          <text class="info-label">时间投入</text>
          <text class="info-value-a">{{ reviewA.timeCommitment || '灵活' }}</text>
          <text class="info-value-b">{{ reviewB.timeCommitment || '灵活' }}</text>
        </view>
      </view>
    </view>

    <!-- 优点对比 -->
    <view class="section">
      <text class="section-title">✅ 优势</text>
      <view class="pros-grid">
        <view class="pros-column">
          <text class="pros-title">{{ reviewA.title }}</text>
          <view v-for="(p, i) in reviewA.pros || []" :key="i" class="pros-item">
            <text class="check-icon">✓</text>
            <text>{{ p }}</text>
          </view>
          <text v-if="!reviewA.pros?.length" class="empty-text">暂无数据</text>
        </view>
        <view class="pros-divider"></view>
        <view class="pros-column">
          <text class="pros-title">{{ reviewB.title }}</text>
          <view v-for="(p, i) in reviewB.pros || []" :key="i" class="pros-item">
            <text class="check-icon">✓</text>
            <text>{{ p }}</text>
          </view>
          <text v-if="!reviewB.pros?.length" class="empty-text">暂无数据</text>
        </view>
      </view>
    </view>

    <!-- 缺点对比 -->
    <view class="section">
      <text class="section-title">⚠️ 缺点 & 风险</text>
      <view class="pros-grid">
        <view class="pros-column">
          <text class="pros-title">{{ reviewA.title }}</text>
          <view v-for="(c, i) in reviewA.cons || []" :key="i" class="cons-item">
            <text class="cross-icon">✗</text>
            <text>{{ c }}</text>
          </view>
          <text v-if="!reviewA.cons?.length" class="empty-text">暂无数据</text>
        </view>
        <view class="pros-divider"></view>
        <view class="pros-column">
          <text class="pros-title">{{ reviewB.title }}</text>
          <view v-for="(c, i) in reviewB.cons || []" :key="i" class="cons-item">
            <text class="cross-icon">✗</text>
            <text>{{ c }}</text>
          </view>
          <text v-if="!reviewB.cons?.length" class="empty-text">暂无数据</text>
        </view>
      </view>
    </view>
  </view>

  <view v-else class="loading-page">
    <text>请传入两个评测 slug 进行对比</text>
  </view>
</template>

<style lang="scss">
.loading-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
  color: #999;
  font-size: 28rpx;
}

.compare-page {
  padding-bottom: 40rpx;
}

.compare-header {
  display: flex;
  align-items: center;
  padding: 24rpx 20rpx;
  background: #fff;

  .compare-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .compare-cover {
    width: 160rpx;
    height: 160rpx;
    border-radius: 16rpx;
  }

  .compare-cover-placeholder {
    width: 160rpx;
    height: 160rpx;
    border-radius: 16rpx;
    background: linear-gradient(135deg, #07c160, #10b981);
    display: flex;
    align-items: center;
    justify-content: center;

    .placeholder-text {
      color: #fff;
      font-size: 28rpx;
      font-weight: 600;
    }
  }

  .compare-name {
    font-size: 26rpx;
    font-weight: 500;
    color: #333;
    margin-top: 12rpx;
    text-align: center;
    lines: 1;
  }

  .vs-badge {
    width: 60rpx;
    height: 60rpx;
    border-radius: 50%;
    background: #f59e0b;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24rpx;
    font-weight: 800;
    margin: 0 16rpx;
    flex-shrink: 0;
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
}

.overall-row {
  display: flex;
  align-items: center;

  .overall-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;

    .overall-score {
      font-size: 80rpx;
      font-weight: 800;
    }
    .overall-label {
      font-size: 24rpx;
      color: #999;
      margin-top: 4rpx;
    }
  }

  .overall-divider {
    width: 2rpx;
    height: 80rpx;
    background: #f0f0f0;
  }
}

.dimension-row {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;

  .dim-label {
    width: 120rpx;
    font-size: 24rpx;
    color: #666;
    flex-shrink: 0;
  }

  .dim-values {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 6rpx;

    .dim-score {
      font-size: 32rpx;
      font-weight: 700;
      width: 54rpx;
      text-align: center;

      &.better { position: relative; }
      &.better::after {
        content: '↑';
        position: absolute;
        top: -8rpx;
        right: -16rpx;
        font-size: 20rpx;
      }
      &.worse { opacity: 0.6; }
    }

    .dim-unit {
      font-size: 20rpx;
      color: #bbb;
    }

    .dim-bar-bg {
      flex: 1;
      height: 12rpx;
      background: #f0f0f0;
      border-radius: 6rpx;
      overflow: hidden;
      margin-left: 4rpx;

      .dim-bar-fill {
        height: 100%;
        border-radius: 6rpx;
      }
    }
  }

  .dim-vs {
    width: 48rpx;
    text-align: center;
    font-size: 20rpx;
    color: #f59e0b;
    font-weight: 700;
    flex-shrink: 0;
  }
}

.info-table {
  .info-row {
    display: flex;
    border-bottom: 1rpx solid #f5f5f5;
    padding: 16rpx 0;

    &:last-child { border-bottom: none; }

    .info-label {
      width: 140rpx;
      font-size: 26rpx;
      color: #999;
      flex-shrink: 0;
    }

    .info-value-a, .info-value-b {
      flex: 1;
      font-size: 26rpx;
      color: #333;
      text-align: center;
    }
  }
}

.pros-grid {
  display: flex;

  .pros-column {
    flex: 1;
    padding: 0 8rpx;

    .pros-title {
      font-size: 24rpx;
      font-weight: 600;
      color: #333;
      display: block;
      text-align: center;
      margin-bottom: 12rpx;
    }

    .pros-item {
      display: flex;
      align-items: flex-start;
      padding: 6rpx 0;
      font-size: 24rpx;
      color: #555;

      .check-icon { color: #10b981; margin-right: 6rpx; }
    }

    .cons-item {
      display: flex;
      align-items: flex-start;
      padding: 6rpx 0;
      font-size: 24rpx;
      color: #555;

      .cross-icon { color: #ef4444; margin-right: 6rpx; }
    }

    .empty-text {
      font-size: 22rpx;
      color: #ccc;
      text-align: center;
      display: block;
    }
  }

  .pros-divider {
    width: 2rpx;
    background: #f0f0f0;
    margin: 0 12rpx;
  }
}
</style>
