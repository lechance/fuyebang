<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { articleApi } from '@/api/article'
import { GuideCategory } from '@fuyebang/shared'

const guides = ref<any[]>([])
const loading = ref(true)

const categories = [
  { key: 'BEGINNER', label: '新手入门', icon: '🌱' },
  { key: 'TOOL_RECOMMENDATION', label: '工具推荐', icon: '🛠️' },
  { key: 'FINANCIAL_PLANNING', label: '财务规划', icon: '💰' },
  { key: 'COMPLIANCE', label: '合规教育', icon: '⚖️' },
  { key: 'SKILL_IMPROVEMENT', label: '技能提升', icon: '📈' },
]

function goToDetail(id: string) {
  uni.navigateTo({ url: `/pages/subpkg-guide/detail?id=${id}` })
}

function goTools() {
  uni.navigateTo({ url: '/pages/subpkg-guide/tools' })
}

onMounted(async () => {
  try {
    const res = await articleApi.list({ pageSize: 20 })
    guides.value = res.data || []
  } catch {} finally { loading.value = false }
})
</script>

<template>
  <view class="guide-page">
    <view class="category-grid">
      <view v-for="cat in categories" :key="cat.key" class="cat-item">
        <text class="cat-icon">{{ cat.icon }}</text>
        <text class="cat-label">{{ cat.label }}</text>
      </view>
    </view>

    <view class="section">
      <view class="section-header">
        <text class="section-title">📚 创业指南</text>
        <text class="section-more" @tap="goTools">推荐工具 ›</text>
      </view>
      <view v-for="item in guides" :key="item.id" class="guide-card" @tap="goToDetail(item.id)">
        <image v-if="item.coverImage" :src="item.coverImage" class="guide-cover" mode="aspectFill" />
        <view class="guide-body">
          <text class="guide-title">{{ item.title }}</text>
          <text class="guide-summary">{{ item.summary }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss">
.guide-page {
  .category-grid {
    display: flex;
    background: #fff;
    padding: 20rpx;
    margin: 20rpx;
    border-radius: 16rpx;

    .cat-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 12rpx 0;

      .cat-icon { font-size: 40rpx; }
      .cat-label { font-size: 22rpx; color: #666; margin-top: 8rpx; }
    }
  }

  .section {
    background: #fff;
    margin: 0 20rpx;
    padding: 24rpx;
    border-radius: 16rpx;

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20rpx;

      .section-title { font-size: 32rpx; font-weight: 600; }
      .section-more { font-size: 26rpx; color: #07c160; }
    }

    .guide-card {
      display: flex;
      padding: 16rpx 0;
      border-bottom: 1rpx solid #f0f0f0;

      &:last-child { border-bottom: none; }

      .guide-cover { width: 160rpx; height: 120rpx; border-radius: 12rpx; flex-shrink: 0; }
      .guide-body {
        flex: 1;
        margin-left: 16rpx;
        display: flex;
        flex-direction: column;

        .guide-title { font-size: 28rpx; font-weight: 500; color: #333; }
        .guide-summary { font-size: 24rpx; color: #999; margin-top: 8rpx; lines: 2; }
      }
    }
  }
}
</style>
