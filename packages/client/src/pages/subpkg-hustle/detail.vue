<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { hustleApi } from '@/api/side-hustle'
import { HustleCategoryLabels } from '@fuyebang/shared'

const slug = ref('')
const hustle = ref<any>(null)
const loading = ref(true)

onLoad((query) => {
  if (query?.slug) slug.value = query.slug
  loadDetail()
})

async function loadDetail() {
  loading.value = true
  try {
    const res = await hustleApi.getBySlug(slug.value)
    hustle.value = res.data || res
  } catch {
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

function goToReview(slug: string) {
  uni.navigateTo({ url: `/pages/subpkg-review/detail?slug=${slug}` })
}

function categoryLabel(cat: string): string {
  return (HustleCategoryLabels as any)[cat] || cat
}

function barrierLabel(barrier: string | null): string {
  const map: Record<string, string> = { '低': '🌟 门槛低', '中': '中等门槛', '高': '🔒 门槛较高' }
  return barrier ? (map[barrier] || barrier) : '信息待补充'
}

function incomeLabel(income: string | null): string {
  const map: Record<string, string> = { '低': '一般', '中': '中等', '高': '💰 较高收益' }
  return income ? (map[income] || income) : '信息待补充'
}
</script>

<template>
  <view v-if="loading" class="loading-page">加载中...</view>

  <view v-else-if="hustle" class="hustle-detail">
    <view class="header">
      <view class="header-icon">{{ hustle.icon || '💼' }}</view>
      <view class="header-info">
        <text class="hustle-name">{{ hustle.name }}</text>
        <text class="hustle-category">{{ categoryLabel(hustle.category) }}</text>
      </view>
      <view class="header-score" v-if="hustle.avgScoreOverall">
        <text class="score-value">{{ hustle.avgScoreOverall }}</text>
        <text class="score-label">综合评分</text>
      </view>
    </view>

    <view class="section">
      <text class="section-title">📋 基本信息</text>
      <view class="info-grid">
        <view class="info-item">
          <text class="info-label">入门门槛</text>
          <text class="info-value">{{ barrierLabel(hustle.entryBarrier) }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">收益潜力</text>
          <text class="info-value">{{ incomeLabel(hustle.incomePotential) }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">时间投入</text>
          <text class="info-value">{{ hustle.timeRequired || '信息待补充' }}</text>
        </view>
        <view class="info-item">
          <text class="info-label">评测数</text>
          <text class="info-value">{{ hustle.totalReviews || 0 }} 篇</text>
        </view>
      </view>
    </view>

    <view class="section">
      <text class="section-title">📖 简介</text>
      <text class="desc-text">{{ hustle.description || hustle.shortDesc }}</text>
    </view>

    <!-- 关联评测 -->
    <view class="section" v-if="hustle.reviews?.length">
      <text class="section-title">📊 相关评测 ({{ hustle.reviews.length }})</text>
      <view v-for="rv in hustle.reviews" :key="rv.id" class="review-link" @tap="goToReview(rv.slug)">
        <view class="review-info">
          <text class="review-title">{{ rv.title }}</text>
          <text class="review-score" :style="{ color: rv.scoreOverall >= 7 ? '#10b981' : '#f59e0b' }">
            {{ rv.scoreOverall }}分
          </text>
        </view>
        <text class="review-arrow">›</text>
      </view>
    </view>

    <!-- 空状态 -->
    <view class="empty" v-if="hustle.reviews?.length === 0">
      <text class="empty-text">暂无评测，去看看其他副业</text>
    </view>
  </view>
</template>

<style lang="scss">
.loading-page { display: flex; justify-content: center; align-items: center; height: 60vh; color: #999; font-size: 28rpx; }

.hustle-detail { padding-bottom: 40rpx; }

.header {
  display: flex;
  align-items: center;
  background: #fff;
  padding: 32rpx 24rpx;

  .header-icon { font-size: 72rpx; margin-right: 20rpx; }
  .header-info {
    flex: 1;
    .hustle-name { font-size: 36rpx; font-weight: 700; color: #1a1a1a; display: block; }
    .hustle-category { font-size: 24rpx; color: #07c160; margin-top: 6rpx; display: block; }
  }
  .header-score {
    display: flex; flex-direction: column; align-items: center;
    .score-value { font-size: 48rpx; font-weight: 800; color: #07c160; }
    .score-label { font-size: 20rpx; color: #999; }
  }
}

.section {
  background: #fff;
  margin-top: 16rpx;
  padding: 24rpx 20rpx;

  .section-title { font-size: 30rpx; font-weight: 600; color: #1a1a1a; display: block; margin-bottom: 16rpx; }

  .info-grid {
    display: flex; flex-wrap: wrap; gap: 16rpx;
    .info-item {
      width: calc(50% - 8rpx);
      .info-label { font-size: 24rpx; color: #999; display: block; }
      .info-value { font-size: 28rpx; color: #333; font-weight: 500; margin-top: 4rpx; display: block; }
    }
  }

  .desc-text { font-size: 28rpx; color: #555; line-height: 1.8; }

  .review-link {
    display: flex; align-items: center;
    padding: 20rpx 0; border-bottom: 1rpx solid #f0f0f0;
    &:last-child { border-bottom: none; }

    .review-info { flex: 1; display: flex; align-items: center; }
    .review-title { font-size: 28rpx; color: #333; flex: 1; }
    .review-score { font-size: 28rpx; font-weight: 600; margin-left: 12rpx; }
    .review-arrow { font-size: 32rpx; color: #ccc; margin-left: 12rpx; }
  }
}

.empty {
  text-align: center; padding: 60rpx 0;
  .empty-text { font-size: 26rpx; color: #ccc; }
}
</style>
