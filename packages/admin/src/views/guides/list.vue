<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const api = axios.create({
  baseURL: '',
  headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` },
})

const guides = ref<any[]>([])
const loading = ref(false)
const page = ref(1)
const total = ref(0)
const filterCategory = ref('')

const categoryLabels: Record<string, string> = {
  BEGINNER: '新手入门',
  TOOL_RECOMMENDATION: '工具推荐',
  FINANCIAL_PLANNING: '财务规划',
  COMPLIANCE: '合规指南',
  SKILL_IMPROVEMENT: '技能提升',
}

async function load() {
  loading.value = true
  try {
    const params: any = { page: page.value, pageSize: 20 }
    if (filterCategory.value) params.category = filterCategory.value
    const res = await api.get('/v1/admin/guides', { params })
    const d = res.data?.data || res.data
    guides.value = d?.data || d || []
    total.value = d?.meta?.total || 0
  } catch { guides.value = [] }
  finally { loading.value = false }
}

function goEdit(id?: string) {
  router.push(`/guides/edit/${id || 'new'}`)
}

function goTools() {
  router.push('/guides/tools')
}

async function handleDelete(id: string) {
  await ElMessageBox.confirm('确认删除该指南？')
  await api.delete(`/v1/admin/guides/${id}`)
  ElMessage.success('已删除')
  load()
}

async function toggleStatus(guide: any) {
  const newStatus = guide.status === 'PUBLISHED' ? 'ARCHIVED' : 'PUBLISHED'
  await api.put(`/v1/admin/guides/${guide.id}/status`, { status: newStatus })
  ElMessage.success(newStatus === 'PUBLISHED' ? '已发布' : '已归档')
  load()
}

onMounted(() => load())
</script>

<template>
  <div>
    <div style="display:flex;justify-content:space-between;margin-bottom:20px">
      <h2>指南管理</h2>
      <div>
        <el-select v-model="filterCategory" clearable placeholder="筛选分类" style="width:140px;margin-right:12px" @change="load">
          <el-option v-for="(label, key) in categoryLabels" :key="key" :label="label" :value="key" />
        </el-select>
        <el-button @click="goTools" style="margin-right:12px">⚙ 工具管理</el-button>
        <el-button type="primary" @click="goEdit()">+ 新建指南</el-button>
      </div>
    </div>
    <el-table :data="guides" v-loading="loading" stripe>
      <el-table-column prop="title" label="标题" min-width="200" show-overflow-tooltip />
      <el-table-column label="分类" width="120">
        <template #default="{ row }">{{ categoryLabels[row.guideCategory] || row.guideCategory }}</template>
      </el-table-column>
      <el-table-column label="状态" width="90">
        <template #default="{ row }">
          <el-tag :type="row.status === 'PUBLISHED' ? 'success' : 'info'" size="small">
            {{ row.status === 'PUBLISHED' ? '已发布' : row.status === 'DRAFT' ? '草稿' : '归档' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="viewCount" label="阅读" width="70" />
      <el-table-column label="推荐" width="70">
        <template #default="{ row }">
          <el-tag :type="row.isFeatured ? 'warning' : 'info'" size="small">{{ row.isFeatured ? '是' : '否' }}</el-tag>
        </template>
      </el-table-column>
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
