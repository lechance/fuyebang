<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

const stats = ref({ totalUsers: 0, totalReviews: 0, totalArticles: 0, totalPosts: 0, todayViews: 0, todayNewUsers: 0 })

onMounted(async () => {
  try {
    const res = await axios.get('/admin/v1/analytics/dashboard', {
      headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` },
    })
    stats.value = res.data.data || res.data
  } catch {
    // Use mock data for development
    stats.value = { totalUsers: 128, totalReviews: 45, totalArticles: 67, totalPosts: 89, todayViews: 1234, todayNewUsers: 12 }
  }
})
</script>

<template>
  <div>
    <h2 style="margin-bottom: 20px">数据看板</h2>
    <el-row :gutter="20">
      <el-col :span="8"><el-card><h3>总用户</h3><p style="font-size: 32px; color: #07c160">{{ stats.totalUsers }}</p></el-card></el-col>
      <el-col :span="8"><el-card><h3>评测数</h3><p style="font-size: 32px; color: #409eff">{{ stats.totalReviews }}</p></el-card></el-col>
      <el-col :span="8"><el-card><h3>文章数</h3><p style="font-size: 32px; color: #e6a23c">{{ stats.totalArticles }}</p></el-card></el-col>
      <el-col :span="8" style="margin-top: 20px"><el-card><h3>社区帖子</h3><p style="font-size: 32px; color: #8b5cf6">{{ stats.totalPosts }}</p></el-card></el-col>
      <el-col :span="8" style="margin-top: 20px"><el-card><h3>今日阅读</h3><p style="font-size: 32px; color: #f59e0b">{{ stats.todayViews }}</p></el-card></el-col>
      <el-col :span="8" style="margin-top: 20px"><el-card><h3>新增用户</h3><p style="font-size: 32px; color: #10b981">{{ stats.todayNewUsers }}</p></el-card></el-col>
    </el-row>
  </div>
</template>
