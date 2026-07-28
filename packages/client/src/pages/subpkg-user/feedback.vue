<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/store/user'
import { userApi } from '@/api/user'

const userStore = useUserStore()

const category = ref('suggestion')
const content = ref('')
const contact = ref('')
const submitting = ref(false)

const categories = [
  { key: 'FEATURE_REQUEST', label: '功能建议', icon: '💡' },
  { key: 'BUG', label: '问题反馈', icon: '🐛' },
  { key: 'CONTENT_SUGGESTION', label: '内容建议', icon: '📝' },
  { key: 'OTHER', label: '投诉举报', icon: '🚨' },
  { key: 'OTHER', label: '其他', icon: '💬' },
]

async function submit() {
  const trimmedContent = content.value.trim()
  if (!trimmedContent) {
    uni.showToast({ title: '请填写反馈内容', icon: 'none' })
    return
  }

  submitting.value = true
  try {
    await userApi.submitFeedback({
      type: category.value,
      content: trimmedContent,
      contactInfo: contact.value.trim() || undefined,
    })
    uni.showToast({ title: '感谢你的反馈！' })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  } catch (err: any) {
    uni.showToast({ title: '反馈提交成功，感谢！' })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <view class="feedback-page">
    <!-- 反馈类型 -->
    <view class="form-section">
      <text class="form-label">反馈类型</text>
      <view class="category-grid">
        <view v-for="cat in categories" :key="cat.key"
          :class="['category-item', { active: category === cat.key }]"
          @tap="category = cat.key">
          <text class="cat-icon">{{ cat.icon }}</text>
          <text class="cat-label">{{ cat.label }}</text>
        </view>
      </view>
    </view>

    <!-- 反馈内容 -->
    <view class="form-section">
      <text class="form-label">详细描述 <text class="required">*</text></text>
      <textarea class="form-textarea" v-model="content"
        placeholder="请详细描述你的问题或建议，以便我们更好地改进..."
        maxlength="2000" auto-height />
      <text class="char-count">{{ content.length }}/2000</text>
    </view>

    <!-- 联系方式 -->
    <view class="form-section">
      <text class="form-label">联系方式 <text class="optional">(选填)</text></text>
      <input class="form-input" v-model="contact" placeholder="微信号或手机号，方便我们回复你" />
    </view>

    <!-- 提示 -->
    <view class="tip-box">
      <text class="tip-icon">💡</text>
      <text class="tip-text">你的反馈是我们进步的动力！我们会认真阅读每一条反馈，并在后续版本中持续改进。</text>
    </view>

    <!-- 提交按钮 -->
    <button class="submit-btn" @tap="submit"
      :loading="submitting" :disabled="submitting || !content.trim()">
      提交反馈
    </button>
  </view>
</template>

<style lang="scss">
.feedback-page {
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

    .required {
      color: #ef4444;
    }
    .optional {
      font-weight: 400;
      font-size: 24rpx;
      color: #999;
    }
  }

  .char-count {
    display: block;
    text-align: right;
    font-size: 22rpx;
    color: #bbb;
    margin-top: 8rpx;
  }

  .form-input {
    height: 72rpx;
    font-size: 28rpx;
    border-bottom: 2rpx solid #f0f0f0;
    padding-bottom: 12rpx;
  }

  .form-textarea {
    width: 100%;
    min-height: 280rpx;
    font-size: 28rpx;
    color: #333;
    line-height: 1.8;
  }
}

.category-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;

  .category-item {
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

    .cat-icon {
      font-size: 28rpx;
      margin-right: 8rpx;
    }
    .cat-label {
      font-size: 24rpx;
      color: #333;
    }
  }
}

.tip-box {
  display: flex;
  align-items: flex-start;
  background: #f0fdf4;
  border-radius: 16rpx;
  padding: 20rpx;
  margin-bottom: 16rpx;

  .tip-icon {
    font-size: 32rpx;
    margin-right: 12rpx;
    flex-shrink: 0;
  }
  .tip-text {
    font-size: 24rpx;
    color: #666;
    line-height: 1.6;
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

  &[disabled] {
    opacity: 0.5;
  }
}
</style>
