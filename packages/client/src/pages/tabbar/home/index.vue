<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { homeApi } from '@/api/home'

const banners = ref<any[]>([])
const categories = ref<any[]>([])
const recommended = ref<any[]>([])
const newsFeed = ref<any[]>([])
const hotSearches = ref<string[]>([])

const loading = ref(true)

onMounted(async () => {
  try {
    const res = await homeApi.getHomeFeed()
    banners.value = res.data?.banners || []
    categories.value = res.data?.categories || []
    recommended.value = res.data?.recommended || []
    newsFeed.value = res.data?.latestNews || []
    hotSearches.value = (await homeApi.getHotSearches()).data || []
  } catch (err) {
    console.error('Failed to load home', err)
  } finally {
    loading.value = false
  }
})

function goSearch() {
  uni.navigateTo({ url: '/pages/subpkg-community/search' })
}

function goToReview(slug: string) {
  uni.navigateTo({ url: `/pages/subpkg-review/detail?slug=${slug}` })
}

function goToCategory(slug: string) {
  uni.switchTab({ url: '/pages/tabbar/review/index' })
}

function goToArticle(id: string) {
  uni.navigateTo({ url: `/pages/subpkg-news/article-detail?id=${id}` })
}

function goToHustle(slug: string) {
  uni.navigateTo({ url: `/pages/subpkg-hustle/detail?slug=${slug}` })
}

function goToScamList() {
  uni.navigateTo({ url: '/pages/subpkg-scam/list' })
}

/** Helper: 计算评分对应的颜色 */
function scoreColor(score: number): string {
  if (score >= 8) return '#10b981'
  if (score >= 6) return '#07c160'
  if (score >= 4) return '#f59e0b'
  return '#ef4444'
}
</script>

<template>
  <view class="home-page">
    <!-- 搜索框 -->
    <view class="search-bar" @tap="goSearch">
      <uni-icons type="search" size="18" color="#999"></uni-icons>
      <text class="search-placeholder">搜副业、搜资讯、搜避坑...</text>
    </view>

    <!-- Banner 轮播 -->
    <swiper class="banner-swiper" :indicator-dots="true" :autoplay="true" :interval="4000" :duration="500" circular>
      <swiper-item v-for="banner in banners" :key="banner.id">
        <image :src="banner.imageUrl" class="banner-img" mode="aspectFill" />
      </swiper-item>
      <swiper-item v-if="banners.length === 0">
        <view class="banner-placeholder">
          <text>最新副业风口 & 避坑指南</text>
        </view>
      </swiper-item>
    </swiper>

    <!-- 快捷分类导航 -->
    <view class="category-grid">
      <view v-for="cat in categories" :key="cat.id" class="category-item" @tap="goToCategory(cat.slug)">
        <view class="category-icon">{{ cat.icon || '📌' }}</view>
        <text class="category-name">{{ cat.name }}</text>
      </view>
    </view>

    <!-- 副业推荐 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">🔥 今日推荐副业</text>
        <text class="section-more" @tap="goToHustle('')">查看更多 ›</text>
      </view>
      <scroll-view class="recommend-scroll" scroll-x show-scrollbar="false">
        <view v-for="item in recommended" :key="item.id" class="recommend-card" @tap="goToReview(item.slug)">
          <image v-if="item.coverImage" :src="item.coverImage" class="card-cover" mode="aspectFill" />
          <view class="card-info">
            <text class="card-title">{{ item.title }}</text>
            <view class="card-tags">
              <text class="tag-score" :style="{ background: scoreColor(item.scoreOverall) }">{{ item.scoreOverall }}分</text>
              <text class="tag-cost" v-if="item.startupCost !== null">¥{{ item.startupCost }}</text>
              <text class="tag-difficulty">{{ item.difficulty === 'EASY' ? '简单' : item.difficulty === 'MEDIUM' ? '中等' : '较难' }}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- 行业快讯 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">📰 行业快讯</text>
        <text class="section-more" @tap="goToArticle('')">查看更多 ›</text>
      </view>
      <view v-for="item in newsFeed" :key="item.id" class="news-item" @tap="goToArticle(item.id)">
        <view class="news-content">
          <text class="news-title">{{ item.title }}</text>
          <text class="news-summary">{{ item.summary }}</text>
          <view class="news-meta">
            <text class="news-views">{{ item.viewCount }} 阅读</text>
            <text class="news-date">{{ item.publishedAt?.slice(0, 10) }}</text>
          </view>
        </view>
        <image v-if="item.coverImage" :src="item.coverImage" class="news-cover" mode="aspectFill" />
      </view>
    </view>

    <!-- 热点搜索 -->
    <view class="section hot-search">
      <view class="section-header">
        <text class="section-title">🔍 热门搜索</text>
      </view>
      <view class="search-tags">
        <text v-for="(term, idx) in hotSearches" :key="idx" class="hot-tag" @tap="goSearch">{{ term }}</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss">
