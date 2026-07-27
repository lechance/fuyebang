<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { articleApi } from '@/api/article'

const id = ref('')
const guide = ref<any>(null)
const loading = ref(true)

onLoad((query) => {
  if (query?.id) { id.value = query.id; loadDetail() }
})

async function loadDetail() {
  loading.value = true
  try {
    const res = await articleApi.getById(id.value)
    guide.value = res.data || res
  } catch {
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <view v-if="loading" class="loading-page">加载中...</view>
  <view v-else-if="guide" class="guide-detail">
    <view class="title-section">
      <text class="guide-title">{{ guide.title }}</text>
      <view class="guide-meta">
        <text class="guide-author">{{ guide.authorName }}</text>
        <text class="guide-date">{{ guide.publishedAt?.slice(0, 10) || guide.createdAt?.slice(0, 10) }}</text>
      </view>
    </view>
    <view class="content-section" v-if="guide.summary">
      <text class="summary-text">{{ guide.summary }}</text>
    </view>
    <view class="content-section">
      <rich-text class="guide-content" :nodes="guide.content"></rich-text>
    </view>
  </view>
</template>

<style lang="scss">
.loading-page { display: flex; justify-content: center; align-items: center; height: 60vh; color: #999; }
.guide-detail { padding-bottom: 40rpx; }
.title-section { background: #fff; padding: 32rpx 24rpx; }
.guide-title { font-size: 36rpx; font-weight: 700; color: #1a1a1a; line-height: 1.4; }
.guide-meta { display: flex; gap: 16rpx; margin-top: 16rpx; font-size: 24rpx; color: #999; }
.content-section { background: #fff; margin-top: 16rpx; padding: 24rpx 20rpx; }
.summary-text { font-size: 26rpx; color: #666; line-height: 1.6; }
.guide-content { font-size: 28rpx; color: #444; line-height: 1.9; }
</style>
