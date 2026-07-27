<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { communityApi } from '@/api/community'

const posts = ref<any[]>([])
const hotTags = ref<string[]>([])
const loading = ref(true)
const activeTab = ref('latest')
const page = ref(1)

async function loadPosts(reset = false) {
  if (reset) page.value = 1
  loading.value = true
  try {
    const params: any = { page: page.value, pageSize: 20 }
    if (activeTab.value === 'hot') params.sortBy = 'hot'
    const res = await communityApi.listPosts(params)
    posts.value = reset ? (res.data || []) : [...posts.value, ...(res.data || [])]
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

async function loadTags() {
  try {
    const res = await communityApi.hotTags()
    hotTags.value = res.data || res || []
  } catch {}
}

function switchTab(key: string) {
  activeTab.value = key
  loadPosts(true)
}

function goToPost(id: string) {
  uni.navigateTo({ url: `/pages/subpkg-community/post-detail?id=${id}` })
}

function goCreate() {
  uni.navigateTo({ url: '/pages/subpkg-community/create-post' })
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

onMounted(() => { loadPosts(true); loadTags() })
</script>

<template>
  <view class="community-page">
    <view class="tabs">
      <view :class="['tab', { active: activeTab === 'latest' }]" @tap="switchTab('latest')">最新</view>
      <view :class="['tab', { active: activeTab === 'hot' }]" @tap="switchTab('hot')">热门</view>
    </view>

    <view class="hot-tags" v-if="hotTags.length > 0">
      <text v-for="tag in hotTags" :key="tag" class="hot-tag">{{ tag }}</text>
    </view>

    <view class="post-list">
      <view v-for="post in posts" :key="post.id" class="post-card" @tap="goToPost(post.id)">
        <view class="post-header">
          <image class="post-avatar" :src="post.author?.avatarUrl || '/static/default-avatar.png'" mode="aspectFill" />
          <text class="post-author">{{ post.author?.nickname || '匿名用户' }}</text>
          <text class="post-type">{{ post.postType }}</text>
          <text class="post-date">{{ formatDate(post.createdAt) }}</text>
        </view>
        <text class="post-title">{{ post.title }}</text>
        <text class="post-content">{{ post.content }}</text>
        <view class="post-tags" v-if="post.tags?.length">
          <text v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</text>
        </view>
        <view class="post-stats">
          <text>👍 {{ post.likeCount }}</text>
          <text>💬 {{ post.commentCount }}</text>
          <text>👁 {{ post.viewCount }}</text>
        </view>
      </view>
    </view>

    <view class="fab" @tap="goCreate">+</view>
  </view>
</template>

<style lang="scss">
.community-page {
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

  .hot-tags {
    display: flex;
    padding: 12rpx 20rpx;
    overflow-x: auto;
    background: #fff;
    border-bottom: 1rpx solid #f0f0f0;

    .hot-tag {
      padding: 4rpx 16rpx;
      background: #f0fdf4;
      color: #07c160;
      font-size: 22rpx;
      border-radius: 20rpx;
      margin-right: 12rpx;
      white-space: nowrap;
    }
  }

  .post-list {
    padding: 0 20rpx;
  }

  .post-card {
    background: #fff;
    margin-top: 16rpx;
    border-radius: 16rpx;
    padding: 24rpx;

    .post-header {
      display: flex;
      align-items: center;

      .post-avatar {
        width: 48rpx;
        height: 48rpx;
        border-radius: 50%;
      }

      .post-author {
        font-size: 24rpx;
        color: #666;
        margin-left: 12rpx;
      }

      .post-type {
        font-size: 20rpx;
        color: #07c160;
        background: #f0fdf4;
        padding: 2rpx 12rpx;
        border-radius: 20rpx;
        margin-left: 12rpx;
      }

      .post-date {
        font-size: 20rpx;
        color: #bbb;
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

    .post-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8rpx;
      margin-top: 12rpx;

      .tag {
        padding: 2rpx 16rpx;
        background: #f5f5f5;
        color: #999;
        font-size: 20rpx;
        border-radius: 20rpx;
      }
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

  .fab {
    position: fixed;
    right: 30rpx;
    bottom: 120rpx;
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    background: #07c160;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48rpx;
    font-weight: 300;
    box-shadow: 0 4rpx 20rpx rgba(7, 193, 96, 0.4);
  }
}
</style>
