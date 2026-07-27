<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const reviews = ref<any[]>([])
const loading = ref(false)
const total = ref(0)
const page = ref(1)

async function loadReviews() {
  loading.value = true
  try {
    const res = await axios.get('/admin/v1/reviews', {
      params: { page: page.value, pageSize: 20 },
      headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` },
    })
    reviews.value = res.data.data?.data || res.data || []
    total.value = res.data.data?.meta?.total || 0
  } catch {
    reviews.value = []
  } finally {
    loading.value = false
  }
}

function goEdit(id?: string) {
  router.push(`/reviews/edit/${id || 'new'}`)
}

function handleDelete(id: string) {
  ElMessageBox.confirm('确认删除？').then(async () => {
    await axios.delete(`/admin/v1/reviews/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` },
    })
    ElMessage.success('已删除')
    loadReviews()
  }).catch(() => {})
}

onMounted(() => loadReviews())
</script>

<template>
  <div>
    <div style="display: flex; justify-content: space-between; margin-bottom: 20px">
      <h2>评测管理</h2>
      <el-button type="primary" @click="goEdit()">新建评测</el-button>
    </div>
    <el-table :data="reviews" v-loading="loading" stripe>
      <el-table-column prop="title" label="标题" min-width="200" />
      <el-table-column prop="scoreOverall" label="综合评分" width="100" />
      <el-table-column prop="viewCount" label="阅读量" width="80" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 'PUBLISHED' ? 'success' : row.status === 'DRAFT' ? 'info' : 'warning'">
            {{ row.status === 'PUBLISHED' ? '已发布' : row.status === 'DRAFT' ? '草稿' : '已归档' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" width="180" />
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button size="small" @click="goEdit(row.id)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-if="total > 0" v-model:current-page="page" :total="total" @current-change="loadReviews" style="margin-top: 20px" />
  </div>
</template>

<script lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
</script>
