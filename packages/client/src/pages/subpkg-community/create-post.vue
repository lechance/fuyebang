<script setup lang="ts">
import { ref } from 'vue'
import { communityApi } from '@/api/community'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()

const title = ref('')
const content = ref('')
const postType = ref('DISCUSSION')
const tagInput = ref('')
const tags = ref<string[]>([])
const submitting = ref(false)

const postTypes = [
  { key: 'EXPERIENCE_SHARING', label: '经验分享', icon: '💡' },
  { key: 'QUESTION', label: '求助问答', icon: '❓' },
  { key: 'DISCUSSION', label: '讨论交流', icon: '💬' },
  { key: 'RESOURCE_SHARING', label: '资源分享', icon: '📦' },
  { key: 'WARNING', label: '避坑提醒', icon: '⚠️' },
]

async function submit() {
  if (!userStore.isLoggedIn) {
    uni.showToast({ title: '请先登录', icon: 'none' })
    return
  }
  const trimmedTitle = title.value.trim()
  const trimmedContent = content.value.trim()
  if (!trimmedTitle) {
    uni.showToast({ title: '请输入标题', icon: 'none' })
    return
  }
  if (!trimmedContent) {
    uni.showToast({ title: '请输入内容', icon: 'none' })
    return
  }

  submitting.value = true
  try {
    await communityApi.createPost({
      title: trimmedTitle,
      content: trimmedContent,
      postType: postType.value,
      tags: tags.value,
    })
    uni.showToast({ title: '发布成功' })
    setTimeout(() => {
      uni.navigateBack()
    }, 1000)
  } catch (err: any) {
    const msg = err?.message || '发布失败，请稍后重试'
    uni.showToast({ title: msg, icon: 'none' })
  } finally {
    submitting.value = false
  }
}

function addTag() {
  const t = tagInput.value.trim()
  if (t && !tags.value.includes(t)) {
    tags.value.push(t)
  }
  tagInput.value = ''
}

function removeTag(idx: number) {
  tags.value.splice(idx, 1)
}

function selectType(key: string) {
  postType.value = key
}
</script>

<template>
  <view class="create-post-page">
    <!-- 帖子类型 -->
    <view class="form-section">
      <text class="form-label">帖子类型</text>
      <view class="type-grid">
        <view v-for="t in postTypes" :key="t.key"
          :class="['type-item', { active: postType === t.key }]"
          @tap="selectType(t.key)">
          <text class="type-icon">{{ t.icon }}</text>
          <text class="type-label">{{ t.label }}</text>
        </view>
      </view>
    </view>

    <!-- 标题 -->
    <view class="form-section">
      <text class="form-label">标题</text>
      <input class="form-input title-input" v-model="title" placeholder="请输入标题，吸引更多人关注" maxlength="50" />
      <text class="char-count">{{ title.length }}/50</text>
    </view>

    <!-- 内容 -->
    <view class="form-section content-section">
      <text class="form-label">内容</text>
      <textarea class="form-textarea" v-model="content" placeholder="分享你的经验、问题或想法..." maxlength="5000" auto-height />
      <text class="char-count">{{ content.length }}/5000</text>
    </view>

    <!-- 标签 -->
    <view class="form-section">
      <text class="form-label">标签</text>
      <view class="tags-area">
        <view v-for="(tag, idx) in tags" :key="idx" class="tag-item">
          <text>{{ tag }}</text>
          <text class="tag-remove" @tap="removeTag(idx)">×</text>
        </view>
        <input class="tag-input" v-model="tagInput" placeholder="输入标签后确认" @confirm="addTag" :maxlength="10" />
      </view>
    </view>

    <!-- 提交按钮 -->
    <button class="submit-btn" @tap="submit" :loading="submitting" :disabled="submitting || !title.trim() || !content.trim()">
      发布帖子
    </button>
  </view>
</template>

<style lang="scss">
.create-post-page {
  padding: 20rpx;
  min-height: 100vh;
  background: #f5f5f5;
}

.form-section {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;

  .form-label {
    font-size: 28rpx;
    font-weight: 600;
    color: #333;
    display: block;
    margin-bottom: 16rpx;
  }

  .char-count {
    display: block;
    text-align: right;
    font-size: 22rpx;
    color: #bbb;
    margin-top: 8rpx;
  }

  .title-input {
    height: 80rpx;
    font-size: 30rpx;
    border-bottom: 2rpx solid #f0f0f0;
    padding-bottom: 12rpx;
  }
}

.type-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;

  .type-item {
    display: flex;
    align-items: center;
    padding: 12rpx 24rpx;
    background: #f5f5f5;
    border-radius: 30rpx;
    border: 2rpx solid transparent;

    &.active {
      background: #f0fdf4;
      border-color: #07c160;
    }

    .type-icon {
      font-size: 28rpx;
      margin-right: 8rpx;
    }
    .type-label {
      font-size: 24rpx;
      color: #333;
    }
  }
}

.content-section {
  .form-textarea {
    width: 100%;
    min-height: 240rpx;
    font-size: 28rpx;
    color: #333;
    line-height: 1.8;
  }
}

.tags-area {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  align-items: center;

  .tag-item {
    display: flex;
    align-items: center;
    padding: 6rpx 16rpx;
    background: #f0fdf4;
    color: #07c160;
    font-size: 24rpx;
    border-radius: 20rpx;

    .tag-remove {
      margin-left: 8rpx;
      font-size: 28rpx;
      color: #999;
    }
  }

  .tag-input {
    font-size: 24rpx;
    height: 56rpx;
    min-width: 160rpx;
    color: #666;
  }
}

.submit-btn {
  width: 100%;
  height: 88rpx;
  background: linear-gradient(135deg, #07c160, #10b981);
  color: #fff;
  font-size: 32rpx;
  font-weight: 600;
  border-radius: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  margin-top: 20rpx;

  &[disabled] {
    opacity: 0.5;
  }
}
</style>
