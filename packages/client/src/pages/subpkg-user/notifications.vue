<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { userApi } from '@/api/user'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()

const notifications = ref<any[]>([])
const loading = ref(true)

const typeIcons: Record<string, string> = {
  SYSTEM: '🔔',
  COMMENT_REPLY: '💬',
  POST_LIKE: '👍',
  POST_COMMENT: '💬',
  REVIEW_UPDATE: '📊',
  SCAM_ALERT: '🚨',
  NEW_FEATURE: '✨',
}

const typeLabels: Record<string, string> = {
  SYSTEM: '系统通知',
  COMMENT_REPLY: '回复了我的评论',
  POST_LIKE: '赞了我的帖子',
  POST_COMMENT: '评论了我的帖子',
  REVIEW_UPDATE: '评测更新',
  SCAM_ALERT: '避坑提醒',
  NEW_FEATURE: '新功能',
}

onMounted(async () => {
  if (!userStore.isLoggedIn) {
    uni.showToast({ title: '请先登录', icon: 'none' })
    setTimeout(() => uni.navigateBack(), 1000)
    return
  }
  await loadNotifications()
})

async function loadNotifications() {
  loading.value = true
  try {
    const res = await userApi.getNotifications()
    notifications.value = res.data || res || []
  } catch (err) {
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

async function markRead(id: string) {
  try {
    await userApi.markNotificationRead(id)
    const notif = notifications.value.find(n => n.id === id)
    if (notif) notif.isRead = true
  } catch {}
}

async function markAllRead() {
  try {
    await userApi.markAllNotificationsRead()
    notifications.value.forEach(n => { n.isRead = true })
    uni.showToast({ title: '已全部标记已读' })
  } catch {
    uni.showToast({ title: '操作失败', icon: 'none' })
  }
}

function handleTap(notif: any) {
  if (!notif.isRead) markRead(notif.id)
  if (notif.entityType && notif.entityId) {
    if (notif.entityType === 'REVIEW') {
      uni.navigateTo({ url: `/pages/subpkg-review/detail?slug=${notif.entityId}` })
    } else if (notif.entityType === 'POST' || notif.entityType === 'COMMENT') {
      uni.navigateTo({ url: `/pages/subpkg-community/post-detail?id=${notif.entityId}` })
    } else if (notif.entityType === 'ARTICLE') {
      uni.navigateTo({ url: `/pages/subpkg-news/article-detail?id=${notif.entityId}` })
    } else if (notif.entityType === 'SCAM') {
      uni.navigateTo({ url: `/pages/subpkg-scam/detail?id=${notif.entityId}` })
    }
  }
}

function formatDate(date: string): string {
  if (!date) return ''
  const d = new Date(date)
  const now = new Date()
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000)
  if (diff < 60) return '刚刚'
  if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`
  if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`
  if (diff < 2592000) return `${Math.floor(diff / 86400)}天前`
  return date.slice(0, 10)
}
</script>

<template>
  <view class="notifications-page">
    <view class="toolbar" v-if="notifications.length > 0">
      <text class="mark-all-btn" @tap="markAllRead">全部标为已读</text>
    </view>

    <view class="notif-list">
      <view v-for="notif in notifications" :key="notif.id"
        :class="['notif-item', { unread: !notif.isRead }]"
        @tap="handleTap(notif)">

        <view class="notif-icon" :class="{ unread: !notif.isRead }">
          <text>{{ typeIcons[notif.type] || '🔔' }}</text>
        </view>

        <view class="notif-body">
          <view class="notif-header">
            <text class="notif-type">{{ typeLabels[notif.type] || notif.type }}</text>
            <text class="notif-date">{{ formatDate(notif.createdAt) }}</text>
          </view>
          <text class="notif-title">{{ notif.title }}</text>
          <text class="notif-content" v-if="notif.body">{{ notif.body }}</text>
        </view>

        <view class="notif-dot" v-if="!notif.isRead"></view>
      </view>

      <view v-if="!loading && notifications.length === 0" class="empty-state">
        <text class="empty-icon">🔔</text>
        <text class="empty-text">暂无消息通知</text>
        <text class="empty-hint">当有人回复或点赞时，你会收到通知</text>
      </view>

      <view v-if="loading" class="loading-bar">
        <text>加载中...</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss">
.notifications-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.toolbar {
  display: flex;
  justify-content: flex-end;
  padding: 16rpx 20rpx 0;

  .mark-all-btn {
    font-size: 24rpx;
    color: #07c160;
    padding: 8rpx 20rpx;
    background: #fff;
    border-radius: 20rpx;
  }
}

.notif-list {
  padding: 0 20rpx 40rpx;

  .notif-item {
    display: flex;
    background: #fff;
    margin-top: 16rpx;
    padding: 24rpx 20rpx;
    border-radius: 16rpx;
    position: relative;

    &.unread {
      background: #fafdfa;
    }

    .notif-icon {
      width: 64rpx;
      height: 64rpx;
      border-radius: 50%;
      background: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32rpx;
      flex-shrink: 0;

      &.unread {
        background: #f0fdf4;
      }
    }

    .notif-body {
      flex: 1;
      margin-left: 16rpx;

      .notif-header {
        display: flex;
        align-items: center;

        .notif-type {
          font-size: 22rpx;
          color: #07c160;
          background: #f0fdf4;
          padding: 2rpx 12rpx;
          border-radius: 12rpx;
        }

        .notif-date {
          font-size: 20rpx;
          color: #bbb;
          margin-left: auto;
        }
      }

      .notif-title {
        display: block;
        font-size: 28rpx;
        font-weight: 500;
        color: #333;
        margin-top: 8rpx;
      }

      .notif-content {
        display: block;
        font-size: 24rpx;
        color: #999;
        margin-top: 6rpx;
        lines: 2;
      }
    }

    .notif-dot {
      position: absolute;
      top: 24rpx;
      right: 16rpx;
      width: 14rpx;
      height: 14rpx;
      border-radius: 50%;
      background: #07c160;
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
