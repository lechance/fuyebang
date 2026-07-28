<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { articleApi } from '@/api/article'

const articles = ref<any[]>([])
const loading = ref(true)
const page = ref(1)
const hasMore = ref(true)

// 文章类型筛选
const articleTypes = [
  { key: '', label: '全部' },
  { key: 'POLICY_UPDATE', label: '政策更新' },
  { key: 'SEASONAL_ANALYSIS', label: '行业分析' },
  { key: 'MARKET_TREND', label: '市场趋势' },
  { key: 'FAILURE_CASE', label: '失败案例' },
  { key: 'SUCCESS_STORY', label: '成功故事' },
  { key: 'TOOL_REVIEW', label: '工具评测' },
  { key: 'OTHER', label: '其他' },
]

const activeType = ref('')
const sortBy = ref('newest')

const sortOptions = [
  { key: 'newest', label: '最新' },
  { key: 'views', label: '最热' },
  { key: 'trending', label: '趋势' },
]

onLoad((query) => {
  if (query?.type) {
    activeType.value = query.type
  }
  loadArticles(true)
})

async function loadArticles(reset = false) {
  if (reset) { page.value = 1; hasMore.value = true }
  if (!hasMore.value) return
  loading.value = true
  try {
    const params: any = { page: page.value, pageSize: 20, sortBy: sortBy.value }
    if (activeType.value) params.type = activeType.value
    const res = await articleApi.list(params)
    const list = res.data || res || []
    articles.value = reset ? list : [...articles.value, ...list]
    if (list.length < 20) hasMore.value = false
  } catch (err) {
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

function switchType(key: string) {
  activeType.value = key
  loadArticles(true)
}

function switchSort(key: string) {
  sortBy.value = key
  loadArticles(true)
}

function goToDetail(id: string) {
  uni.navigateTo({ url: `/pages/subpkg-news/article-detail?id=${id}` })
}

function formatDate(date: string): string {
  if (!date) return ''
  return date.slice(0, 10)
}

function typeLabel(type: string): string {
  const found = articleTypes.find(t => t.key === type)
  return found ? found.label : '其他'
}
</script>

<template>
  <view class="category-page">
    <!-- 类型标签 -->
    <scroll-view class="type-tabs" scroll-x show-scrollbar="false">
      <view v-for="t in articleTypes" :key="t.key"
        :class="['type-tab', { active: activeType === t.key }]"
        @tap="switchType(t.key)">
        {{ t.label }}
      </view>
    </scroll-view>

    <!-- 排序 -->
    <view class="sort-bar">
      <view v-for="s in sortOptions" :key="s.key"
        :class="['sort-btn', { active: sortBy === s.key }]"
        @tap="switchSort(s.key)">
        {{ s.label }}
      </view>
    </view>

    <!-- 文章列表 -->
    <view class="article-list">
      <view v-for="item in articles" :key="item.id" class="article-card" @tap="goToDetail(item.id)">
        <image v-if="item.coverImage" :src="item.coverImage" class="article-cover" mode="aspectFill" />
        <view class="article-body">
          <view class="article-type-tag">{{ typeLabel(item.articleType) }}</view>
          <text class="article-title">{{ item.title }}</text>
          <text class="article-summary">{{ item.summary }}</text>
          <view class="article-meta">
            <text class="meta-author">{{ item.authorName || '副业邦' }}</text>
            <text class="meta-views">{{ item.viewCount }} 阅读</text>
            <text class="meta-date">{{ formatDate(item.publishedAt) }}</text>
          </view>
        </view>
      </view>

      <!-- 加载更多 -->
      <view v-if="loading" class="loading-bar">
        <text>加载中...</text>
      </view>
      <view v-if="!hasMore && articles.length > 0" class="no-more">
        <text>没有更多了</text>
      </view>
      <view v-if="!loading && articles.length === 0" class="empty-state">
        <text class="empty-icon">📰</text>
        <text class="empty-text">暂无相关文章</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss">
.category-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.type-tabs {
  display: flex;
  white-space: nowrap;
  background: #fff;
  padding: 16rpx 20rpx;

  .type-tab {
    display: inline-block;
    padding: 8rpx 28rpx;
    font-size: 26rpx;
    color: #666;
    background: #f5f5f5;
    border-radius: 30rpx;
    margin-right: 16rpx;

    &.active {
      background: #07c160;
      color: #fff;
      font-weight: 500;
    }
  }
}

.sort-bar {
  display: flex;
  background: #fff;
  padding: 0 20rpx 16rpx;
  gap: 24rpx;

  .sort-btn {
    font-size: 24rpx;
    color: #999;

    &.active {
      color: #07c160;
      font-weight: 500;
    }
  }
}

.article-list {
  padding: 0 20rpx 40rpx;

  .article-card {
    display: flex;
    background: #fff;
    margin-top: 16rpx;
    border-radius: 16rpx;
    padding: 20rpx;

    .article-cover {
      width: 200rpx;
      height: 160rpx;
      border-radius: 12rpx;
      flex-shrink: 0;
      margin-right: 16rpx;
    }
  }

  .article-body {
    flex: 1;
    display: flex;
    flex-direction: column;

    .article-type-tag {
      display: inline-block;
      align-self: flex-start;
      padding: 2rpx 14rpx;
      background: #eef2ff;
      color: #4f46e5;
      font-size: 20rpx;
      border-radius: 20rpx;
      margin-bottom: 8rpx;
    }

    .article-title {
      font-size: 28rpx;
      font-weight: 600;
      color: #1a1a1a;
      lines: 2;
    }

    .article-summary {
      font-size: 24rpx;
      color: #999;
      margin-top: 8rpx;
      lines: 2;
    }

    .article-meta {
      display: flex;
      gap: 16rpx;
      margin-top: auto;
      padding-top: 12rpx;
      font-size: 22rpx;
      color: #bbb;
    }
  }

  .loading-bar {
    text-align: center;
    padding: 30rpx;
    color: #999;
    font-size: 26rpx;
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

    .empty-icon {
      font-size: 80rpx;
    }
    .empty-text {
      font-size: 28rpx;
      color: #999;
      margin-top: 20rpx;
    }
  }
}
</style>
