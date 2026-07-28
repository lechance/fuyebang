<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { communityApi } from '@/api/community'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()

const postId = ref('')
const post = ref<any>(null)
const comments = ref<any[]>([])
const loading = ref(true)
const commentPage = ref(1)
const hasMoreComments = ref(true)

// 评论输入
const commentContent = ref('')
const submitting = ref(false)

// 帖子类型标签
const postTypeLabels: Record<string, string> = {
  EXPERIENCE_SHARING: '经验分享',
  QUESTION: '求助问答',
  DISCUSSION: '讨论交流',
  RESOURCE_SHARING: '资源分享',
  WARNING: '避坑提醒',
}
const postTypeColors: Record<string, string> = {
  EXPERIENCE_SHARING: '#07c160',
  QUESTION: '#3b82f6',
  DISCUSSION: '#8b5cf6',
  RESOURCE_SHARING: '#f59e0b',
  WARNING: '#ef4444',
}

const isLiked = computed(() => post.value?.isLiked || false)

onLoad((query) => {
  if (query?.id) {
    postId.value = query.id
    loadPost()
    loadComments(true)
  }
})

async function loadPost() {
  try {
    const res = await communityApi.getPost(postId.value)
    post.value = res.data || res
  } catch (err) {
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

async function loadComments(reset = false) {
  if (reset) { commentPage.value = 1; hasMoreComments.value = true }
  if (!hasMoreComments.value) return
  try {
    const res = await communityApi.getComments(postId.value, commentPage.value)
    const list = res.data || res || []
    comments.value = reset ? list : [...comments.value, ...list]
    if (list.length < 20) hasMoreComments.value = false
  } catch {}
}

async function toggleLike() {
  if (!userStore.isLoggedIn) {
    uni.showToast({ title: '请先登录', icon: 'none' })
    return
  }
  try {
    await communityApi.toggleLike(postId.value)
    if (post.value) {
      post.value.isLiked = !post.value.isLiked
      post.value.likeCount += post.value.isLiked ? 1 : -1
    }
  } catch {
    uni.showToast({ title: '操作失败', icon: 'none' })
  }
}

async function submitComment() {
  if (!userStore.isLoggedIn) {
    uni.showToast({ title: '请先登录', icon: 'none' })
    return
  }
  const content = commentContent.value.trim()
  if (!content) {
    uni.showToast({ title: '请输入评论内容', icon: 'none' })
    return
  }
  submitting.value = true
  try {
    await communityApi.createComment(postId.value, { content })
    uni.showToast({ title: '评论成功' })
    commentContent.value = ''
    if (post.value) post.value.commentCount += 1
    loadComments(true)
  } catch {
    uni.showToast({ title: '评论失败', icon: 'none' })
  } finally {
    submitting.value = false
  }
}

function formatDate(date: string): string {
  if (!date) return ''
  const d = new Date(date)
  const now = new Date()
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000)
  if (diff < 60) return '刚刚'
  if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`
  if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`
  if (diff < 2592000) return `${Math.floor(diff / 86400)}天前`
  return date.slice(0, 10)
}
</script>

<template>
  <view class="post-detail-page">
    <!-- 加载状态 -->
    <view v-if="loading" class="loading-page">
      <text>加载中...</text>
    </view>

    <template v-else-if="post">
      <!-- 帖子内容 -->
      <view class="post-section">
        <view class="post-header">
          <image class="post-avatar" :src="post.author?.avatarUrl || '/static/default-avatar.png'" mode="aspectFill" />
          <view class="post-author-info">
            <text class="post-author">{{ post.author?.nickname || '匿名用户' }}</text>
            <view class="post-meta">
              <text class="post-type" :style="{ background: postTypeColors[post.postType] + '20', color: postTypeColors[post.postType] }">
                {{ postTypeLabels[post.postType] || post.postType }}
              </text>
              <text class="post-date">{{ formatDate(post.createdAt) }}</text>
            </view>
          </view>
        </view>

        <text class="post-title">{{ post.title }}</text>
        <text class="post-content-text">{{ post.content }}</text>

        <view class="post-images" v-if="post.images?.length">
          <image v-for="(img, i) in post.images" :key="i" :src="img" class="post-image" mode="aspectFill" @tap="uni.previewImage({ urls: post.images, current: i })" />
        </view>

        <view class="post-tags" v-if="post.tags?.length">
          <text v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</text>
        </view>

        <view class="post-stats">
          <view :class="['stat-btn', { active: isLiked }]" @tap="toggleLike">
            <text>{{ isLiked ? '👍' : '👍' }}</text>
            <text>{{ post.likeCount || 0 }}</text>
          </view>
          <view class="stat-btn">
            <text>💬</text>
            <text>{{ post.commentCount || 0 }}</text>
          </view>
          <view class="stat-btn">
            <text>👁</text>
            <text>{{ post.viewCount || 0 }}</text>
          </view>
        </view>
      </view>

      <!-- 评论区 -->
      <view class="comment-section">
        <text class="comment-section-title">💬 评论 ({{ post.commentCount || 0 }})</text>

        <view v-if="comments.length === 0" class="no-comments">
          <text>暂无评论，来说两句吧</text>
        </view>

        <view v-for="comment in comments" :key="comment.id" class="comment-item">
          <image class="comment-avatar" :src="comment.author?.avatarUrl || '/static/default-avatar.png'" mode="aspectFill" />
          <view class="comment-body">
            <view class="comment-header">
              <text class="comment-author">{{ comment.author?.nickname || '匿名用户' }}</text>
              <text class="comment-date">{{ formatDate(comment.createdAt) }}</text>
            </view>
            <text class="comment-content">{{ comment.content }}</text>
            <view class="comment-images" v-if="comment.images?.length">
              <image v-for="(img, j) in comment.images" :key="j" :src="img" class="comment-image" mode="aspectFill" />
            </view>
          </view>
        </view>

        <view v-if="hasMoreComments" class="load-more" @tap="loadComments()">
          <text>查看更多评论</text>
        </view>
      </view>

      <!-- 底部评论输入框 -->
      <view class="comment-input-bar">
        <input class="comment-input" v-model="commentContent" placeholder="说点什么..." :disabled="submitting" />
        <button class="submit-btn" @tap="submitComment" :loading="submitting" :disabled="submitting || !commentContent.trim()">发送</button>
      </view>
    </template>
  </view>
</template>

<style lang="scss">
.loading-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
  color: #999;
}

