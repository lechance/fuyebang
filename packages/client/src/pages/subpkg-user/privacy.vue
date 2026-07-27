<script setup lang="ts">
</script>

<template>
  <view class="legal-page">
    <view class="section">
      <text class="title">隐私政策</text>
      <text class="updated">更新日期：2026年7月27日</text>
    </view>

    <view class="section">
      <text class="h2">一、信息收集</text>
      <text class="body">当您使用副业邦小程序时，我们可能会收集以下信息：</text>
      <text class="body">1. 微信登录信息（昵称、头像、OpenID），用于识别用户身份</text>
      <text class="body">2. 您主动提交的内容（帖子、评论、评测反馈），用于社区互动</text>
      <text class="body">3. 浏览记录，用于优化推荐内容</text>
    </view>

    <view class="section">
      <text class="h2">二、信息使用</text>
      <text class="body">我们收集的信息仅用于：提供和改进服务、个性化内容推荐、用户支持与沟通</text>
    </view>

    <view class="section">
      <text class="h2">三、信息保护</text>
      <text class="body">我们采用行业标准的安全措施保护您的个人信息，包括数据加密传输、访问权限控制。</text>
    </view>

    <view class="section">
      <text class="h2">四、联系我们</text>
      <text class="body">如有任何隐私相关问题，请通过意见反馈功能联系我们。</text>
    </view>
  </view>
</template>

<style lang="scss">
.legal-page { padding: 30rpx 24rpx; }
.section { margin-bottom: 32rpx; }
.title { font-size: 36rpx; font-weight: 700; color: #1a1a1a; display: block; }
.updated { font-size: 24rpx; color: #999; margin-top: 8rpx; display: block; }
.h2 { font-size: 30rpx; font-weight: 600; color: #333; display: block; margin-bottom: 12rpx; }
.body { font-size: 26rpx; color: #555; line-height: 1.8; display: block; margin-bottom: 8rpx; }
</style>
