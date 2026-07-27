<script setup lang="ts">
import { ref, watch } from 'vue'
import { searchApi } from '@/api/search'

const keyword = ref('')
const suggestions = ref<any[]>([])
const results = ref<any>({ reviews: [], hustles: [], articles: [] })
const hasSearched = ref(false)
const loading = ref(false)
const searchHistory = ref<string[]>([])

// Load search history
const saved = uni.getStorageSync('search_history')
if (saved) searchHistory.value = JSON.parse(saved)

watch(keyword, (val) => {
  if (val.length < 2) { suggestions.value = []; return }
  searchApi.suggest(val).then(res => {
    suggestions.value = (res.data || res || []).slice(0, 6)
  }).catch(() => {})
})

function doSearch(kw?: string) {
  const q = kw || keyword.value
  if (!q.trim()) return
  hasSearched.value = true
  loading.value = true
  suggestions.value = []

  // Save to history
  if (!searchHistory.value.includes(q)) {
    searchHistory.value.unshift(q)
    if (searchHistory.value.length > 10) searchHistory.value.pop()
    uni.setStorageSync('search_history', JSON.stringify(searchHistory.value))
  }

  searchApi.search(q).then(res => {
    results.value = res.data || res || { reviews: [], hustles: [], articles: [] }
  }).finally(() => { loading.value = false })
}

function goToReview(slug: string) {
  uni.navigateTo({ url: `/pages/subpkg-review/detail?slug=${slug}` })
}

function goToHustle(slug: string) {
  if (slug) uni.navigateTo({ url: `/pages/subpkg-hustle/detail?slug=${slug}` })
}

function goToArticle(id: string) {
  uni.navigateTo({ url: `/pages/subpkg-news/article-detail?id=${id}` })
}

function clearHistory() {
  searchHistory.value = []
  uni.removeStorageSync('search_history')
}

function removeHistory(idx: number) {
  searchHistory.value.splice(idx, 1)
  uni.setStorageSync('search_history', JSON.stringify(searchHistory.value))
}
</script>

<template>
  <view class="search-page">
    <view class="search-bar">
      <view class="search-input-wrap">
        <text class="search-icon">🔍</text>
        <input v-model="keyword" class="search-input" placeholder="搜副业、搜评测..." confirm-type="search"
          @confirm="doSearch()" auto-focus />
        <text v-if="keyword" class="clear-btn" @tap="keyword = ''; results = { reviews: [], hustles: [], articles: [] }; hasSearched = false">✕</text>
      </view>
      <text class="cancel-btn" @tap="uni.navigateBack()">取消</text>
    </view>

    <!-- 建议 -->
    <view class="suggestions" v-if="suggestions.length > 0 && !hasSearched">
      <view v-for="s in suggestions" :key="s.text" class="suggest-item" @tap="keyword = s.text; doSearch(s.text)">
        <text class="suggest-type">[{{ s.type === 'review' ? '评测' : s.type === 'hustle' ? '副业' : '文章' }}]</text>
        <text class="suggest-text">{{ s.text }}</text>
      </view>
    </view>

    <!-- 搜索历史 -->
    <view class="history-section" v-if="!hasSearched && searchHistory.length > 0 && suggestions.length === 0">
      <view class="history-header">
        <text class="history-title">搜索历史</text>
        <text class="clear-history" @tap="clearHistory">清空</text>
      </view>
      <view class="history-tags">
        <text v-for="(h, i) in searchHistory" :key="i" class="history-tag" @tap="keyword = h; doSearch(h)">
          {{ h }}
          <text class="remove-history" @tap.stop="removeHistory(i)">✕</text>
        </text>
      </view>
    </view>

    <!-- 搜索结果 -->
    <view class="results" v-if="hasSearched">
      <view v-if="loading" class="loading-text">搜索中...</view>

      <template v-else>
        <!-- 评测 -->
        <view class="result-section" v-if="results.reviews?.length">
          <text class="result-section-title">📊 评测 ({{ results.reviews.length }})</text>
          <view v-for="r in results.reviews" :key="r.id" class="result-item" @tap="goToReview(r.slug)">
            <text class="result-title">{{ r.title }}</text>
            <text class="result-score" v-if="r.scoreOverall">{{ r.scoreOverall }}分</text>
          </view>
        </view>

        <!-- 副业 -->
        <view class="result-section" v-if="results.hustles?.length">
          <text class="result-section-title">💼 副业 ({{ results.hustles.length }})</text>
          <view v-for="h in results.hustles" :key="h.id" class="result-item" @tap="goToHustle(h.slug)">
            <text class="result-title">{{ h.name }}</text>
            <text class="result-category">{{ h.category }}</text>
          </view>
        </view>

        <!-- 文章 -->
        <view class="result-section" v-if="results.articles?.length">
          <text class="result-section-title">📰 资讯 ({{ results.articles.length }})</text>
          <view v-for="a in results.articles" :key="a.id" class="result-item" @tap="goToArticle(a.id)">
            <text class="result-title">{{ a.title }}</text>
          </view>
        </view>

        <view v-if="!results.reviews?.length && !results.hustles?.length && !results.articles?.length" class="empty-result">
          <text>未找到 "{{ keyword }}" 相关的内容</text>
        </view>
      </template>
    </view>
  </view>
