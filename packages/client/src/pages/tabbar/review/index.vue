<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { reviewApi } from '@/api/review'

const reviews = ref<any[]>([])
const loading = ref(true)
const sortBy = ref('overall')
const page = ref(1)
const hasMore = ref(true)

const sortOptions = [
  { key: 'overall', label: '综合评分' },
  { key: 'earnings', label: '收益最高' },
  { key: 'risk', label: '风险最低' },
  { key: 'newest', label: '最新发布' },
  { key: 'views', label: '最多浏览' },
]

async function loadReviews(reset = false) {
  if (reset) { page.value = 1; hasMore.value = true }
  if (!hasMore.value) return

  loading.value = true
  try {
    const res = await reviewApi.list({ sortBy: sortBy.value, page: page.value, pageSize: 20 })
    const list = res.data || []
    if (reset) {
      reviews.value = list
    } else {
      reviews.value = [...reviews.value, ...list]
    }
    hasMore.value = list.length >= 20
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

function changeSort(key: string) {
  sortBy.value = key
  loadReviews(true)
}

function goToDetail(slug: string) {
  uni.navigateTo({ url: `/pages/subpkg-review/detail?slug=${slug}` })
}

function goToRanking() {
  uni.navigateTo({ url: '/pages/subpkg-review/ranking' })
}

onMounted(() => loadReviews(true))

// Handle scroll to bottom
function onScrollToLower() {
  if (!loading.value) {
    page.value++
    loadReviews()
  }
}

function scoreColor(score: number): string {
  if (score >= 8) return '#10b981'
  if (score >= 6) return '#07c160'
  if (score >= 4) return '#f59e0b'
  return '#ef4444'
}
</script>

<template>
  <view class="review-page">
    <!-- Header -->
    <view class="page-header">
      <text class="page-title">副业评测中心</text>
      <text class="page-desc">客观评分，拒绝广告，帮你找到靠谱副业</text>
    </view>

    <!-- Sort tabs -->
    <scroll-view class="sort-tabs" scroll-x show-scrollbar="false">
      <view
        v-for="opt in sortOptions"
        :key="opt.key"
        :class="['sort-tab', { active: sortBy === opt.key }]"
        @tap="changeSort(opt.key)"
      >
        {{ opt.label }}
      </view>
    </scroll-view>

    <!-- Ranking buttons -->
    <view class="ranking-bar">
      <view class="ranking-btn" @tap="goToRanking">
        <text>🏆 查看更多榜单</text>
        <text class="arrow">›</text>
      </view>
    </view>

    <!-- Review list -->
    <view class="review-list" @scrolltolower="onScrollToLower">
      <view v-for="item in reviews" :key="item.id" class="review-card" @tap="goToDetail(item.slug)">
        <image v-if="item.coverImage" :src="item.coverImage" class="card-cover" mode="aspectFill" />
        <view class="card-body">
          <text class="card-title">{{ item.title }}</text>
          <text class="card-summary">{{ item.summary }}</text>

          <view class="card-scores">
            <view class="score-main">
              <text class="score-value" :style="{ color: scoreColor(item.scoreOverall) }">{{ item.scoreOverall }}</text>
              <text class="score-label">综合评分</text>
            </view>
            <view class="score-mini">
              <text>收益 {{ item.scoreEarnings }}</text>
              <text>风险 {{ item.scoreRisk }}</text>
              <text>难度 {{ item.scoreDifficulty }}</text>
            </view>
          </view>

          <view class="card-footer">
            <text class="footer-income" v-if="item.incomeMin !== null">
              💰 {{ item.incomeMin }}-{{ item.incomeMax }}元/月
            </text>
            <text class="footer-tag" v-if="item.startupCost !== null">投入 ¥{{ item.startupCost }}</text>
            <text class="footer-tag">{{ item.difficulty === 'EASY' ? '简单' : item.difficulty === 'MEDIUM' ? '中等' : '较难' }}</text>
            <text class="footer-views">{{ item.viewCount }}阅</text>
          </view>
        </view>
      </view>
    </view>

    <view v-if="loading" class="loading-more">
      <text>加载中...</text>
    </view>
    <view v-if="!hasMore && reviews.length > 0" class="no-more">
      <text>— 已经到底了 —</text>
    </view>
  </view>
</template>

<style lang="scss">
.review-page {
  min-height: 100vh;
}

.page-header {
  padding: 24rpx 20rpx 16rpx;
  background: #fff;

  .page-title {
    font-size: 36rpx;
    font-weight: 700;
    color: #1a1a1a;
  }

  .page-desc {
    font-size: 24rpx;
    color: #999;
    margin-top: 8rpx;
    display: block;
  }
}

.sort-tabs {
  white-space: nowrap;
  background: #fff;
  padding: 0 20rpx 16rpx;

  .sort-tab {
    display: inline-block;
    padding: 8rpx 24rpx;
    margin-right: 12rpx;
    font-size: 26rpx;
    color: #666;
    border-radius: 30rpx;
    background: #f5f5f5;

    &.active {
      color: #fff;
      background: #07c160;
      font-weight: 500;
    }
  }
}

.ranking-bar {
  padding: 16rpx 20rpx;
  background: #fff;

  .ranking-btn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16rpx 20rpx;
    background: linear-gradient(135deg, #fef3c7, #fde68a);
    border-radius: 12rpx;
    font-size: 26rpx;
    color: #92400e;

    .arrow {
      font-size: 32rpx;
    }
  }
}

.review-card {
  background: #fff;
  margin: 16rpx 20rpx;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);

  .card-cover {
    width: 100%;
    height: 320rpx;
  }

  .card-body {
    padding: 20rpx;

    .card-title {
      font-size: 30rpx;
      font-weight: 600;
      color: #1a1a1a;
    }

    .card-summary {
      font-size: 26rpx;
      color: #666;
      margin-top: 8rpx;
      lines: 2;
    }

    .card-scores {
      display: flex;
      align-items: center;
      margin-top: 16rpx;
      padding: 16rpx;
      background: #f8f9fa;
      border-radius: 12rpx;

      .score-main {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-right: 20rpx;
        border-right: 1rpx solid #e5e7eb;

        .score-value {
          font-size: 44rpx;
          font-weight: 700;
        }

        .score-label {
          font-size: 20rpx;
          color: #999;
          margin-top: 4rpx;
        }
      }

      .score-mini {
        display: flex;
        gap: 16rpx;
        padding-left: 20rpx;
        font-size: 22rpx;
        color: #666;
        flex-wrap: wrap;
      }
    }

    .card-footer {
      display: flex;
      flex-wrap: wrap;
      gap: 12rpx;
      margin-top: 16rpx;
      font-size: 22rpx;

      .footer-income {
        color: #f59e0b;
        font-weight: 500;
      }

      .footer-tag {
        color: #999;
        background: #f0f0f0;
        padding: 2rpx 12rpx;
        border-radius: 20rpx;
      }

      .footer-views {
        color: #bbb;
        margin-left: auto;
      }
    }
  }
}

.loading-more, .no-more {
  text-align: center;
  padding: 30rpx;
  font-size: 24rpx;
  color: #999;
}
</style>
