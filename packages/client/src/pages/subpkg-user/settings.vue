<script setup lang="ts">
import { useUserStore } from '@/store/user'

const userStore = useUserStore()

function goTo(path: string) {
  uni.navigateTo({ url: path })
}

function logout() {
  uni.showModal({
    title: '提示',
    content: '确定退出登录？',
    success: (res) => {
      if (res.confirm) {
        userStore.logout()
        uni.showToast({ title: '已退出', icon: 'success' })
        setTimeout(() => uni.navigateBack(), 1000)
      }
    },
  })
}
</script>

<template>
  <view class="settings-page">
    <view class="settings-group">
      <view class="setting-row" @tap="goTo('/pages/subpkg-community/search')">
        <text>🔍 搜索</text>
        <text class="arrow">›</text>
      </view>
    </view>

    <view class="settings-group">
      <view class="setting-row" @tap="goTo('/pages/subpkg-user/feedback')">
        <text>💬 意见反馈</text>
        <text class="arrow">›</text>
      </view>
      <view class="setting-row" @tap="goTo('/pages/subpkg-scam/report')">
        <text>🚨 举报骗局</text>
        <text class="arrow">›</text>
      </view>
    </view>

    <view class="settings-group">
      <view class="setting-row" @tap="goTo('/pages/subpkg-user/privacy')">
        <text>📋 隐私政策</text>
        <text class="arrow">›</text>
      </view>
      <view class="setting-row" @tap="goTo('/pages/subpkg-user/terms')">
        <text>📄 用户协议</text>
        <text class="arrow">›</text>
      </view>
    </view>

    <view class="settings-group" v-if="userStore.isLoggedIn">
      <view class="setting-row logout" @tap="logout">
        <text>退出登录</text>
      </view>
    </view>

    <view class="version-info">
      <text>副业邦 v1.0.0</text>
    </view>
  </view>
</template>

<style lang="scss">
.settings-page { padding: 20rpx; }

.settings-group {
  background: #fff; border-radius: 16rpx; margin-bottom: 20rpx; overflow: hidden;
}
.setting-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 28rpx 24rpx; border-bottom: 1rpx solid #f0f0f0; font-size: 28rpx; color: #333;
  &:last-child { border-bottom: none; }
  .arrow { font-size: 32rpx; color: #ccc; }
  &.logout { justify-content: center; color: #ef4444; }
}

.version-info {
  text-align: center; padding: 40rpx; font-size: 24rpx; color: #ccc;
}
</style>
