<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { articleApi } from '@/api/article'

const tools = ref<any[]>([])
const loading = ref(true)
const activeCategory = ref('')
const showFreeOnly = ref(false)

const categories = [
  { key: '', label: '全部' },
  { key: 'design', label: '设计' },
  { key: 'writing', label: '写作' },
  { key: 'video', label: '视频' },
  { key: 'marketing', label: '营销' },
  { key: 'productivity', label: '效率' },
]

async function load() {
  loading.value = true
  try {
    const params: any = {}
    if (activeCategory.value) params.category = activeCategory.value
    if (showFreeOnly.value) params.isFree = 'true'
    // Use a placeholder - tools are fetched from a different endpoint
    const res = await articleApi.list({ pageSize: 50 })
    tools.value = res.data?.data || res.data || []
  } catch {
    tools.value = []
  } finally {
    loading.value = false
  }
}

function switchCategory(key: string) {
  activeCategory.value = key
  load()
}

onMounted(() => load())
</script>

<template>
  <view class="tools-page">
    <view class="filter-bar">
      <scroll-view class="category-scroll" scroll-x show-scrollbar="false">
        <view v-for="cat in categories" :key="cat.key"
          :class="['cat-tab', { active: activeCategory === cat.key }]"
          @tap="switchCategory(cat.key)">
          {{ cat.label }}
        </view>
      </scroll-view>
      <view class="free-toggle">
        <text class="toggle-label">仅看免费</text>
        <switch :checked="showFreeOnly" @change="showFreeOnly = !showFreeOnly; load()" color="#07c160" />
      </view>
    </view>

    <view class="tool-list">
      <view v-for="item in tools" :key="item.id" class="tool-card">
        <view class="tool-header">
          <text class="tool-icon">{{ item.logoUrl ? '🛠️' : '🔧' }}</text>
          <view class="tool-info">
            <text class="tool-name">{{ item.title || item.name }}</text>
            <text class="tool-category">{{ item.articleType || '通用' }}</text>
          </view>
          <text class="tool-price" :class="{ free: item.isFree }">
            {{ item.isFree ? '免费' : (item.price || '付费') }}
          </text>
        </view>
        <text class="tool-desc">{{ item.summary || item.description }}</text>
        <view class="tool-footer">
          <text class="tool-rating" v-if="item.viewCount">⭐ {{ item.viewCount }}人推荐</text>
          <text class="tool-link" v-if="item.id" @tap="uni.navigateTo({ url: `/pages/subpkg-news/article-detail?id=${item.id}` })">查看详情 ›</text>
        </view>
      </view>
    </view>

    <view v-if="!loading && tools.length === 0" class="empty">暂无工具推荐</view>
  </view>
</template>

<style lang="scss">
.tools-page { min-height: 100vh; }

.filter-bar {
  background: #fff; padding: 16rpx 20rpx;
  .category-scroll { white-space: nowrap; margin-bottom: 12rpx; }
  .cat-tab {
    display: inline-block; padding: 8rpx 24rpx; margin-right: 12rpx;
    font-size: 24rpx; color: #666; border-radius: 30rpx; background: #f5f5f5;
    &.active { background: #07c160; color: #fff; }
  }
  .free-toggle { display: flex; align-items: center; gap: 8rpx; }
  .toggle-label { font-size: 24rpx; color: #666; }
}

.tool-list { padding: 0 20rpx; }
.tool-card {
  background: #fff; margin-top: 16rpx; padding: 24rpx; border-radius: 16rpx;
  .tool-header { display: flex; align-items: center; }
  .tool-icon { font-size: 40rpx; margin-right: 16rpx; }
  .tool-info { flex: 1; }
  .tool-name { font-size: 30rpx; font-weight: 600; color: #1a1a1a; display: block; }
  .tool-category { font-size: 22rpx; color: #999; margin-top: 4rpx; display: block; }
  .tool-price {
    padding: 4rpx 16rpx; border-radius: 20rpx; font-size: 22rpx; font-weight: 500;
    background: #fef3c7; color: #92400e;
    &.free { background: #f0fdf4; color: #07c160; }
  }
  .tool-desc { font-size: 26rpx; color: #666; margin-top: 12rpx; display: block; }
  .tool-footer {
    display: flex; justify-content: space-between; margin-top: 16rpx;
    .tool-rating { font-size: 22rpx; color: #f59e0b; }
    .tool-link { font-size: 24rpx; color: #07c160; }
  }
}
.empty { text-align: center; padding: 60rpx; color: #ccc; font-size: 26rpx; }
</style>
