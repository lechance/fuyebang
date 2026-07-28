<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

const api = axios.create({
  baseURL: '',
  headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` },
})

const hustles = ref<any[]>([])
const loading = ref(false)
const page = ref(1)
const total = ref(0)
const dialogVisible = ref(false)
const isEdit = ref(false)
const editId = ref('')
const keyword = ref('')

const editForm = ref({
  name: '', slug: '', description: '', shortDesc: '', icon: '',
  category: 'ONLINE', incomePotential: '', entryBarrier: '', timeRequired: '',
  isHot: false, status: 'PUBLISHED',
})

const categoryOptions = [
  { value: 'ONLINE', label: '线上副业' },
  { value: 'OFFLINE', label: '线下副业' },
  { value: 'CREATIVE', label: '创意类' },
  { value: 'TECHNICAL', label: '技术类' },
  { value: 'MANUAL', label: '体力类' },
]

async function load() {
  loading.value = true
  try {
    const params: any = { page: page.value, pageSize: 20 }
    if (keyword.value) params.keyword = keyword.value
    const res = await api.get('/v1/admin/hustles', { params })
    const d = res.data?.data || res.data
    hustles.value = d?.data || d || []
    total.value = d?.meta?.total || 0
  } catch { hustles.value = [] }
  finally { loading.value = false }
}

function openCreate() {
  isEdit.value = false
  editForm.value = { name: '', slug: '', description: '', shortDesc: '', icon: '', category: 'ONLINE', incomePotential: '', entryBarrier: '', timeRequired: '', isHot: false, status: 'PUBLISHED' }
  dialogVisible.value = true
}

function openEdit(row: any) {
  isEdit.value = true
  editId.value = row.id
  editForm.value = { ...row }
  dialogVisible.value = true
}

async function save() {
  try {
    if (isEdit.value) {
      await api.put(`/v1/admin/hustles/${editId.value}`, editForm.value)
    } else {
      await api.post('/v1/admin/hustles', editForm.value)
    }
    ElMessage.success('保存成功')
    dialogVisible.value = false
    load()
  } catch { ElMessage.error('保存失败') }
}

async function handleDelete(id: string) {
  await ElMessageBox.confirm('确认删除此副业？')
  await api.delete(`/v1/admin/hustles/${id}`)
  ElMessage.success('已删除')
  load()
}

async function toggleStatus(row: any) {
  const newStatus = row.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'
  await api.put(`/v1/admin/hustles/${row.id}/status`, { status: newStatus })
  ElMessage.success(newStatus === 'PUBLISHED' ? '已发布' : '已下架')
  load()
}

function categoryLabel(val: string): string {
  return categoryOptions.find(c => c.value === val)?.label || val
}

onMounted(() => load())
</script>

<template>
  <div>
    <div style="display:flex;justify-content:space-between;margin-bottom:20px">
      <h2>副业库管理</h2>
      <div>
        <el-input v-model="keyword" placeholder="搜索副业名称" style="width:200px;margin-right:12px" clearable @clear="load" @keyup.enter="load" />
        <el-button type="primary" @click="openCreate">+ 添加副业</el-button>
      </div>
    </div>

    <el-table :data="hustles" v-loading="loading" stripe>
      <el-table-column prop="name" label="名称" width="150" />
      <el-table-column label="分类" width="100">
        <template #default="{ row }">{{ categoryLabel(row.category) }}</template>
      </el-table-column>
      <el-table-column prop="shortDesc" label="简介" min-width="200" show-overflow-tooltip />
      <el-table-column prop="incomePotential" label="收入潜力" width="100" />
      <el-table-column prop="totalReviews" label="评测数" width="70" />
      <el-table-column label="热门" width="70">
        <template #default="{ row }">
          <el-tag :type="row.isHot ? 'warning' : 'info'" size="small">{{ row.isHot ? '是' : '否' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="80">
        <template #default="{ row }">
          <el-tag :type="row.status === 'PUBLISHED' ? 'success' : 'info'" size="small">{{ row.status === 'PUBLISHED' ? '上线' : '下架' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="220" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="openEdit(row)">编辑</el-button>
          <el-button size="small" :type="row.status === 'PUBLISHED' ? 'warning' : 'success'" @click="toggleStatus(row)">
            {{ row.status === 'PUBLISHED' ? '下架' : '上架' }}
          </el-button>
          <el-button size="small" type="danger" @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-if="total > 0" v-model:current-page="page" :total="total" layout="prev,pager,next" @current-change="load" style="margin-top:20px" />

    <!-- 编辑/新建对话框 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑副业' : '添加副业'" width="600px">
      <el-form :model="editForm" label-width="100px">
        <el-form-item label="名称" required>
          <el-input v-model="editForm.name" placeholder="副业名称" />
        </el-form-item>
        <el-form-item label="Slug">
          <el-input v-model="editForm.slug" placeholder="URL 标识 (英文)" />
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="editForm.icon" placeholder="emoji 图标" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="editForm.category">
            <el-option v-for="c in categoryOptions" :key="c.value" :label="c.label" :value="c.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="简短描述">
          <el-input v-model="editForm.shortDesc" placeholder="一句话概括" maxlength="100" />
        </el-form-item>
        <el-form-item label="详细描述">
          <el-input v-model="editForm.description" type="textarea" :rows="4" placeholder="详细描述" />
        </el-form-item>
        <el-form-item label="收入潜力">
          <el-input v-model="editForm.incomePotential" placeholder="如：5000-20000元/月" />
        </el-form-item>
        <el-form-item label="入门门槛">
          <el-input v-model="editForm.entryBarrier" placeholder="如：低/中/高" />
        </el-form-item>
        <el-form-item label="时间要求">
          <el-input v-model="editForm.timeRequired" placeholder="如：2-3小时/天" />
        </el-form-item>
        <el-form-item label="热门推荐">
          <el-switch v-model="editForm.isHot" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
</script>
