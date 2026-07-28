<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { userApi } from '@/api/user'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()

const history = ref<any[]>([])
const loading = ref(true)
const activeTab = ref('ALL')

const tabs = [
  { key: 'ALL', label: '全部', icon: '📌' },
  { key: 'REVIEW', label: '评测', icon: '📊' },
  { key: 'ARTICLE', label: '资讯', icon: '📰' },
  { key: 'HUSTLE', label: '副业', icon: '💼' },
]

onMounted(async () => {
  if (!userStore.isLoggedIn) {
    uni.showToast({ title: '请先登录', icon: 'none' })
    setTimeout(() => uni.navigateBack(), 1000)
    return
  }
  await loadHistory()
})

async function loadHistory() {
  loading.value = true
  try {
    const type = activeTab.value === 'ALL' ? undefined : activeTab.value
    const res = await userApi.getHistory(type)
    history.value = res.data || res || []
  } catch (err) {
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

function switchTab(key: string) {
  activeTab.value = key
  loadHistory()
}

function goToDetail(item: any) {
  const entityType = item.entityType || item.type
  if (entityType === 'REVIEW') {
    uni.navigateTo({ url: `/pages/subpkg-review/detail?slug=${item.slug || item.entityId}` })
  } else if (entityType === 'ARTICLE') {
    uni.navigateTo({ url: `/pages/subpkg-news/article-detail?id=${item.entityId || item.id}` })
  } else if (entityType === 'HUSTLE') {
    uni.navigateTo({ url: `/pages/subpkg-hustle/detail?slug=${item.slug || item.entityId}` })
  } else {
    uni.navigateTo({ url: `/pages/subpkg-review/detail?slug=${item.slug || item.entityId}` })
  }
}

function iconForType(type: string): string {
  const map: Record<string, string> = {
    REVIEW: '📊', ARTICLE: '📰', HUSTLE: '💼',
  }
  return map[type] || '📌'
}

async function clearHistory() {
  uni.showModal({
    title: '确认清除',
    content: '确定要清除所有浏览记录吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await userApi.clearHistory()
          history.value = []
          uni.showToast({ title: '已清除' })
        } catch {
          uni.showToast({ title: '清除失败', icon: 'none' })
        }
      }
    },
  })
}

function formatDate(date: string): string {
  if (!date) return ''
  return date.slice(0, 10)
}
</script>

<template>
  <view class="history-page">
    <!-- 分类标签 -->
    <scroll-view class="type-tabs" scroll-x show-scrollbar="false">
      <view v-for="tab in tabs" :key="tab.key"
        :class="['tab', { active: activeTab === tab.key }]"
        @tap="switchTab(tab.key)">
        <text>{{ tab.icon }}</text>
        <text>{{ tab.label }}</text>
      </view>
    </scroll-view>

    <!-- 清空按钮 -->
    <view class="toolbar" v-if="history.length > 0">
      <text class="clear-btn" @tap="clearHistory">🗑 清空记录</text>
    </view>

    <!-- 浏览记录列表 -->
    <view class="history-list">
      <view v-for="item in history" :key="item.id" class="history-item" @tap="goToDetail(item)">
        <view class="his-icon">{{ iconForType(item.entityType || item.type) }}</view>
        <view class="his-body">
          <text class="his-title">{{ item.title || item.name }}</text>
          <text class="his-summary" v-if="item.summary">{{ item.summary }}</text>
          <view class="his-meta">
            <text class="his-type">{{ item.entityType || item.type }}</text>
            <text class="his-date">{{ formatDate(item.createdAt || item.viewedAt) }}</text>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <view v-if="!loading && history.length === 0" class="empty-state">
        <text class="empty-icon">📖</text>
        <text class="empty-text">暂无浏览记录</text>
        <text class="empty-hint">去浏览一些内容吧</text>
      </view>

      <view v-if="loading" class="loading-bar">
        <text>加载中...</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss">
.history-page {
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

.toolbar {
  display: flex;
  justify-content: flex-end;
  padding: 16rpx 20rpx 0;

  .clear-btn {
    font-size: 24rpx;
    color: #999;
    padding: 8rpx 20rpx;
    background: #fff;
    border-radius: 20rpx;
  }
}

.history-list {
  padding: 0 20rpx 40rpx;

  .history-item {
    display: flex;
    align-items: center;
    background: #fff;
    margin-top: 16rpx;
    padding: 20rpx;
    border-radius: 16rpx;

    .his-icon {
      font-size: 40rpx;
      margin-right: 16rpx;
    }

    .his-body {
      flex: 1;

      .his-title {
        font-size: 28rpx;
        font-weight: 500;
        color: #333;
        lines: 1;
      }

      .his-summary {
        font-size: 24rpx;
        color: #999;
        margin-top: 6rpx;
        lines: 2;
        display: block;
      }

      .his-meta {
        display: flex;
        gap: 16rpx;
        margin-top: 8rpx;
        font-size: 22rpx;
        color: #bbb;

        .his-type {
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
