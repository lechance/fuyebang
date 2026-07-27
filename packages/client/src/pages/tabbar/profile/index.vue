<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/store/user'
import { userApi } from '@/api/user'

const userStore = useUserStore()
const unreadCount = ref(0)

function login() {
  // Auto login with WeChat
  uni.login({
    provider: 'weixin',
    success: async (res) => {
      try {
        const authRes = await userApi.login(res.code)
        userStore.login(authRes.data || authRes)
        uni.showToast({ title: '登录成功' })
      } catch (err) {
        uni.showToast({ title: '登录失败', icon: 'none' })
      }
    },
    fail: () => {
      uni.showToast({ title: '登录取消', icon: 'none' })
    },
  })
}

function goTo(path: string) {
  if (!userStore.isLoggedIn) {
    login()
    return
  }
  uni.navigateTo({ url: path })
}

onMounted(async () => {
  if (userStore.isLoggedIn) {
    try {
      const res = await userApi.getUnreadCount()
      unreadCount.value = res.data ?? 0
    } catch {}
  }
})
</script>

<template>
  <view class="profile-page">
    <view class="user-card" @tap="login" v-if="!userStore.isLoggedIn">
      <image class="user-avatar" src="/static/default-avatar.png" mode="aspectFill" />
      <view class="user-info">
        <text class="user-name">点击登录</text>
        <text class="user-desc">登录后享受完整功能</text>
      </view>
      <text class="arrow">›</text>
    </view>

    <view class="user-card" v-else>
      <image class="user-avatar" :src="userStore.userInfo?.avatarUrl || '/static/default-avatar.png'" mode="aspectFill" />
      <view class="user-info">
        <text class="user-name">{{ userStore.userInfo?.nickname || '用户' }}</text>
        <text class="user-desc">{{ userStore.userInfo?.role === 'ADMIN' ? '管理员' : '普通用户' }}</text>
      </view>
    </view>

    <view class="menu-grid">
      <view class="menu-item" @tap="goTo('/pages/subpkg-user/favorites')">
        <text class="menu-icon">❤️</text>
        <text class="menu-label">我的收藏</text>
      </view>
      <view class="menu-item" @tap="goTo('/pages/subpkg-user/history')">
        <text class="menu-icon">📖</text>
        <text class="menu-label">浏览记录</text>
      </view>
      <view class="menu-item" @tap="goTo('/pages/subpkg-user/my-posts')">
        <text class="menu-icon">📝</text>
        <text class="menu-label">我的发布</text>
      </view>
      <view class="menu-item" @tap="goTo('/pages/subpkg-user/notifications')">
        <text class="menu-icon">🔔</text>
        <text class="menu-label">消息通知</text>
        <text class="badge" v-if="unreadCount > 0">{{ unreadCount }}</text>
      </view>
    </view>

    <view class="menu-list">
      <view class="menu-row" @tap="goTo('/pages/subpkg-scam/report')">
        <text class="row-icon">🚨</text>
        <text class="row-label">举报骗局</text>
        <text class="arrow">›</text>
      </view>
      <view class="menu-row" @tap="goTo('/pages/subpkg-user/feedback')">
        <text class="row-icon">💬</text>
        <text class="row-label">意见反馈</text>
        <text class="arrow">›</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss">
.profile-page {
  .user-card {
    display: flex;
    align-items: center;
    background: linear-gradient(135deg, #07c160, #10b981);
    padding: 40rpx 24rpx;
    color: #fff;

    .user-avatar {
      width: 100rpx;
      height: 100rpx;
      border-radius: 50%;
      border: 4rpx solid rgba(255, 255, 255, 0.4);
    }

    .user-info {
      flex: 1;
      margin-left: 20rpx;

      .user-name {
        font-size: 34rpx;
        font-weight: 600;
      }

      .user-desc {
        font-size: 24rpx;
        opacity: 0.8;
        margin-top: 6rpx;
        display: block;
      }
    }

    .arrow {
      font-size: 40rpx;
      opacity: 0.7;
    }
  }

  .menu-grid {
    display: flex;
    flex-wrap: wrap;
    background: #fff;
    margin: 20rpx;
    border-radius: 16rpx;
    padding: 16rpx 0;

    .menu-item {
      width: 25%;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20rpx 0;
      position: relative;

      .menu-icon {
        font-size: 48rpx;
      }

      .menu-label {
        font-size: 24rpx;
        color: #666;
        margin-top: 8rpx;
      }

      .badge {
        position: absolute;
        top: 8rpx;
        right: 20rpx;
        background: #ef4444;
        color: #fff;
        font-size: 20rpx;
        min-width: 32rpx;
        height: 32rpx;
        border-radius: 16rpx;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }

  .menu-list {
    background: #fff;
    margin: 0 20rpx;
    border-radius: 16rpx;

    .menu-row {
      display: flex;
      align-items: center;
      padding: 24rpx 20rpx;
      border-bottom: 1rpx solid #f0f0f0;

      &:last-child { border-bottom: none; }

      .row-icon {
        font-size: 36rpx;
        margin-right: 16rpx;
      }

      .row-label {
        flex: 1;
        font-size: 28rpx;
        color: #333;
      }

      .arrow {
        font-size: 32rpx;
        color: #ccc;
      }
    }
  }
}
</style>