.home-page {
  padding-bottom: 20rpx;
}

.search-bar {
  display: flex;
  align-items: center;
  margin: 16rpx 20rpx;
  padding: 20rpx 24rpx;
  background: #fff;
  border-radius: 40rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);

  .search-placeholder {
    margin-left: 12rpx;
    color: #999;
    font-size: 28rpx;
  }
}

.banner-swiper {
  height: 320rpx;
  margin: 0 20rpx;
  border-radius: 16rpx;
  overflow: hidden;

  .banner-img {
    width: 100%;
    height: 100%;
  }

  .banner-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    background: linear-gradient(135deg, #07c160, #10b981);
    color: #fff;
    font-size: 32rpx;
    font-weight: 600;
  }
}

.category-grid {
  display: flex;
  flex-wrap: wrap;
  padding: 20rpx;
  background: #fff;
  margin: 20rpx;
  border-radius: 16rpx;

  .category-item {
    width: 20%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16rpx 0;

    .category-icon {
      font-size: 48rpx;
      margin-bottom: 8rpx;
    }

    .category-name {
      font-size: 24rpx;
      color: #333;
    }
  }
}

.section {
  background: #fff;
  margin: 20rpx;
  padding: 24rpx;
  border-radius: 16rpx;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;

    .section-title {
      font-size: 32rpx;
      font-weight: 600;
      color: #1a1a1a;
    }

    .section-more {
      font-size: 26rpx;
      color: #999;
    }
  }
}

.recommend-scroll {
  white-space: nowrap;

  .recommend-card {
    display: inline-block;
    width: 240rpx;
    margin-right: 20rpx;
    border-radius: 12rpx;
    overflow: hidden;
    background: #f8f9fa;

    .card-cover {
      width: 240rpx;
      height: 160rpx;
    }

    .card-info {
      padding: 12rpx;

      .card-title {
        font-size: 26rpx;
        font-weight: 500;
        color: #333;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: block;
      }

      .card-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8rpx;
        margin-top: 8rpx;

        .tag-score {
          font-size: 20rpx;
          color: #fff;
          padding: 2rpx 10rpx;
          border-radius: 20rpx;
        }

        .tag-cost, .tag-difficulty {
          font-size: 20rpx;
          color: #999;
          background: #f0f0f0;
          padding: 2rpx 10rpx;
          border-radius: 20rpx;
        }
      }
    }
  }
}

.news-item {
  display: flex;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f0f0f0;

  &:last-child { border-bottom: none; }

  .news-content {
    flex: 1;
    display: flex;
    flex-direction: column;

    .news-title {
      font-size: 28rpx;
      font-weight: 500;
      color: #333;
      lines: 2;
    }

    .news-summary {
      font-size: 24rpx;
      color: #999;
      margin-top: 8rpx;
      lines: 2;
    }

    .news-meta {
      display: flex;
      gap: 20rpx;
      margin-top: 12rpx;
      font-size: 22rpx;
      color: #bbb;
    }
  }

  .news-cover {
    width: 180rpx;
    height: 140rpx;
    border-radius: 8rpx;
    margin-left: 20rpx;
    flex-shrink: 0;
  }
}

.hot-search {
  .search-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 12rpx;

    .hot-tag {
      padding: 8rpx 20rpx;
      background: #f0fdf4;
      color: #07c160;
      font-size: 24rpx;
      border-radius: 30rpx;
    }
  }
}
</style>
