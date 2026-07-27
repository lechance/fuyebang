<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { articleApi } from '@/api/article'

const articles = ref<any[]>([])
const loading = ref(true)
const activeTab = ref('all')
const page = ref(1)

const tabs = [
  { key: 'all', label: '全部' },
  { key: 'POLICY_UPDATE', label: '政策' },
  { key: 'SEASONAL_ANALYSIS', label: '季节性' },
  { key: 'MARKET_TREND', label: '行情' },
  { key: 'FAILURE_CASE', label: '踩坑' },
]

async function loadArticles(reset = false) {
  if (reset) { page.value = 1 }
  loading.value = true
  try {
    const params: any = { page: page.value, pageSize: 20 }
    if (activeTab.value !== 'all') params.type = activeTab.value
    const res = await articleApi.list(params)
    const list = res.data || []
    articles.value = reset ? list : [...articles.value, ...list]
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

function switchTab(key: string) {
  activeTab.value = key
  loadArticles(true)
}

function goToDetail(id: string) {
  uni.navigateTo({ url: `/pages/subpkg-news/article-detail?id=${id}` })
}

onMounted(() => loadArticles(true))
</script>

<template>
  <view class="news-page">
    <view class="tabs">
      <view v-for="tab in tabs" :key="tab.key" :class="['tab', { active: activeTab === tab.key }]" @tap="switchTab(tab.key)">
        {{ tab.label }}
      </view>
    </view>

    <view class="article-list">
      <view v-for="item in articles" :key="item.id" class="article-card" @tap="goToDetail(item.id)">
        <image v-if="item.coverImage" :src="item.coverImage" class="article-cover" mode="aspectFill" />
        <view class="article-body">
          <text class="article-title">{{ item.title }}</text>
          <text class="article-summary">{{ item.summary }}</text>
          <view class="article-meta">
            <text class="meta-type">{{ item.articleType }}</text>
            <text class="meta-views">{{ item.viewCount }} 阅读</text>
            <text class="meta-date">{{ item.publishedAt?.slice(0, 10) }}</text>
          </view>
        </view>
      </view>
    </view>

    <view v-if="loading" class="loading">加载中...</view>
  </view>
</template>

<style lang="scss">
.news-page {
  .tabs {
    display: flex;
    background: #fff;
    padding: 16rpx 20rpx;

    .tab {
      padding: 8rpx 24rpx;
      font-size: 26rpx;
      color: #666;
      border-radius: 30rpx;
      background: #f5f5f5;
      margin-right: 12rpx;
      white-space: nowrap;

      &.active {
        background: #07c160;
        color: #fff;
        font-weight: 500;
      }
    }
  }

  .article-list {
    padding: 0 20rpx;
  }

  .article-card {
    display: flex;
    background: #fff;
    margin-top: 16rpx;
    border-radius: 16rpx;
    overflow: hidden;
    padding: 20rpx;

    .article-cover {
      width: 200rpx;
      height: 150rpx;
      border-radius: 12rpx;
      flex-shrink: 0;
    }

    .article-body {
      flex: 1;
      margin-left: 16rpx;
      display: flex;
      flex-direction: column;

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
        font-size: 22rpx;
        color: #bbb;

        .meta-type {
          color: #07c160;
        }
      }
    }
  }

  .loading {
    text-align: center;
    padding: 30rpx;
    color: #999;
    font-size: 24rpx;
  }
}
</style>
