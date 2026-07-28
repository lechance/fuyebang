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
  title: '',
  summary: '',
  content: '',
  coverImage: '',
  guideCategory: 'BEGINNER',
  authorName: '管理员',
  isFeatured: false,
  status: 'DRAFT',
})

const categoryOptions = [
  { value: 'BEGINNER', label: '新手入门' },
  { value: 'TOOL_RECOMMENDATION', label: '工具推荐' },
  { value: 'FINANCIAL_PLANNING', label: '财务规划' },
  { value: 'COMPLIANCE', label: '合规指南' },
  { value: 'SKILL_IMPROVEMENT', label: '技能提升' },
]

async function save() {
  saving.value = true
  try {
    if (isEdit) {
      await api.put(`/v1/admin/guides/${route.params.id}`, form.value)
    } else {
      await api.post('/v1/admin/guides', form.value)
    }
    ElMessage.success('保存成功')
    router.push('/guides')
  } catch { ElMessage.error('保存失败') }
  finally { saving.value = false }
}

async function publish() {
  if (!isEdit) return
  await api.put(`/v1/admin/guides/${route.params.id}/status`, { status: 'PUBLISHED' })
  ElMessage.success('已发布')
  form.value.status = 'PUBLISHED'
}

onMounted(async () => {
  if (isEdit) {
    try {
      const res = await api.get(`/v1/admin/guides/${route.params.id}`)
      const data = res.data?.data || res.data
      if (data) Object.assign(form.value, data)
    } catch { ElMessage.error('加载失败') }
  }
})
</script>

<template>
  <div>
    <div style="display:flex;justify-content:space-between;margin-bottom:20px">
      <h2>{{ isEdit ? '编辑指南' : '新建指南' }}</h2>
      <div>
        <el-button v-if="isEdit && form.status === 'DRAFT'" type="success" @click="publish" style="margin-right:12px">发布</el-button>
        <el-button @click="router.push('/guides')">返回列表</el-button>
      </div>
    </div>

    <el-form :model="form" label-width="100px" style="max-width:800px">
      <el-form-item label="标题" required>
        <el-input v-model="form.title" placeholder="请输入标题" maxlength="100" />
      </el-form-item>

      <el-form-item label="分类" required>
        <el-select v-model="form.guideCategory">
          <el-option v-for="opt in categoryOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="作者">
        <el-input v-model="form.authorName" placeholder="作者名称" />
      </el-form-item>

      <el-form-item label="封面图">
        <el-input v-model="form.coverImage" placeholder="输入图片 URL" />
      </el-form-item>

      <el-form-item label="摘要" required>
        <el-input v-model="form.summary" type="textarea" :rows="3" placeholder="请输入摘要" maxlength="300" show-word-limit />
      </el-form-item>

      <el-form-item label="正文内容" required>
        <el-input v-model="form.content" type="textarea" :rows="12" placeholder="请输入正文内容（支持 HTML）" />
      </el-form-item>

      <el-form-item label="推荐展示">
        <el-switch v-model="form.isFeatured" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="save" :loading="saving">保存</el-button>
        <el-button @click="router.push('/guides')">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
</script>
