<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { communityApi } from '@/api/community'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()

const posts = ref<any[]>([])
const loading = ref(true)
const activeTab = ref('latest')
const page = ref(1)
const hasMore = ref(true)

onMounted(async () => {
  if (!userStore.isLoggedIn) {
    uni.showToast({ title: '请先登录', icon: 'none' })
    setTimeout(() => uni.navigateBack(), 1000)
    return
  }
  await loadPosts(true)
})

async function loadPosts(reset = false) {
  if (reset) { page.value = 1; hasMore.value = true }
  if (!hasMore.value) return
  loading.value = true
  try {
    const params: any = {
      page: page.value,
      pageSize: 20,
      authorId: userStore.userInfo?.id,
    }
    if (activeTab.value === 'hot') params.sortBy = 'hot'
    const res = await communityApi.listPosts(params)
    const list = res.data || []
    posts.value = reset ? list : [...posts.value, ...list]
    if (list.length < 20) hasMore.value = false
  } catch (err) {
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

function switchTab(key: string) {
  activeTab.value = key
  loadPosts(true)
}

function goToPost(id: string) {
  uni.navigateTo({ url: `/pages/subpkg-community/post-detail?id=${id}` })
}

async function deletePost(id: string) {
  uni.showModal({
    title: '确认删除',
    content: '确定要删除这个帖子吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          await communityApi.deletePost(id)
          posts.value = posts.value.filter(p => p.id !== id)
          uni.showToast({ title: '已删除' })
        } catch {
          uni.showToast({ title: '删除失败', icon: 'none' })
        }
      }
    },
  })
}

function formatDate(date: string): string {
  if (!date) return ''
  const d = new Date(date)
  const now = new Date()
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000)
  if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`
  if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`
  return date.slice(0, 10)
}

const postTypeLabels: Record<string, string> = {
  EXPERIENCE_SHARING: '经验分享',
  QUESTION: '求助问答',
  DISCUSSION: '讨论交流',
  RESOURCE_SHARING: '资源分享',
  WARNING: '避坑提醒',
}
</script>

<template>
  <view class="my-posts-page">
    <view class="tabs">
      <view :class="['tab', { active: activeTab === 'latest' }]" @tap="switchTab('latest')">最新</view>
      <view :class="['tab', { active: activeTab === 'hot' }]" @tap="switchTab('hot')">最热</view>
    </view>

    <view class="post-list">
      <view v-for="post in posts" :key="post.id" class="post-card" @tap="goToPost(post.id)">
        <view class="post-header">
          <text class="post-type">{{ postTypeLabels[post.postType] || post.postType }}</text>
          <text class="post-date">{{ formatDate(post.createdAt) }}</text>
          <text class="delete-btn" @tap.stop="deletePost(post.id)">🗑 删除</text>
        </view>
        <text class="post-title">{{ post.title }}</text>
        <text class="post-content">{{ post.content }}</text>
        <view class="post-stats">
          <text>👍 {{ post.likeCount }}</text>
          <text>💬 {{ post.commentCount }}</text>
          <text>👁 {{ post.viewCount }}</text>
        </view>
      </view>

      <view v-if="!loading && posts.length === 0" class="empty-state">
        <text class="empty-icon">📝</text>
        <text class="empty-text">还没有发布过帖子</text>
        <text class="empty-hint">去社区分享你的经验吧</text>
      </view>

      <view v-if="loading" class="loading-bar">
        <text>加载中...</text>
      </view>

      <view v-if="!hasMore && posts.length > 0" class="no-more">
        <text>没有更多了</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss">
.my-posts-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.tabs {
  display: flex;
  background: #fff;
  padding: 16rpx 20rpx;

  .tab {
    padding: 8rpx 32rpx;
    font-size: 28rpx;
    color: #666;
    margin-right: 16rpx;
    border-radius: 30rpx;
    background: #f5f5f5;

    &.active {
      background: #07c160;
      color: #fff;
      font-weight: 500;
    }
  }
}

.post-list {
  padding: 0 20rpx 40rpx;

  .post-card {
    background: #fff;
    margin-top: 16rpx;
    border-radius: 16rpx;
    padding: 24rpx;

    .post-header {
      display: flex;
      align-items: center;

      .post-type {
        font-size: 20rpx;
        color: #07c160;
        background: #f0fdf4;
        padding: 2rpx 12rpx;
        border-radius: 20rpx;
      }

      .post-date {
        font-size: 20rpx;
        color: #bbb;
        margin-left: 12rpx;
      }

      .delete-btn {
        font-size: 22rpx;
        color: #ef4444;
        margin-left: auto;
      }
    }

    .post-title {
      display: block;
      font-size: 30rpx;
      font-weight: 600;
      color: #1a1a1a;
      margin-top: 12rpx;
    }

    .post-content {
      display: block;
      font-size: 26rpx;
      color: #666;
      margin-top: 8rpx;
      lines: 3;
    }

    .post-stats {
      display: flex;
      gap: 24rpx;
      margin-top: 16rpx;
      padding-top: 16rpx;
      border-top: 1rpx solid #f0f0f0;
      font-size: 24rpx;
      color: #999;
    }
  }

  .loading-bar {
    text-align: center;
    padding: 30rpx;
    color: #999;
  }

  .no-more {
    text-align: center;
    padding: 30rpx;
    color: #ccc;
    font-size: 24rpx;
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
