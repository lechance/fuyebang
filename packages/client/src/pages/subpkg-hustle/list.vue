<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { hustleApi } from '@/api/side-hustle'
import { HustleCategory, HustleCategoryLabels } from '@fuyebang/shared'

const hustles = ref<any[]>([])
const loading = ref(true)
const activeCategory = ref('')
const keyword = ref('')
const page = ref(1)

const categoryOptions = [
  { key: '', label: '全部' },
  ...Object.entries(HustleCategoryLabels).map(([key, label]) => ({ key, label })),
]

async function load(reset = false) {
  if (reset) page.value = 1
  loading.value = true
  try {
    const params: any = { page: page.value, pageSize: 20 }
    if (activeCategory.value) params.category = activeCategory.value
    if (keyword.value) params.keyword = keyword.value
    const res = await hustleApi.list(params)
    hustles.value = reset ? (res.data || []) : [...hustles.value, ...(res.data || [])]
  } catch {} finally { loading.value = false }
}

function switchCategory(key: string) {
  activeCategory.value = key
  load(true)
}

function onSearch() {
  load(true)
}

function goToDetail(slug: string) {
  if (!slug) return
  uni.navigateTo({ url: `/pages/subpkg-hustle/detail?slug=${slug}` })
}

function barrierColor(barrier: string | null): string {
  if (barrier === '低') return '#10b981'
  if (barrier === '中') return '#f59e0b'
  if (barrier === '高') return '#ef4444'
  return '#999'
}

onMounted(() => load(true))
</script>

<template>
  <view class="hustle-list-page">
    <!-- 搜索 -->
    <view class="search-box">
      <input v-model="keyword" class="search-input" placeholder="搜索副业名称..." @confirm="onSearch" confirm-type="search" />
      <text class="search-btn" @tap="onSearch">搜索</text>
    </view>

    <!-- 分类筛选 -->
    <scroll-view class="category-scroll" scroll-x show-scrollbar="false">
      <view v-for="cat in categoryOptions" :key="cat.key"
        :class="['cat-tab', { active: activeCategory === cat.key }]"
        @tap="switchCategory(cat.key)">
        {{ cat.label }}
      </view>
    </scroll-view>

    <!-- 列表 -->
    <view class="hustle-list">
      <view v-for="item in hustles" :key="item.id" class="hustle-card" @tap="goToDetail(item.slug)">
        <view class="card-icon">{{ item.icon || '💼' }}</view>
        <view class="card-body">
          <text class="card-name">{{ item.name }}</text>
          <text class="card-desc">{{ item.shortDesc }}</text>
          <view class="card-tags">
            <text class="tag-barrier" :style="{ background: barrierColor(item.entryBarrier) }">
              {{ item.entryBarrier ? (item.entryBarrier + '门槛') : '-' }}
            </text>
            <text class="tag-income">{{ item.incomePotential || '-' }}收益</text>
            <text class="tag-reviews">{{ item.totalReviews }}篇评测</text>
          </view>
        </view>
        <text class="card-arrow">›</text>
      </view>
    </view>

    <view v-if="loading" class="loading-text">加载中...</view>
    <view v-if="!loading && hustles.length === 0" class="empty-text">暂无副业数据</view>
  </view>
</template>

<style lang="scss">
.hustle-list-page { min-height: 100vh; }

.search-box {
  display: flex;
  padding: 16rpx 20rpx;
  background: #fff;

  .search-input {
    flex: 1;
    height: 64rpx;
    padding: 0 20rpx;
    background: #f5f5f5;
    border-radius: 32rpx;
    font-size: 26rpx;
  }

  .search-btn {
    margin-left: 16rpx;
    color: #07c160;
    font-size: 28rpx;
    display: flex;
    align-items: center;
  }
}

.category-scroll {
  white-space: nowrap;
  background: #fff;
  padding: 0 20rpx 16rpx;

  .cat-tab {
    display: inline-block;
    padding: 8rpx 24rpx;
    margin-right: 12rpx;
    font-size: 24rpx;
    color: #666;
    border-radius: 30rpx;
    background: #f5f5f5;

    &.active { background: #07c160; color: #fff; }
  }
}

.hustle-list { padding: 0 20rpx; }

.hustle-card {
  display: flex; align-items: center;
  background: #fff; margin-top: 16rpx; padding: 24rpx;
  border-radius: 16rpx;

  .card-icon { font-size: 52rpx; margin-right: 16rpx; }
  .card-body { flex: 1; }
  .card-name { font-size: 30rpx; font-weight: 600; color: #1a1a1a; display: block; }
  .card-desc { font-size: 24rpx; color: #999; margin-top: 6rpx; display: block; lines: 1; }
  .card-tags {
    display: flex; gap: 12rpx; margin-top: 12rpx;
    .tag-barrier, .tag-income, .tag-reviews {
      font-size: 20rpx; padding: 2rpx 12rpx; border-radius: 20rpx;
    }
    .tag-barrier { color: #fff; }
    .tag-income { background: #fef3c7; color: #92400e; }
    .tag-reviews { background: #f0fdf4; color: #07c160; }
  }
  .card-arrow { font-size: 32rpx; color: #ccc; }
}

.loading-text, .empty-text { text-align: center; padding: 40rpx; font-size: 24rpx; color: #999; }
</style>
