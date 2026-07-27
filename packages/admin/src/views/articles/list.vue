<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const api = axios.create({
  baseURL: '',
  headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` },
})

const articles = ref<any[]>([])
const loading = ref(false)
const page = ref(1)
const total = ref(0)
const filterStatus = ref('')

const typeLabels: Record<string, string> = {
  POLICY_UPDATE: '政策解读', SEASONAL_ANALYSIS: '季节性', MARKET_TREND: '市场行情',
  FAILURE_CASE: '失败案例', SUCCESS_STORY: '成功案例', TOOL_REVIEW: '工具评测', OTHER: '其他',
}

async function load() {
  loading.value = true
  try {
    const params: any = { page: page.value, pageSize: 20 }
    if (filterStatus.value) params.status = filterStatus.value
    const res = await api.get('/v1/admin/articles', { params })
    const d = res.data?.data || res.data
    articles.value = d?.data || d || []
    total.value = d?.meta?.total || 0
  } catch { articles.value = [] }
  finally { loading.value = false }
}

function goEdit(id?: string) {
  router.push(`/articles/edit/${id || 'new'}`)
}

async function handleDelete(id: string) {
  await ElMessageBox.confirm('确认删除？')
  await api.delete(`/v1/admin/articles/${id}`)
  ElMessage.success('已删除')
  load()
}

async function toggleStatus(article: any) {
  const newStatus = article.status === 'PUBLISHED' ? 'ARCHIVED' : 'PUBLISHED'
  await api.put(`/v1/admin/articles/${article.id}/status`, { status: newStatus })
  ElMessage.success(newStatus === 'PUBLISHED' ? '已发布' : '已归档')
  load()
}

onMounted(() => load())
</script>

<template>
  <div>
    <div style="display:flex;justify-content:space-between;margin-bottom:20px">
      <h2>资讯管理</h2>
      <div>
        <el-select v-model="filterStatus" clearable placeholder="筛选状态" style="width:120px;margin-right:12px" @change="load">
          <el-option label="草稿" value="DRAFT" />
          <el-option label="已发布" value="PUBLISHED" />
          <el-option label="已归档" value="ARCHIVED" />
        </el-select>
        <el-button type="primary" @click="goEdit()">+ 新建文章</el-button>
      </div>
    </div>
    <el-table :data="articles" v-loading="loading" stripe>
      <el-table-column prop="title" label="标题" min-width="220" show-overflow-tooltip />
      <el-table-column label="类型" width="100">
        <template #default="{ row }">{{ typeLabels[row.articleType] || row.articleType }}</template>
      </el-table-column>
      <el-table-column label="状态" width="90">
        <template #default="{ row }">
          <el-tag :type="row.status === 'PUBLISHED' ? 'success' : 'info'" size="small">
            {{ row.status === 'PUBLISHED' ? '已发布' : row.status === 'DRAFT' ? '草稿' : '归档' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="viewCount" label="阅读" width="70" />
      <el-table-column prop="publishedAt" label="发布时间" width="170" />
      <el-table-column label="操作" width="220" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="goEdit(row.id)">编辑</el-button>
          <el-button size="small" :type="row.status === 'PUBLISHED' ? 'warning' : 'success'" @click="toggleStatus(row)">
            {{ row.status === 'PUBLISHED' ? '归档' : '发布' }}
          </el-button>
          <el-button size="small" type="danger" @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-if="total > 0" v-model:current-page="page" :total="total" layout="prev,pager,next" @current-change="load" style="margin-top:20px" />
  </div>
</template>

<script lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
</script>
