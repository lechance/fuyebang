<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { articleApi } from '@/api/article'
import { useUserStore } from '@/store/user'
import { userApi } from '@/api/user'

const articleId = ref('')
const article = ref<any>(null)
const related = ref<any[]>([])
const loading = ref(true)
const isFavorited = ref(false)
const userStore = useUserStore()

const typeLabels: Record<string, string> = {
  POLICY_UPDATE: '政策解读', SEASONAL_ANALYSIS: '季节性分析', MARKET_TREND: '市场行情',
  FAILURE_CASE: '失败案例', SUCCESS_STORY: '成功案例', TOOL_REVIEW: '工具评测', OTHER: '其他',
}

onLoad((query) => {
  if (query?.id) { articleId.value = query.id; loadDetail() }
})

async function loadDetail() {
  loading.value = true
  try {
    const [detailRes, relatedRes] = await Promise.all([
      articleApi.getById(articleId.value),
      articleApi.related(articleId.value, 4).catch(() => ({ data: [] })),
    ])
    article.value = detailRes.data || detailRes
    related.value = relatedRes.data || relatedRes || []
  } catch {
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

function goToRelated(id: string) {
  uni.redirectTo({ url: `/pages/subpkg-news/article-detail?id=${id}` })
}

function toggleFavorite() {
  if (!userStore.isLoggedIn) {
    uni.showToast({ title: '请先登录', icon: 'none' })
    return
  }
  isFavorited.value = !isFavorited.value
  if (isFavorited.value) {
    userApi.addFavorite('ARTICLE', articleId.value).catch(() => { isFavorited.value = false })
  } else {
    userApi.removeFavorite('ARTICLE', articleId.value).catch(() => { isFavorited.value = true })
  }
}

function onShare() {
  uni.share({
    provider: 'weixin',
    title: article.value?.title || '分享文章',
    scene: 'timeline',
  })
}

function formatDate(date: string): string {
  if (!date) return ''
  return date.slice(0, 10)
}
</script>

<template>
  <view v-if="loading" class="loading-page">加载中...</view>

  <view v-else-if="article" class="article-detail">
    <!-- 封面 -->
    <image v-if="article.coverImage" :src="article.coverImage" class="cover-img" mode="aspectFill" />
    <view class="cover-placeholder" v-else>
      <text class="cover-type">{{ typeLabels[article.articleType] || '资讯' }}</text>
    </view>

    <!-- 标题 -->
    <view class="title-section">
      <text class="article-title">{{ article.title }}</text>
      <view class="article-meta">
        <text class="meta-author">{{ article.authorName }}</text>
        <text class="meta-type">{{ typeLabels[article.articleType] || article.articleType }}</text>
        <text class="meta-date">{{ formatDate(article.publishedAt || article.createdAt) }}</text>
        <text class="meta-views">{{ article.viewCount }} 阅读</text>
      </view>
    </view>

    <!-- 摘要 -->
    <view class="summary-section" v-if="article.summary">
      <text class="summary-text">{{ article.summary }}</text>
    </view>

    <!-- 正文 -->
    <view class="content-section">
      <rich-text class="article-content" :nodes="article.content"></rich-text>
    </view>

    <!-- 操作栏 -->
    <view class="action-bar">
      <view class="action-item" @tap="toggleFavorite">
        <text :class="['action-icon', { active: isFavorited }]">{{ isFavorited ? '❤️' : '🤍' }}</text>
        <text class="action-label">{{ isFavorited ? '已收藏' : '收藏' }}</text>
      </view>
      <view class="action-item" @tap="onShare">
        <text class="action-icon">📤</text>
        <text class="action-label">分享</text>
      </view>
    </view>

    <!-- 相关文章 -->
    <view class="related-section" v-if="related.length > 0">
      <text class="related-title">📌 相关文章</text>
      <view v-for="item in related" :key="item.id" class="related-card" @tap="goToRelated(item.id)">
        <image v-if="item.coverImage" :src="item.coverImage" class="related-cover" mode="aspectFill" />
        <view class="related-body">
          <text class="related-name">{{ item.title }}</text>
          <text class="related-meta">{{ formatDate(item.publishedAt || item.createdAt) }} · {{ item.viewCount }}阅读</text>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss">
.loading-page { display: flex; justify-content: center; align-items: center; height: 60vh; color: #999; }

.article-detail { padding-bottom: 40rpx; }

.cover-img { width: 100%; height: 400rpx; }
.cover-placeholder {
  width: 100%; height: 300rpx;
  display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  .cover-type { color: #fff; font-size: 36rpx; font-weight: 700; }
}

.title-section {
  padding: 24rpx 20rpx; background: #fff;
  .article-title { font-size: 38rpx; font-weight: 700; color: #1a1a1a; line-height: 1.4; }
  .article-meta {
    display: flex; gap: 16rpx; margin-top: 16rpx; font-size: 24rpx; color: #999;
    .meta-type { color: #3b82f6; }
  }
}

.summary-section {
  background: #f8f9fa; margin: 0 20rpx; padding: 20rpx; border-radius: 12rpx;
  .summary-text { font-size: 26rpx; color: #666; line-height: 1.6; }
}

.content-section {
  background: #fff; margin-top: 16rpx; padding: 24rpx 20rpx;
  .article-content {
    font-size: 28rpx; color: #444; line-height: 1.9;
  }
}

.action-bar {
  display: flex; justify-content: space-around;
  background: #fff; margin-top: 16rpx; padding: 20rpx 0;
  border-top: 1rpx solid #f0f0f0; border-bottom: 1rpx solid #f0f0f0;
  .action-item {
    display: flex; flex-direction: column; align-items: center;
    .action-icon { font-size: 40rpx; &.active { transform: scale(1.1); } }
    .action-label { font-size: 22rpx; color: #999; margin-top: 6rpx; }
  }
}

.related-section {
  background: #fff; margin-top: 16rpx; padding: 24rpx 20rpx;
  .related-title { font-size: 30rpx; font-weight: 600; color: #1a1a1a; display: block; margin-bottom: 16rpx; }
  .related-card {
    display: flex; padding: 16rpx 0; border-bottom: 1rpx solid #f0f0f0;
    &:last-child { border-bottom: none; }
    .related-cover { width: 160rpx; height: 120rpx; border-radius: 12rpx; flex-shrink: 0; }
    .related-body {
      flex: 1; margin-left: 16rpx;
      .related-name { font-size: 28rpx; font-weight: 500; color: #333; lines: 2; display: block; }
      .related-meta { font-size: 22rpx; color: #bbb; margin-top: 8rpx; display: block; }
    }
  }
}
</style>
