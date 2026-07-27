<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const isEdit = route.params.id && route.params.id !== 'new'
const saving = ref(false)

const api = axios.create({
  baseURL: '',
  headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` },
})

const form = ref({
  title: '', summary: '', content: '', coverImage: '',
  articleType: 'OTHER', authorName: '管理员',
  isFeatured: false, status: 'DRAFT',
})

const articleTypes = [
  { value: 'POLICY_UPDATE', label: '政策解读' },
  { value: 'SEASONAL_ANALYSIS', label: '季节性分析' },
  { value: 'MARKET_TREND', label: '市场行情' },
  { value: 'FAILURE_CASE', label: '失败案例' },
  { value: 'SUCCESS_STORY', label: '成功案例' },
  { value: 'TOOL_REVIEW', label: '工具评测' },
  { value: 'OTHER', label: '其他' },
]

async function save() {
  saving.value = true
  try {
    if (isEdit) {
      await api.put(`/v1/admin/articles/${route.params.id}`, form.value)
    } else {
      await api.post('/v1/admin/articles', form.value)
    }
    ElMessage.success('保存成功')
    router.push('/articles')
  } catch { ElMessage.error('保存失败') }
  finally { saving.value = false }
}

async function publish() {
  if (!isEdit) return
  await api.put(`/v1/admin/articles/${route.params.id}/status`, { status: 'PUBLISHED' })
  ElMessage.success('已发布')
  form.value.status = 'PUBLISHED'
}

onMounted(async () => {
  if (isEdit) {
    try {
      const res = await api.get(`/v1/admin/articles/${route.params.id}`)
      const data = res.data?.data || res.data
      if (data) Object.assign(form.value, data)
    } catch { ElMessage.error('加载失败') }
  }
})
</script>

<template>
  <div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
      <h2>{{ isEdit ? '编辑文章' : '新建文章' }}</h2>
      <div>
        <el-button @click="router.push('/articles')">返回列表</el-button>
        <el-button v-if="isEdit && form.status !== 'PUBLISHED'" type="success" @click="publish">发布</el-button>
        <el-button type="primary" :loading="saving" @click="save">保存</el-button>
      </div>
    </div>
    <el-form :model="form" label-width="100px" style="max-width:900px">
      <el-form-item label="标题"><el-input v-model="form.title" placeholder="文章标题" /></el-form-item>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="文章类型"><el-select v-model="form.articleType" style="width:100%">
            <el-option v-for="t in articleTypes" :key="t.value" :label="t.label" :value="t.value" />
          </el-select></el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="作者"><el-input v-model="form.authorName" /></el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="推荐"><el-switch v-model="form.isFeatured" /></el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="封面图"><el-input v-model="form.coverImage" placeholder="https://..." /></el-form-item>
      <el-form-item label="摘要"><el-input v-model="form.summary" type="textarea" :rows="3" /></el-form-item>
      <el-form-item label="正文内容">
        <el-input v-model="form.content" type="textarea" :rows="20" placeholder="支持 HTML/Markdown 格式的正文内容..." />
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { ElMessage } from 'element-plus'
</script>
