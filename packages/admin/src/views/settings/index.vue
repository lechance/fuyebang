<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

const api = axios.create({
  baseURL: '',
  headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` },
})

const categories = ref<any[]>([])
const tags = ref<any[]>([])
const activeTab = ref('categories')
const dialogVisible = ref(false)
const editForm = ref({ name: '', slug: '', icon: '', parentId: '' })
const isEdit = ref(false)
const editId = ref('')
const newTag = ref({ name: '', slug: '', color: '#07c160' })

async function loadCategories() {
  const res = await api.get('/v1/categories')
  categories.value = res.data?.data || res.data || []
}

async function loadTags() {
  const res = await api.get('/v1/tags')
  tags.value = res.data?.data || res.data || []
}

function openCreate(parentId = '') {
  isEdit.value = false
  editForm.value = { name: '', slug: '', icon: '', parentId }
  dialogVisible.value = true
}

function openEdit(cat: any) {
  isEdit.value = true
  editId.value = cat.id
  editForm.value = { name: cat.name, slug: cat.slug, icon: cat.icon || '', parentId: cat.parentId || '' }
  dialogVisible.value = true
}

async function saveCategory() {
  try {
    if (isEdit.value) {
      await api.put(`/v1/admin/categories/${editId.value}`, editForm.value)
    } else {
      await api.post('/v1/admin/categories', editForm.value)
    }
    ElMessage.success('保存成功')
    dialogVisible.value = false
    loadCategories()
  } catch { ElMessage.error('保存失败') }
}

async function deleteCategory(id: string) {
  await ElMessageBox.confirm('确认删除此分类？')
  await api.delete(`/v1/admin/categories/${id}`)
  ElMessage.success('已删除')
  loadCategories()
}

async function addTag() {
  if (!newTag.value.name) return
  try {
    await api.post('/v1/admin/tags', newTag.value)
    ElMessage.success('标签已添加')
    newTag.value = { name: '', slug: '', color: '#07c160' }
    loadTags()
  } catch { ElMessage.error('添加失败') }
}

async function deleteTag(id: string) {
  await api.delete(`/v1/admin/tags/${id}`)
  ElMessage.success('已删除')
  loadTags()
}

onMounted(() => { loadCategories(); loadTags() })
</script>

<template>
  <div>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="分类管理" name="categories">
        <div style="margin-bottom:16px">
          <el-button type="primary" @click="openCreate()">+ 添加一级分类</el-button>
        </div>
        <el-table :data="categories" stripe>
          <el-table-column prop="name" label="分类名称" />
          <el-table-column prop="slug" label="Slug" />
          <el-table-column prop="icon" label="图标" width="80">
            <template #default="{ row }"><span style="font-size:24px">{{ row.icon }}</span></template>
          </el-table-column>
          <el-table-column prop="sortOrder" label="排序" width="80" />
          <el-table-column label="子分类" width="200">
            <template #default="{ row }">
              <span>{{ row.children?.map((c: any) => c.name).join(', ') || '-' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="{ row }">
              <el-button size="small" @click="openCreate(row.id)">添加子分类</el-button>
              <el-button size="small" @click="openEdit(row)">编辑</el-button>
              <el-button size="small" type="danger" @click="deleteCategory(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="标签管理" name="tags">
        <div style="display:flex;gap:12px;margin-bottom:16px">
          <el-input v-model="newTag.name" placeholder="标签名称" style="width:200px" />
          <el-input v-model="newTag.slug" placeholder="Slug" style="width:200px" />
          <el-color-picker v-model="newTag.color" />
          <el-button type="primary" @click="addTag">添加标签</el-button>
        </div>
        <el-table :data="tags" stripe>
          <el-table-column prop="name" label="标签" />
          <el-table-column prop="slug" label="Slug" />
          <el-table-column label="颜色" width="80">
            <template #default="{ row }">
              <div :style="{ width:'24px', height:'24px', borderRadius:'50%', background: row.color }"></div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template #default="{ row }">
              <el-button size="small" type="danger" @click="deleteTag(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <!-- Category dialog -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑分类' : '新建分类'" width="400px">
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="名称"><el-input v-model="editForm.name" /></el-form-item>
        <el-form-item label="Slug"><el-input v-model="editForm.slug" /></el-form-item>
        <el-form-item label="图标"><el-input v-model="editForm.icon" placeholder="如: 💻" /></el-form-item>
        <el-form-item label="父分类" v-if="!editForm.parentId">
          <el-select v-model="editForm.parentId" clearable placeholder="留空为顶级">
            <el-option v-for="cat in categories" :key="cat.id" :label="cat.name" :value="cat.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveCategory">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
</script>
