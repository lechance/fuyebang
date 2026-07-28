<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { userApi } from '@/api/user'
import { useUserStore } from '@/store/user'
import { reviewApi } from '@/api/review'
import { articleApi } from '@/api/article'

const userStore = useUserStore()

const favorites = ref<any[]>([])
const loading = ref(true)
const activeTab = ref('ALL')

const tabs = [
  { key: 'ALL', label: '全部', icon: '📌' },
  { key: 'REVIEW', label: '评测', icon: '📊' },
  { key: 'ARTICLE', label: '资讯', icon: '📰' },
  { key: 'GUIDE', label: '指南', icon: '📖' },
  { key: 'HUSTLE', label: '副业', icon: '💼' },
  { key: 'POST', label: '帖子', icon: '💬' },
]

onMounted(async () => {
  if (!userStore.isLoggedIn) {
    uni.showToast({ title: '请先登录', icon: 'none' })
    setTimeout(() => uni.navigateBack(), 1000)
    return
  }
  await loadFavorites()
})

async function loadFavorites() {
  loading.value = true
  try {
    const type = activeTab.value === 'ALL' ? undefined : activeTab.value
    const res = await userApi.getFavorites(type)
    favorites.value = res.data || res || []
  } catch (err) {
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

function switchTab(key: string) {
  activeTab.value = key
  loadFavorites()
}

function goToDetail(item: any) {
  const entityType = item.entityType || item.type
  if (entityType === 'REVIEW') {
    uni.navigateTo({ url: `/pages/subpkg-review/detail?slug=${item.slug || item.entityId}` })
  } else if (entityType === 'ARTICLE') {
    uni.navigateTo({ url: `/pages/subpkg-news/article-detail?id=${item.entityId || item.id}` })
  } else if (entityType === 'GUIDE') {
    uni.navigateTo({ url: `/pages/subpkg-guide/detail?slug=${item.slug || item.entityId}` })
  } else if (entityType === 'HUSTLE') {
    uni.navigateTo({ url: `/pages/subpkg-hustle/detail?slug=${item.slug || item.entityId}` })
  } else if (entityType === 'POST') {
    uni.navigateTo({ url: `/pages/subpkg-community/post-detail?id=${item.entityId || item.id}` })
  }
}

function iconForType(type: string): string {
  const map: Record<string, string> = {
    REVIEW: '📊', ARTICLE: '📰', GUIDE: '📖', HUSTLE: '💼', POST: '💬',
  }
  return map[type] || '📌'
}

function formatDate(date: string): string {
  if (!date) return ''
  return date.slice(0, 10)
}
</script>

<template>
  <view class="favorites-page">
    <!-- 分类标签 -->
    <scroll-view class="type-tabs" scroll-x show-scrollbar="false">
      <view v-for="tab in tabs" :key="tab.key"
        :class="['tab', { active: activeTab === tab.key }]"
        @tap="switchTab(tab.key)">
        <text>{{ tab.icon }}</text>
        <text>{{ tab.label }}</text>
      </view>
    </scroll-view>

    <!-- 收藏列表 -->
    <view class="fav-list">
      <view v-for="item in favorites" :key="item.id || item.entityId" class="fav-item" @tap="goToDetail(item)">
        <view class="fav-icon">{{ iconForType(item.entityType || item.type) }}</view>
        <view class="fav-body">
          <text class="fav-title">{{ item.title || item.name }}</text>
          <text class="fav-summary" v-if="item.summary">{{ item.summary }}</text>
          <view class="fav-meta">
            <text class="fav-type">{{ item.entityType || item.type }}</text>
            <text class="fav-date">{{ formatDate(item.createdAt) }}</text>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <view v-if="!loading && favorites.length === 0" class="empty-state">
        <text class="empty-icon">❤️</text>
        <text class="empty-text">还没有收藏任何内容</text>
        <text class="empty-hint">去发现感兴趣的内容吧</text>
      </view>

      <view v-if="loading" class="loading-bar">
        <text>加载中...</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss">
.favorites-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.type-tabs {
  display: flex;
  white-space: nowrap;
  background: #fff;
  padding: 16rpx 20rpx;

  .tab {
    display: inline-flex;
    align-items: center;
    gap: 6rpx;
    padding: 8rpx 24rpx;
    font-size: 24rpx;
    color: #666;
    background: #f5f5f5;
    border-radius: 30rpx;
    margin-right: 16rpx;

    &.active {
      background: #f0fdf4;
      color: #07c160;
      font-weight: 500;
    }
  }
}

.fav-list {
  padding: 0 20rpx 40rpx;

  .fav-item {
    display: flex;
    align-items: center;
    background: #fff;
    margin-top: 16rpx;
    padding: 20rpx;
    border-radius: 16rpx;

    .fav-icon {
      font-size: 40rpx;
      margin-right: 16rpx;
    }

    .fav-body {
      flex: 1;

      .fav-title {
        font-size: 28rpx;
        font-weight: 500;
        color: #333;
        lines: 1;
      }

      .fav-summary {
        font-size: 24rpx;
        color: #999;
        margin-top: 6rpx;
        lines: 2;
        display: block;
      }

      .fav-meta {
        display: flex;
        gap: 16rpx;
        margin-top: 8rpx;
        font-size: 22rpx;
        color: #bbb;

        .fav-type {
          color: #07c160;
          background: #f0fdf4;
          padding: 0 12rpx;
          border-radius: 12rpx;
        }
      }
    }
  }

  .loading-bar {
    text-align: center;
    padding: 30rpx;
    color: #999;
    font-size: 26rpx;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 120rpx 0;

    .empty-icon { font-size: 80rpx; }
    .empty-text { font-size: 28rpx; color: #999; margin-top: 20rpx; }
    .empty-hint { font-size: 24rpx; color: #ccc; margin-top: 10rpx; }
  }
}
</style>
