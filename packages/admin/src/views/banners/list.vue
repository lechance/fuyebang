<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

const api = axios.create({
  baseURL: '',
  headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` },
})

const banners = ref<any[]>([])
const loading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const editId = ref('')

const editForm = ref({
  title: '',
  imageUrl: '',
  position: 'HOME_TOP',
  targetType: 'URL',
  targetId: '',
  targetUrl: '',
  sortOrder: 0,
  isActive: true,
})

const positionOptions = [
  { value: 'HOME_TOP', label: '首页顶部' },
  { value: 'HOME_MIDDLE', label: '首页中部' },
  { value: 'REVIEW_TOP', label: '评测页顶部' },
]

const targetOptions = [
  { value: 'URL', label: '外部链接' },
  { value: 'REVIEW', label: '评测详情' },
  { value: 'ARTICLE', label: '资讯详情' },
  { value: 'GUIDE', label: '指南详情' },
  { value: 'HUSTLE', label: '副业详情' },
]

async function load() {
  loading.value = true
  try {
    const res = await api.get('/v1/banners')
    banners.value = res.data?.data || res.data || []
  } catch { banners.value = [] }
  finally { loading.value = false }
}

function openCreate() {
  isEdit.value = false
  editForm.value = { title: '', imageUrl: '', position: 'HOME_TOP', targetType: 'URL', targetId: '', targetUrl: '', sortOrder: 0, isActive: true }
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
      await api.put(`/v1/banners/${editId.value}`, editForm.value)
    } else {
      await api.post('/v1/banners', editForm.value)
    }
    ElMessage.success('保存成功')
    dialogVisible.value = false
    load()
  } catch { ElMessage.error('保存失败') }
}

async function handleDelete(id: string) {
  await ElMessageBox.confirm('确认删除该横幅？')
  await api.delete(`/v1/banners/${id}`)
  ElMessage.success('已删除')
  load()
}

function positionLabel(pos: string): string {
  return positionOptions.find(p => p.value === pos)?.label || pos
}
function targetLabel(t: string): string {
  return targetOptions.find(o => o.value === t)?.label || t
}

onMounted(() => load())
</script>

<template>
  <div>
    <div style="display:flex;justify-content:space-between;margin-bottom:20px">
      <h2>横幅管理</h2>
      <el-button type="primary" @click="openCreate">+ 添加横幅</el-button>
    </div>

    <el-table :data="banners" v-loading="loading" stripe>
      <el-table-column label="预览" width="100">
        <template #default="{ row }">
          <el-image v-if="row.imageUrl" :src="row.imageUrl" style="width:80px;height:45px;border-radius:4px" fit="cover" />
          <span v-else style="color:#ccc">无图</span>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题" width="160" />
      <el-table-column label="位置" width="120">
        <template #default="{ row }">{{ positionLabel(row.position) }}</template>
      </el-table-column>
      <el-table-column label="跳转类型" width="120">
        <template #default="{ row }">{{ targetLabel(row.targetType) }}</template>
      </el-table-column>
      <el-table-column label="排序" width="70" prop="sortOrder" />
      <el-table-column label="启用" width="80">
        <template #default="{ row }">
          <el-tag :type="row.isActive ? 'success' : 'danger'" size="small">{{ row.isActive ? '启用' : '停用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="openEdit(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑/新建对话框 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑横幅' : '添加横幅'" width="550px">
      <el-form :model="editForm" label-width="100px">
        <el-form-item label="标题" required>
          <el-input v-model="editForm.title" placeholder="横幅标题" />
        </el-form-item>
        <el-form-item label="图片 URL" required>
          <el-input v-model="editForm.imageUrl" placeholder="图片地址" />
          <div v-if="editForm.imageUrl" style="margin-top:8px">
            <el-image :src="editForm.imageUrl" style="width:200px;height:112px;border-radius:4px" fit="cover" />
          </div>
        </el-form-item>
        <el-form-item label="展示位置">
          <el-select v-model="editForm.position">
            <el-option v-for="pos in positionOptions" :key="pos.value" :label="pos.label" :value="pos.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="跳转类型">
          <el-select v-model="editForm.targetType">
            <el-option v-for="t in targetOptions" :key="t.value" :label="t.label" :value="t.value" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="editForm.targetType === 'URL'" label="跳转链接">
          <el-input v-model="editForm.targetUrl" placeholder="https://..." />
        </el-form-item>
        <el-form-item v-else label="目标 ID">
          <el-input v-model="editForm.targetId" placeholder="对应内容 ID" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="editForm.sortOrder" :min="0" />
        </el-form-item>
        <el-form-item label="启用">
          <el-switch v-model="editForm.isActive" />
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
