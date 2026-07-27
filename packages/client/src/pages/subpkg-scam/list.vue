<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { scamApi } from '@/api/scam'

const scams = ref<any[]>([])
const tips = ref<any[]>([])
const stats = ref<any>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const [scamRes, tipsRes, statsRes] = await Promise.all([
      scamApi.list({ status: 'VERIFIED', pageSize: 20 }),
      scamApi.tips(),
      scamApi.stats(),
    ])
    scams.value = scamRes.data || []
    tips.value = tipsRes.data || tipsRes || []
    stats.value = statsRes.data || statsRes
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})

function goToDetail(id: string) {
  uni.navigateTo({ url: `/pages/subpkg-scam/detail?id=${id}` })
}

function goReport() {
  uni.navigateTo({ url: '/pages/subpkg-scam/report' })
}

function severityColor(severity: string): string {
  const map: Record<string, string> = { LOW: '#67c23a', MEDIUM: '#e6a23c', HIGH: '#f56c6c', CRITICAL: '#b91c1c' }
  return map[severity] || '#999'
}

function severityLabel(severity: string): string {
  const map: Record<string, string> = { LOW: '低风险', MEDIUM: '中风险', HIGH: '高风险', CRITICAL: '严重危险' }
  return map[severity] || severity
}
</script>

<template>
  <view class="scam-page">
    <!-- Stats -->
    <view class="stats-bar" v-if="stats">
      <view class="stat-item">
        <text class="stat-value">{{ stats.total }}</text>
        <text class="stat-label">已曝光骗局</text>
      </view>
    </view>

    <!-- Prevention tips -->
    <view class="tips-section">
      <text class="tips-title">🛡️ 防骗提醒</text>
      <view v-for="(tip, i) in tips" :key="i" class="tip-item">
        <text class="tip-bullet">•</text>
        <text class="tip-text">{{ tip.title }}</text>
        <text class="tip-severity" :style="{ color: severityColor(tip.severity) }">{{ severityLabel(tip.severity) }}</text>
      </view>
    </view>

    <!-- Scam list -->
    <view class="scam-list">
      <view v-for="item in scams" :key="item.id" class="scam-card" @tap="goToDetail(item.id)">
        <view class="scam-header">
          <text class="scam-title">{{ item.title }}</text>
          <text class="scam-severity" :style="{ background: severityColor(item.severity) }">
            {{ severityLabel(item.severity) }}
          </text>
        </view>
        <text class="scam-type">{{ item.scamType }}</text>
        <text class="scam-desc">{{ item.description }}</text>
        <view class="scam-footer">
          <text class="scam-date">{{ item.createdAt?.slice(0, 10) }}</text>
          <text class="scam-views">{{ item.viewCount }} 阅读</text>
        </view>
      </view>
    </view>

    <!-- Report button -->
    <view class="report-btn" @tap="goReport">
      <text>📢 我要举报骗局</text>
    </view>
  </view>
</template>

<style lang="scss">
.scam-page {
  .stats-bar {
    display: flex;
    justify-content: center;
    background: linear-gradient(135deg, #dc2626, #b91c1c);
    padding: 30rpx;
    color: #fff;

    .stat-item {
      text-align: center;

      .stat-value {
        font-size: 52rpx;
        font-weight: 800;
      }

      .stat-label {
        font-size: 24rpx;
        opacity: 0.9;
        display: block;
        margin-top: 4rpx;
      }
    }
  }

  .tips-section {
    background: #fff;
    margin: 20rpx;
    padding: 24rpx;
    border-radius: 16rpx;
    border-left: 8rpx solid #ef4444;

    .tips-title {
      font-size: 30rpx;
      font-weight: 600;
      color: #dc2626;
      display: block;
      margin-bottom: 16rpx;
    }

    .tip-item {
      display: flex;
      align-items: center;
      padding: 6rpx 0;

      .tip-bullet { color: #ef4444; margin-right: 12rpx; }
      .tip-text { flex: 1; font-size: 26rpx; color: #444; }
      .tip-severity { font-size: 20rpx; font-weight: 500; }
    }
  }

  .scam-card {
    background: #fff;
    margin: 0 20rpx 16rpx;
    padding: 24rpx;
    border-radius: 16rpx;

    .scam-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .scam-title {
        font-size: 30rpx;
        font-weight: 600;
        color: #1a1a1a;
        flex: 1;
      }

      .scam-severity {
        padding: 4rpx 16rpx;
        border-radius: 20rpx;
        font-size: 20rpx;
        color: #fff;
        flex-shrink: 0;
      }
    }

    .scam-type {
      display: inline-block;
      padding: 2rpx 12rpx;
      background: #fef2f2;
      color: #dc2626;
      font-size: 20rpx;
      border-radius: 20rpx;
      margin-top: 8rpx;
    }

    .scam-desc {
      display: block;
      font-size: 26rpx;
      color: #666;
      margin-top: 12rpx;
      lines: 3;
    }

    .scam-footer {
      display: flex;
      margin-top: 16rpx;
      font-size: 22rpx;
      color: #bbb;

      .scam-views { margin-left: auto; }
    }
  }

  .report-btn {
    margin: 20rpx;
    padding: 24rpx;
    text-align: center;
    background: linear-gradient(135deg, #ef4444, #dc2626);
    color: #fff;
    border-radius: 16rpx;
    font-size: 30rpx;
    font-weight: 500;
  }
}
</style>
