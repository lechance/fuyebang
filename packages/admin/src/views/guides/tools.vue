<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

const api = axios.create({
  baseURL: '',
  headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` },
})

const tools = ref<any[]>([])
const loading = ref(false)
const dialogVisible = ref(false)
const editForm = ref({ name: '', description: '', logoUrl: '', website: '', category: '', isFree: true, price: '', rating: null, isRecommended: false })
const isEdit = ref(false)
const editId = ref('')

const categoryOptions = [
  '数据分析', '内容创作', '设计工具', '营销推广', '开发工具', '电商运营', '教育培训', '其他',
]

async function load() {
  loading.value = true
  try {
    const res = await api.get('/v1/admin/tools')
    tools.value = res.data?.data || res.data || []
  } catch { tools.value = [] }
  finally { loading.value = false }
}

function openCreate() {
  isEdit.value = false
  editForm.value = { name: '', description: '', logoUrl: '', website: '', category: '', isFree: true, price: '', rating: null, isRecommended: false }
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
      await api.put(`/v1/admin/tools/${editId.value}`, editForm.value)
    } else {
      await api.post('/v1/admin/tools', editForm.value)
    }
    ElMessage.success('保存成功')
    dialogVisible.value = false
    load()
  } catch { ElMessage.error('保存失败') }
}

async function handleDelete(id: string) {
  await ElMessageBox.confirm('确认删除该工具？')
  await api.delete(`/v1/admin/tools/${id}`)
  ElMessage.success('已删除')
  load()
}

onMounted(() => load())
</script>

<template>
  <div>
    <div style="display:flex;justify-content:space-between;margin-bottom:20px">
      <h2>工具管理</h2>
      <el-button type="primary" @click="openCreate">+ 添加工具</el-button>
    </div>

    <el-table :data="tools" v-loading="loading" stripe>
      <el-table-column label="Logo" width="60">
        <template #default="{ row }">
          <el-avatar v-if="row.logoUrl" :src="row.logoUrl" :size="36" />
          <el-avatar v-else :size="36">{{ row.name?.[0] }}</el-avatar>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" width="140" />
      <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip />
      <el-table-column prop="category" label="分类" width="100" />
      <el-table-column label="费用" width="80">
        <template #default="{ row }">
          <el-tag :type="row.isFree ? 'success' : 'warning'" size="small">{{ row.isFree ? '免费' : row.price || '付费' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="推荐" width="70">
        <template #default="{ row }">
          <el-tag :type="row.isRecommended ? 'warning' : 'info'" size="small">{{ row.isRecommended ? '是' : '否' }}</el-tag>
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
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑工具' : '添加工具'" width="550px">
      <el-form :model="editForm" label-width="100px">
        <el-form-item label="名称" required>
          <el-input v-model="editForm.name" placeholder="工具名称" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="editForm.description" type="textarea" :rows="3" placeholder="工具描述" />
        </el-form-item>
        <el-form-item label="Logo URL">
          <el-input v-model="editForm.logoUrl" placeholder="Logo 图片地址" />
        </el-form-item>
        <el-form-item label="网站">
          <el-input v-model="editForm.website" placeholder="https://..." />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="editForm.category" filterable allow-create>
            <el-option v-for="cat in categoryOptions" :key="cat" :label="cat" :value="cat" />
          </el-select>
        </el-form-item>
        <el-form-item label="费用类型">
          <el-radio-group v-model="editForm.isFree">
            <el-radio :value="true">免费</el-radio>
            <el-radio :value="false">付费</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="!editForm.isFree" label="价格">
          <el-input v-model="editForm.price" placeholder="如：¥99/月" />
        </el-form-item>
        <el-form-item label="评分">
          <el-rate v-model="editForm.rating" :max="5" allow-half />
        </el-form-item>
        <el-form-item label="推荐展示">
          <el-switch v-model="editForm.isRecommended" />
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
