<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
</script>
<template>
  <div><div style="display:flex;justify-content:space-between;margin-bottom:20px"><h2>资讯管理</h2><el-button type="primary" @click="router.push('/articles/edit/new')">新建文章</el-button></div>
  <el-table :data="[]" stripe><el-table-column prop="title" label="标题" /><el-table-column prop="articleType" label="类型" /><el-table-column prop="status" label="状态" /><el-table-column prop="createdAt" label="时间" /><el-table-column label="操作"><el-button size="small">编辑</el-button></el-table-column></el-table></div>
</template>