.post-detail-page {
  padding-bottom: 120rpx;
  background: #f5f5f5;
  min-height: 100vh;
}

.post-section {
  background: #fff;
  padding: 24rpx 20rpx;

  .post-header {
    display: flex;
    align-items: center;

    .post-avatar {
      width: 64rpx;
      height: 64rpx;
      border-radius: 50%;
    }

    .post-author-info {
      flex: 1;
      margin-left: 16rpx;

      .post-author {
        font-size: 28rpx;
        font-weight: 500;
        color: #333;
      }

      .post-meta {
        display: flex;
        align-items: center;
        gap: 12rpx;
        margin-top: 4rpx;

        .post-type {
          font-size: 20rpx;
          padding: 2rpx 12rpx;
          border-radius: 20rpx;
        }

        .post-date {
          font-size: 22rpx;
          color: #bbb;
        }
      }
    }
  }

  .post-title {
    display: block;
    font-size: 36rpx;
    font-weight: 700;
    color: #1a1a1a;
    margin-top: 20rpx;
  }

  .post-content-text {
    display: block;
    font-size: 28rpx;
    color: #444;
    line-height: 1.8;
    margin-top: 16rpx;
  }

  .post-images {
    display: flex;
    flex-wrap: wrap;
    gap: 12rpx;
    margin-top: 20rpx;

    .post-image {
      width: 220rpx;
      height: 220rpx;
      border-radius: 12rpx;
    }
  }

  .post-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8rpx;
    margin-top: 16rpx;

    .tag {
      padding: 4rpx 16rpx;
      background: #f0fdf4;
      color: #07c160;
      font-size: 22rpx;
      border-radius: 20rpx;
    }
  }

  .post-stats {
    display: flex;
    gap: 40rpx;
    margin-top: 24rpx;
    padding-top: 20rpx;
    border-top: 1rpx solid #f0f0f0;

    .stat-btn {
      display: flex;
      align-items: center;
      gap: 8rpx;
      font-size: 24rpx;
      color: #999;

      &.active { color: #ef4444; }
    }
  }
}

.comment-section {
  background: #fff;
  margin-top: 16rpx;
  padding: 24rpx 20rpx;

  .comment-section-title {
    font-size: 30rpx;
    font-weight: 600;
    color: #1a1a1a;
    display: block;
    margin-bottom: 20rpx;
  }

  .no-comments {
    text-align: center;
    padding: 40rpx 0;
    color: #ccc;
    font-size: 26rpx;
  }

  .comment-item {
    display: flex;
    margin-bottom: 24rpx;

    .comment-avatar {
      width: 48rpx;
      height: 48rpx;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .comment-body {
      flex: 1;
      margin-left: 16rpx;

      .comment-header {
        display: flex;
        align-items: center;

        .comment-author {
          font-size: 24rpx;
          color: #666;
          font-weight: 500;
        }
        .comment-date {
          font-size: 20rpx;
          color: #bbb;
          margin-left: auto;
        }
      }

      .comment-content {
        display: block;
        font-size: 26rpx;
        color: #444;
        margin-top: 8rpx;
        line-height: 1.6;
      }

      .comment-images {
        display: flex;
        gap: 8rpx;
        margin-top: 8rpx;

        .comment-image {
          width: 120rpx;
          height: 120rpx;
          border-radius: 8rpx;
        }
      }
    }
  }

  .load-more {
    text-align: center;
    padding: 20rpx;
    color: #07c160;
    font-size: 26rpx;
  }
}

.comment-input-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  padding: 16rpx 20rpx;
  padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
  background: #fff;
  border-top: 1rpx solid #f0f0f0;

  .comment-input {
    flex: 1;
    height: 72rpx;
    background: #f5f5f5;
    border-radius: 36rpx;
    padding: 0 24rpx;
    font-size: 26rpx;
  }

  .submit-btn {
    margin-left: 16rpx;
    padding: 12rpx 32rpx;
    background: #07c160;
    color: #fff;
    font-size: 26rpx;
    border-radius: 36rpx;
    border: none;
    line-height: 1;
  }
}
</style>
