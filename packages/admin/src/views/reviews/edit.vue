<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const isEdit = route.params.id && route.params.id !== 'new'
const loading = ref(false)
const form = ref({
  title: '', summary: '', content: '', slug: '',
  scoreEarnings: 5, scoreRisk: 5, scoreMarketStability: 5, scoreDifficulty: 5, scoreCompliance: 5,
  incomeMin: null, incomeMax: null, difficulty: 'MEDIUM',
  pros: [] as string[], cons: [] as string[], scamAlerts: [] as string[],
  coverImage: '', isFeatured: false,
})

const newPros = ref('')
const newCons = ref('')

function addPro() {
  if (newPros.value) { form.value.pros.push(newPros.value); newPros.value = '' }
}
function addCon() {
  if (newCons.value) { form.value.cons.push(newCons.value); newCons.value = '' }
}
function removePro(i: number) { form.value.pros.splice(i, 1) }
function removeCon(i: number) { form.value.cons.splice(i, 1) }

async function save() {
  loading.value = true
  try {
    const headers = { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
    if (isEdit) {
      await axios.put(`/admin/v1/reviews/${route.params.id}`, form.value, { headers })
    } else {
      await axios.post('/admin/v1/reviews', form.value, { headers })
    }
    ElMessage.success('保存成功')
    router.push('/reviews')
  } catch {
    ElMessage.error('保存失败')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (isEdit) {
    try {
      const res = await axios.get(`/admin/v1/reviews/${route.params.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` },
      })
      const data = res.data.data || res.data
      if (data) form.value = { ...form.value, ...data }
    } catch { ElMessage.error('加载失败') }
  }
})
</script>

<template>
  <div>
    <h2>{{ isEdit ? '编辑评测' : '新建评测' }}</h2>
    <el-form :model="form" label-width="120px" style="max-width: 800px; margin-top: 20px">
      <el-form-item label="标题"><el-input v-model="form.title" /></el-form-item>
      <el-form-item label="Slug"><el-input v-model="form.slug" :disabled="isEdit" /></el-form-item>
      <el-form-item label="封面图"><el-input v-model="form.coverImage" placeholder="图片URL" /></el-form-item>
      <el-form-item label="摘要"><el-input v-model="form.summary" type="textarea" :rows="3" /></el-form-item>

      <el-divider>评分（0-10）</el-divider>
      <el-row :gutter="20">
        <el-col :span="8"><el-form-item label="收益潜力"><el-slider v-model="form.scoreEarnings" :min="0" :max="10" show-input /></el-form-item></el-col>
        <el-col :span="8"><el-form-item label="风险指数"><el-slider v-model="form.scoreRisk" :min="0" :max="10" show-input /></el-form-item></el-col>
        <el-col :span="8"><el-form-item label="市场稳定性"><el-slider v-model="form.scoreMarketStability" :min="0" :max="10" show-input /></el-form-item></el-col>
        <el-col :span="8"><el-form-item label="上手难度"><el-slider v-model="form.scoreDifficulty" :min="0" :max="10" show-input /></el-form-item></el-col>
        <el-col :span="8"><el-form-item label="合规安全"><el-slider v-model="form.scoreCompliance" :min="0" :max="10" show-input /></el-form-item></el-col>
      </el-row>

      <el-divider>收入信息</el-divider>
      <el-row :gutter="20">
        <el-col :span="8"><el-form-item label="最低月收入"><el-input-number v-model="form.incomeMin" :min="0" /></el-form-item></el-col>
        <el-col :span="8"><el-form-item label="最高月收入"><el-input-number v-model="form.incomeMax" :min="0" /></el-form-item></el-col>
        <el-col :span="8"><el-form-item label="难度"><el-select v-model="form.difficulty"><el-option label="简单" value="EASY" /><el-option label="中等" value="MEDIUM" /><el-option label="困难" value="HARD" /><el-option label="专家" value="EXPERT" /></el-select></el-form-item></el-col>
      </el-row>

      <el-divider>优点</el-divider>
      <el-form-item><el-input v-model="newPros" placeholder="输入优点" style="width: 300px"><template #append><el-button @click="addPro">添加</el-button></template></el-input></el-form-item>
      <el-tag v-for="(p, i) in form.pros" :key="i" closable @close="removePro(i)" style="margin-right: 8px; margin-bottom: 8px">{{ p }}</el-tag>

      <el-divider>缺点</el-divider>
      <el-form-item><el-input v-model="newCons" placeholder="输入缺点" style="width: 300px"><template #append><el-button @click="addCon">添加</el-button></template></el-input></el-form-item>
      <el-tag v-for="(c, i) in form.cons" :key="i" type="danger" closable @close="removeCon(i)" style="margin-right: 8px; margin-bottom: 8px">{{ c }}</el-tag>

      <el-divider>内容</el-divider>
      <el-form-item label="详细内容"><el-input v-model="form.content" type="textarea" :rows="10" /></el-form-item>

      <el-form-item>
        <el-button type="primary" :loading="loading" @click="save">保存</el-button>
        <el-button @click="router.push('/reviews')">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import { ElMessage } from 'element-plus'
</script>
