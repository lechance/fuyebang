<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { scamApi } from '@/api/scam'

const id = ref('')
const scam = ref<any>(null)
const loading = ref(true)

const severityColors: Record<string, string> = {
  LOW: '#67c23a', MEDIUM: '#e6a23c', HIGH: '#f56c6c', CRITICAL: '#b91c1c',
}
const severityLabels: Record<string, string> = {
  LOW: '低风险', MEDIUM: '中风险', HIGH: '高风险', CRITICAL: '严重危险',
}

onLoad((query) => {
  if (query?.id) { id.value = query.id; loadDetail() }
})

async function loadDetail() {
  loading.value = true
  try {
    const res = await scamApi.getById(id.value)
    scam.value = res.data || res
  } catch {
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <view v-if="loading" class="loading-page">加载中...</view>

  <view v-else-if="scam" class="scam-detail">
    <view class="severity-header" :style="{ background: severityColors[scam.severity] || '#666' }">
      <text class="severity-badge">{{ severityLabels[scam.severity] || scam.severity }}</text>
      <text class="scam-title">{{ scam.title }}</text>
    </view>

    <view class="section">
      <view class="info-row">
        <text class="info-label">骗局类型</text>
        <text class="info-value">{{ scam.scamType || '未分类' }}</text>
      </view>
      <view class="info-row" v-if="scam.targetPlatform">
        <text class="info-label">涉及平台</text>
        <text class="info-value">{{ scam.targetPlatform }}</text>
      </view>
      <view class="info-row">
        <text class="info-label">曝光时间</text>
        <text class="info-value">{{ scam.createdAt?.slice(0, 10) }}</text>
      </view>
      <view class="info-row">
        <text class="info-label">阅读量</text>
        <text class="info-value">{{ scam.viewCount }}</text>
      </view>
    </view>

    <view class="section">
      <text class="section-title">📝 骗局详情</text>
      <text class="desc-content">{{ scam.description }}</text>
    </view>

    <view class="prevention-section" v-if="scam.preventionTips">
      <text class="prevention-title">🛡️ 防骗建议</text>
      <text class="prevention-content">{{ scam.preventionTips }}</text>
    </view>

    <view class="share-section">
      <button class="share-btn" open-type="share">📤 转发提醒更多人</button>
    </view>
  </view>
</template>

<style lang="scss">
.loading-page { display: flex; justify-content: center; align-items: center; height: 60vh; color: #999; }

.scam-detail { padding-bottom: 40rpx; }

.severity-header {
  padding: 40rpx 24rpx; color: #fff;
  .severity-badge {
    display: inline-block; padding: 6rpx 20rpx; background: rgba(255,255,255,0.3);
    border-radius: 20rpx; font-size: 24rpx;
  }
  .scam-title { display: block; font-size: 38rpx; font-weight: 700; margin-top: 16rpx; }
}

.section {
  background: #fff; margin: 16rpx 20rpx; padding: 24rpx; border-radius: 16rpx;
  .info-row {
    display: flex; justify-content: space-between; padding: 12rpx 0; border-bottom: 1rpx solid #f0f0f0;
    &:last-child { border-bottom: none; }
    .info-label { font-size: 26rpx; color: #999; }
    .info-value { font-size: 26rpx; color: #333; font-weight: 500; }
  }
  .section-title { font-size: 30rpx; font-weight: 600; color: #1a1a1a; display: block; margin-bottom: 12rpx; }
  .desc-content { font-size: 28rpx; color: #555; line-height: 1.8; white-space: pre-wrap; }
}

.prevention-section {
  margin: 16rpx 20rpx; padding: 24rpx; background: linear-gradient(135deg, #f0fdf4, #dcfce7);
  border-radius: 16rpx; border: 1rpx solid #bbf7d0;
  .prevention-title { font-size: 30rpx; font-weight: 600; color: #166534; display: block; }
  .prevention-content { font-size: 28rpx; color: #15803d; margin-top: 12rpx; line-height: 1.6; display: block; }
}

.share-section {
  margin: 20rpx;
  .share-btn {
    width: 100%; padding: 24rpx; background: linear-gradient(135deg, #07c160, #10b981);
    color: #fff; font-size: 30rpx; font-weight: 500; border: none; border-radius: 16rpx; text-align: center;
  }
}
</style>
