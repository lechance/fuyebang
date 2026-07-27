<script setup lang="ts">
import { ref } from 'vue'
import { scamApi } from '@/api/scam'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()
const submitting = ref(false)

const form = ref({
  title: '',
  description: '',
  scamType: '',
  targetPlatform: '',
  evidenceUrls: [] as string[],
})

const scamTypes = [
  '刷单诈骗', '点赞返利', '付费教学', '高价加盟', '虚拟币',
  '杀猪盘', '冒充客服', '虚假兼职', '传销', '其他',
]

const severityLabels: Record<number, string> = {
  1: '低风险 · 警惕', 2: '中风险 · 注意', 3: '高风险 · 危险', 4: '严重 · 立即远离',
}

const severity = ref(2)

async function submit() {
  if (!form.value.title || !form.value.description) {
    uni.showToast({ title: '请填写标题和描述', icon: 'none' })
    return
  }

  if (!userStore.isLoggedIn) {
    uni.showToast({ title: '请先登录', icon: 'none' })
    return
  }

  submitting.value = true
  try {
    await scamApi.create({
      ...form.value,
      severity: severity.value >= 4 ? 'CRITICAL' : severity.value >= 3 ? 'HIGH' : severity.value >= 2 ? 'MEDIUM' : 'LOW',
    })
    uni.showToast({ title: '举报已提交，感谢您的贡献！', icon: 'success' })
    setTimeout(() => uni.navigateBack(), 1500)
  } catch {
    uni.showToast({ title: '提交失败，请重试', icon: 'none' })
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <view class="report-page">
    <view class="tips-banner">
      <text class="tips-title">📢 举报须知</text>
      <text class="tips-desc">请如实描述骗局经历，帮助更多人避坑。提交后我们会尽快审核。</text>
    </view>

    <view class="form-section">
      <view class="form-group">
        <text class="form-label">骗局名称 *</text>
        <input v-model="form.title" class="form-input" placeholder="如：XX刷单平台骗局" />
      </view>

      <view class="form-group">
        <text class="form-label">骗局类型</text>
        <scroll-view class="type-scroll" scroll-x show-scrollbar="false">
          <text v-for="t in scamTypes" :key="t"
            :class="['type-tag', { active: form.scamType === t }]"
            @tap="form.scamType = t">{{ t }}</text>
        </scroll-view>
      </view>

      <view class="form-group">
        <text class="form-label">严重程度</text>
        <view class="severity-bar">
          <view v-for="(label, idx) in ['警惕', '注意', '危险', '严重']" :key="idx"
            :class="['severity-item', { active: severity >= idx + 1 }]"
            :style="{ background: severity >= idx + 1 ? ['#67c23a','#e6a23c','#f56c6c','#b91c1c'][idx] : '#f0f0f0' }"
            @tap="severity = idx + 1">
            <text class="severity-text">{{ label }}</text>
          </view>
        </view>
        <text class="severity-desc">{{ severityLabels[severity] || '' }}</text>
      </view>

      <view class="form-group">
        <text class="form-label">涉及平台</text>
        <input v-model="form.targetPlatform" class="form-input" placeholder="如：抖音、闲鱼、微信等" />
      </view>

      <view class="form-group">
        <text class="form-label">详细描述 *</text>
        <textarea v-model="form.description" class="form-textarea" placeholder="请详细描述骗局经过、涉及金额、诈骗手法等..." :maxlength="2000" />
        <text class="char-count">{{ form.description.length }}/2000</text>
      </view>

      <button class="submit-btn" :disabled="submitting" @tap="submit">
        {{ submitting ? '提交中...' : '📢 提交举报' }}
      </button>
    </view>
  </view>
</template>

<style lang="scss">
.report-page { padding-bottom: 40rpx; }

.tips-banner {
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  padding: 24rpx 20rpx; margin: 20rpx; border-radius: 16rpx;
  .tips-title { font-size: 30rpx; font-weight: 600; color: #92400e; display: block; }
  .tips-desc { font-size: 24rpx; color: #92400e; margin-top: 8rpx; display: block; line-height: 1.5; }
}

.form-section {
  background: #fff; margin: 0 20rpx; padding: 24rpx; border-radius: 16rpx;
}

.form-group {
  margin-bottom: 28rpx;
  .form-label { font-size: 28rpx; font-weight: 500; color: #333; display: block; margin-bottom: 12rpx; }
  .form-input {
    height: 72rpx; padding: 0 20rpx; border: 1rpx solid #e5e7eb; border-radius: 12rpx; font-size: 26rpx; width: 100%; box-sizing: border-box;
  }
  .form-textarea {
    width: 100%; min-height: 200rpx; padding: 16rpx 20rpx; border: 1rpx solid #e5e7eb;
    border-radius: 12rpx; font-size: 26rpx; box-sizing: border-box; line-height: 1.6;
  }
  .char-count { font-size: 22rpx; color: #bbb; text-align: right; display: block; margin-top: 6rpx; }
}

.type-scroll { white-space: nowrap; }
.type-tag {
  display: inline-block; padding: 8rpx 24rpx; margin-right: 12rpx;
  font-size: 24rpx; color: #666; border-radius: 30rpx; background: #f5f5f5;
  &.active { background: #fef2f2; color: #dc2626; font-weight: 500; }
}

.severity-bar {
  display: flex; gap: 12rpx;
  .severity-item {
    flex: 1; padding: 16rpx 0; text-align: center; border-radius: 12rpx;
    .severity-text { color: #fff; font-size: 24rpx; font-weight: 500; }
  }
}
.severity-desc { font-size: 24rpx; color: #999; margin-top: 8rpx; display: block; }

.submit-btn {
  width: 100%; padding: 24rpx 0; background: linear-gradient(135deg, #ef4444, #dc2626);
  color: #fff; font-size: 30rpx; font-weight: 500; border: none; border-radius: 16rpx; text-align: center;
  margin-top: 20rpx;

  &[disabled] { opacity: 0.5; }
}
</style>