</template>

<style lang="scss">
.search-page { min-height: 100vh; padding: 20rpx; }

.search-bar {
  display: flex; align-items: center;
  .search-input-wrap {
    flex: 1; display: flex; align-items: center;
    height: 72rpx; padding: 0 20rpx; background: #f5f5f5; border-radius: 36rpx;
    .search-icon { font-size: 28rpx; margin-right: 12rpx; }
    .search-input { flex: 1; font-size: 28rpx; }
    .clear-btn { font-size: 28rpx; color: #999; padding: 0 8rpx; }
  }
  .cancel-btn { font-size: 28rpx; color: #666; margin-left: 16rpx; white-space: nowrap; }
}

.suggestions {
  background: #fff; margin-top: 16rpx; border-radius: 16rpx;
  .suggest-item {
    display: flex; padding: 20rpx 24rpx; border-bottom: 1rpx solid #f0f0f0;
    &:last-child { border-bottom: none; }
    .suggest-type { font-size: 24rpx; color: #07c160; margin-right: 12rpx; }
    .suggest-text { font-size: 28rpx; color: #333; }
  }
}

.history-section {
  background: #fff; margin-top: 16rpx; padding: 24rpx; border-radius: 16rpx;
  .history-header { display: flex; justify-content: space-between; }
  .history-title { font-size: 28rpx; font-weight: 600; color: #333; }
  .clear-history { font-size: 24rpx; color: #999; }
  .history-tags { display: flex; flex-wrap: wrap; gap: 12rpx; margin-top: 16rpx; }
  .history-tag {
    padding: 8rpx 20rpx; background: #f0f0f0; border-radius: 30rpx; font-size: 24rpx; color: #666;
    .remove-history { margin-left: 8rpx; font-size: 20rpx; color: #bbb; }
  }
}

.results { margin-top: 20rpx; }
.loading-text { text-align: center; padding: 40rpx; color: #999; }

.result-section {
  background: #fff; margin-bottom: 16rpx; padding: 24rpx; border-radius: 16rpx;
  .result-section-title { font-size: 30rpx; font-weight: 600; color: #1a1a1a; display: block; margin-bottom: 12rpx; }
  .result-item {
    display: flex; justify-content: space-between; align-items: center;
    padding: 16rpx 0; border-bottom: 1rpx solid #f0f0f0;
    &:last-child { border-bottom: none; }
    .result-title { font-size: 28rpx; color: #333; flex: 1; }
    .result-score { font-size: 24rpx; color: #07c160; font-weight: 600; margin-left: 12rpx; }
    .result-category { font-size: 22rpx; color: #999; margin-left: 12rpx; }
  }
}

.empty-result { text-align: center; padding: 60rpx; color: #999; font-size: 28rpx; }
</style>
