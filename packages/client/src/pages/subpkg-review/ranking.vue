<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { reviewApi } from '@/api/review'

const activeDimension = ref('overall')
const rankings = ref<any[]>([])
const loading = ref(true)

const dimensions = [
  { key: 'overall', label: '综合评分', color: '#07c160' },
  { key: 'earnings', label: '收益最高', color: '#f59e0b' },
  { key: 'risk', label: '风险最低', color: '#3b82f6' },
  { key: 'difficulty', label: '上手最易', color: '#8b5cf6' },
  { key: 'compliance', label: '最合规', color: '#10b981' },
]

async function loadRanking() {
  loading.value = true
  try {
    const res = await reviewApi.ranking(activeDimension.value, 30)
    rankings.value = res.data || res || []
  } catch {} finally { loading.value = false }
}

function switchDim(key: string) {
  activeDimension.value = key
  loadRanking()
}

function goToDetail(slug: string) {
  uni.navigateTo({ url: `/pages/subpkg-review/detail?slug=${slug}` })
}

onMounted(() => loadRanking())
</script>

<template>
  <view class="ranking-page">
    <view class="dimension-tabs">
      <view v-for="dim in dimensions" :key="dim.key" :class="['dim-tab', { active: activeDimension === dim.key }]"
        :style="activeDimension === dim.key ? { background: dim.color, borderColor: dim.color } : {}"
        @tap="switchDim(dim.key)">
        {{ dim.label }}
      </view>
    </view>

    <view class="ranking-list">
      <view v-for="(item, idx) in rankings" :key="item.id" class="rank-item" @tap="goToDetail(item.slug)">
        <text :class="['rank-number', { gold: idx === 0, silver: idx === 1, bronze: idx === 2 }]">{{ idx + 1 }}</text>
        <image v-if="item.coverImage" :src="item.coverImage" class="rank-cover" mode="aspectFill" />
        <view class="rank-body">
          <text class="rank-title">{{ item.title }}</text>
          <view class="rank-stats">
            <text class="rank-score">{{ item.scoreOverall }}分</text>
            <text>{{ item.viewCount }} 阅读</text>
            <text>{{ item.reviewCount }} 评价</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss">
.ranking-page {
  .dimension-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 12rpx;
    padding: 20rpx;
    background: #fff;

    .dim-tab {
      padding: 8rpx 24rpx;
      font-size: 24rpx;
      color: #666;
      border: 1rpx solid #e5e7eb;
      border-radius: 30rpx;

      &.active { color: #fff; border-color: #07c160; }
    }
  }

  .ranking-list {
    padding: 0 20rpx;

    .rank-item {
      display: flex;
      align-items: center;
      background: #fff;
      margin-top: 16rpx;
      padding: 20rpx;
      border-radius: 16rpx;

      .rank-number {
        width: 48rpx;
        font-size: 32rpx;
        font-weight: 800;
        color: #ccc;
        text-align: center;

        &.gold { color: #f59e0b; }
        &.silver { color: #94a3b8; }
        &.bronze { color: #d97706; }
      }

      .rank-cover {
        width: 100rpx;
        height: 100rpx;
        border-radius: 12rpx;
        margin: 0 16rpx;
      }

      .rank-body {
        flex: 1;

        .rank-title {
          font-size: 28rpx;
          font-weight: 500;
          color: #333;
        }

        .rank-stats {
          display: flex;
          gap: 16rpx;
          margin-top: 8rpx;
          font-size: 22rpx;
          color: #999;

          .rank-score { color: #07c160; font-weight: 600; }
        }
      }
    }
  }
}
</style>
