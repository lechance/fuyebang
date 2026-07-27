<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const isEdit = route.params.id && route.params.id !== 'new'
const loading = ref(false)
const saving = ref(false)
const activeTab = ref('basic')

const api = axios.create({
  baseURL: '',
  headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` },
})

const form = ref({
  title: '', summary: '', content: '', slug: '',
  scoreEarnings: 5, scoreRisk: 5, scoreMarketStability: 5, scoreDifficulty: 5, scoreCompliance: 5,
  incomeMin: null as number | null, incomeMax: null as number | null,
  incomePeriod: 'monthly', difficulty: 'MEDIUM',
  pros: [] as string[], cons: [] as string[], scamAlerts: [] as string[],
  requirements: [] as string[], timeCommitment: '', startupCost: null as number | null,
  coverImage: '', isFeatured: false, status: 'DRAFT',
})

const steps = ref<{ stepNumber: number; title: string; content: string; imageUrl?: string }[]>([])
const newPros = ref('')
const newCons = ref('')
const newScamAlert = ref('')
const newRequirements = ref('')

const autoScore = computed(() => {
  const w = { earnings: 0.25, risk: 0.20, stability: 0.20, difficulty: 0.15, compliance: 0.20 }
  const raw =
    Number(form.value.scoreEarnings) * w.earnings +
    (10 - Number(form.value.scoreRisk)) * w.risk +
    Number(form.value.scoreMarketStability) * w.stability +
    (10 - Number(form.value.scoreDifficulty)) * w.difficulty +
    Number(form.value.scoreCompliance) * w.compliance
  return Math.round(raw * 10) / 10
})

function addItem(list: string[], val: string, clear: (v: string) => void) {
  if (val.trim()) { list.push(val.trim()); clear('') }
}
function removeItem(list: string[], idx: number) { list.splice(idx, 1) }

function addStep() {
  steps.value.push({ stepNumber: steps.value.length + 1, title: '', content: '' })
}
function removeStep(idx: number) {
  steps.value.splice(idx, 1)
  steps.value.forEach((s, i) => s.stepNumber = i + 1)
}

async function save() {
  saving.value = true
  try {
    const payload = { ...form.value }
    if (isEdit) {
      await api.put(`/v1/admin/reviews/${route.params.id}`, payload)
      if (steps.value.length > 0) {
        await api.put(`/v1/admin/reviews/${route.params.id}/steps`, { steps: steps.value })
      }
      ElMessage.success('更新成功')
    } else {
      const res = await api.post('/v1/admin/reviews', payload)
      const newId = res.data?.data?.id || res.data?.id
      if (newId && steps.value.length > 0) {
        await api.put(`/v1/admin/reviews/${newId}/steps`, { steps: steps.value })
      }
      ElMessage.success('创建成功')
      router.replace(`/reviews/edit/${newId}`)
    }
  } catch (e: any) {
    ElMessage.error(e.response?.data?.message || '保存失败')
  } finally {
    saving.value = false
  }
}

async function publish() {
  if (!isEdit) { await save(); return }
  await api.put(`/v1/admin/reviews/${route.params.id}/status`, { status: 'PUBLISHED' })
  ElMessage.success('已发布')
  form.value.status = 'PUBLISHED'
}

async function archive() {
  await api.put(`/v1/admin/reviews/${route.params.id}/status`, { status: 'ARCHIVED' })
  ElMessage.success('已归档')
  form.value.status = 'ARCHIVED'
}

onMounted(async () => {
  if (isEdit) {
    loading.value = true
    try {
      const [detailRes, stepsRes] = await Promise.all([
        api.get(`/v1/admin/reviews/${route.params.id}`),
        api.get(`/v1/admin/reviews/${route.params.id}/steps`).catch(() => ({ data: { data: [] } })),
      ])
      const data = detailRes.data?.data || detailRes.data
      if (data) {
        Object.assign(form.value, {
          title: data.title, summary: data.summary, content: data.content, slug: data.slug,
          scoreEarnings: Number(data.scoreEarnings), scoreRisk: Number(data.scoreRisk),
          scoreMarketStability: Number(data.scoreMarketStability), scoreDifficulty: Number(data.scoreDifficulty),
          scoreCompliance: Number(data.scoreCompliance),
          incomeMin: data.incomeMin ? Number(data.incomeMin) : null,
          incomeMax: data.incomeMax ? Number(data.incomeMax) : null,
          incomePeriod: data.incomePeriod || 'monthly',
          difficulty: data.difficulty || 'MEDIUM',
          pros: data.pros || [], cons: data.cons || [],
          scamAlerts: data.scamAlerts || [], requirements: data.requirements || [],
          timeCommitment: data.timeCommitment || '', startupCost: data.startupCost ? Number(data.startupCost) : null,
          coverImage: data.coverImage || '', isFeatured: data.isFeatured || false,
          status: data.status || 'DRAFT',
        })
      }
      const stepsData = stepsRes.data?.data || stepsRes.data || []
      steps.value = Array.isArray(stepsData) ? stepsData : []
    } catch { ElMessage.error('加载失败') }
    finally { loading.value = false }
  }
})
</script>

<template>
  <div v-loading="loading">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
      <h2>{{ isEdit ? '编辑评测' : '新建评测' }}</h2>
      <div>
        <el-button @click="router.push('/reviews')">返回列表</el-button>
        <el-button type="success" @click="publish" v-if="isEdit && form.status !== 'PUBLISHED'">发布</el-button>
        <el-button type="warning" @click="archive" v-if="isEdit && form.status === 'PUBLISHED'">归档</el-button>
        <el-button type="primary" :loading="saving" @click="save">保存</el-button>
      </div>
    </div>

    <el-tabs v-model="activeTab">
      <el-tab-pane label="基本信息" name="basic">
        <el-form :model="form" label-width="120px" style="max-width:900px">
          <el-row :gutter="20">
            <el-col :span="16">
              <el-form-item label="标题"><el-input v-model="form.title" placeholder="评测标题" /></el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="Slug"><el-input v-model="form.slug" :disabled="isEdit" placeholder="url标识" /></el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="封面图"><el-input v-model="form.coverImage" placeholder="https://..." /></el-form-item>
          <el-form-item label="摘要"><el-input v-model="form.summary" type="textarea" :rows="3" placeholder="卡片摘要" /></el-form-item>

          <el-divider>收入与难度</el-divider>
          <el-row :gutter="20">
            <el-col :span="6"><el-form-item label="最低月收入"><el-input-number v-model="form.incomeMin" :min="0" style="width:100%" /></el-form-item></el-col>
            <el-col :span="6"><el-form-item label="最高月收入"><el-input-number v-model="form.incomeMax" :min="0" style="width:100%" /></el-form-item></el-col>
            <el-col :span="6"><el-form-item label="难度"><el-select v-model="form.difficulty" style="width:100%"><el-option label="简单" value="EASY" /><el-option label="中等" value="MEDIUM" /><el-option label="困难" value="HARD" /><el-option label="专家" value="EXPERT" /></el-select></el-form-item></el-col>
            <el-col :span="6"><el-form-item label="时间投入"><el-input v-model="form.timeCommitment" placeholder="如: 2-3小时/天" /></el-form-item></el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12"><el-form-item label="启动资金"><el-input-number v-model="form.startupCost" :min="0" style="width:100%" /></el-form-item></el-col>
            <el-col :span="12"><el-form-item label="推荐展示"><el-switch v-model="form.isFeatured" /></el-form-item></el-col>
          </el-row>

          <el-divider>优点</el-divider>
          <el-form-item>
            <el-input v-model="newPros" placeholder="输入优点" style="width:400px" @keyup.enter="addItem(pros, newPros, v => newPros = v)">
              <template #append><el-button @click="addItem(form.pros, newPros, v => newPros = v)">添加</el-button></template>
            </el-input>
          </el-form-item>
          <el-tag v-for="(p, i) in form.pros" :key="i" closable @close="removeItem(form.pros, i)" style="margin:0 8px 8px 0" effect="plain">{{ p }}</el-tag>

          <el-divider>缺点</el-divider>
          <el-form-item>
            <el-input v-model="newCons" placeholder="输入缺点" style="width:400px" @keyup.enter="addItem(form.cons, newCons, v => newCons = v)">
              <template #append><el-button @click="addItem(form.cons, newCons, v => newCons = v)">添加</el-button></template>
            </el-input>
          </el-form-item>
          <el-tag v-for="(c, i) in form.cons" :key="i" closable @close="removeItem(form.cons, i)" type="danger" style="margin:0 8px 8px 0">{{ c }}</el-tag>

          <el-divider>避坑提醒</el-divider>
          <el-form-item>
            <el-input v-model="newScamAlert" placeholder="输入避坑提醒" style="width:400px" @keyup.enter="addItem(form.scamAlerts, newScamAlert, v => newScamAlert = v)">
              <template #append><el-button @click="addItem(form.scamAlerts, newScamAlert, v => newScamAlert = v)">添加</el-button></template>
            </el-input>
          </el-form-item>
          <el-tag v-for="(a, i) in form.scamAlerts" :key="i" closable @close="removeItem(form.scamAlerts, i)" type="warning" style="margin:0 8px 8px 0">{{ a }}</el-tag>

          <el-divider>适合人群</el-divider>
          <el-form-item>
            <el-input v-model="newRequirements" placeholder="输入适合人群" style="width:400px" @keyup.enter="addItem(form.requirements, newRequirements, v => newRequirements = v)">
              <template #append><el-button @click="addItem(form.requirements, newRequirements, v => newRequirements = v)">添加</el-button></template>
            </el-input>
          </el-form-item>
          <el-tag v-for="(r, i) in form.requirements" :key="i" closable @close="removeItem(form.requirements, i)" type="success" style="margin:0 8px 8px 0">{{ r }}</el-tag>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="评分系统" name="scores">
        <el-form label-width="140px" style="max-width:700px">
          <div style="display:flex;gap:40px;margin-bottom:24px">
            <div style="text-align:center">
              <div style="font-size:64px;font-weight:800;color:#07c160">{{ autoScore }}</div>
              <div style="color:#999;font-size:14px">综合评分（自动计算）</div>
            </div>
          </div>
          <el-form-item label="收益潜力（权重25%）">
            <el-slider v-model="form.scoreEarnings" :min="0" :max="10" show-input style="width:400px" />
          </el-form-item>
          <el-form-item label="风险指数（权重20%）">
            <el-slider v-model="form.scoreRisk" :min="0" :max="10" show-input style="width:400px" />
            <div style="color:#999;font-size:12px;margin-left:12px">越高=越危险，综合分自动反转计算</div>
          </el-form-item>
          <el-form-item label="市场稳定性（权重20%）">
            <el-slider v-model="form.scoreMarketStability" :min="0" :max="10" show-input style="width:400px" />
          </el-form-item>
          <el-form-item label="上手难度（权重15%）">
            <el-slider v-model="form.scoreDifficulty" :min="0" :max="10" show-input style="width:400px" />
            <div style="color:#999;font-size:12px;margin-left:12px">越高=越难，综合分自动反转计算</div>
          </el-form-item>
          <el-form-item label="合规安全（权重20%）">
            <el-slider v-model="form.scoreCompliance" :min="0" :max="10" show-input style="width:400px" />
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="操作步骤" name="steps">
        <el-button type="primary" size="small" @click="addStep">+ 添加步骤</el-button>
        <div v-for="(step, idx) in steps" :key="idx" style="margin-top:16px;padding:16px;border:1px solid #e5e7eb;border-radius:8px">
          <div style="display:flex;justify-content:space-between;margin-bottom:8px">
            <strong>步骤 {{ step.stepNumber }}</strong>
            <el-button type="danger" size="small" @click="removeStep(idx)">删除</el-button>
          </div>
          <el-input v-model="step.title" placeholder="步骤标题" style="margin-bottom:8px" />
          <el-input v-model="step.content" type="textarea" :rows="3" placeholder="步骤内容" />
        </div>
        <el-empty v-if="steps.length === 0" description="暂无步骤" />
      </el-tab-pane>

      <el-tab-pane label="详细内容" name="content">
        <el-input v-model="form.content" type="textarea" :rows="20" placeholder="Markdown 格式的详细评测内容..." />
      </el-tab-pane>

      <el-tab-pane label="预览" name="preview">
        <el-card>
          <template #header>
            <span>{{ form.title || '(无标题)' }}</span>
            <el-tag style="margin-left:12px" :type="form.status === 'PUBLISHED' ? 'success' : 'info'">
              {{ form.status === 'PUBLISHED' ? '已发布' : form.status === 'DRAFT' ? '草稿' : '已归档' }}
            </el-tag>
          </template>
          <div v-if="form.coverImage"><el-image :src="form.coverImage" style="width:100%;max-height:300px" fit="cover" /></div>
          <p style="color:#666">{{ form.summary }}</p>
          <el-divider />
          <div style="display:flex;gap:16px;flex-wrap:wrap">
            <el-tag>综合评分: {{ autoScore }}</el-tag>
            <el-tag v-if="form.incomeMin !== null">收入: {{ form.incomeMin }}-{{ form.incomeMax }}元/月</el-tag>
            <el-tag>{{ form.difficulty === 'EASY' ? '简单' : form.difficulty === 'MEDIUM' ? '中等' : '较难' }}</el-tag>
            <el-tag v-if="form.startupCost !== null">启动: ¥{{ form.startupCost }}</el-tag>
          </div>
          <el-divider />
          <div v-if="form.pros.length"><strong>✅ 优点：</strong><p v-for="p in form.pros" :key="p">• {{ p }}</p></div>
          <div v-if="form.cons.length"><strong>⚠️ 缺点：</strong><p v-for="c in form.cons" :key="c">• {{ c }}</p></div>
          <div v-if="steps.length">
            <el-divider /><strong>📝 操作步骤：</strong>
            <div v-for="s in steps" :key="s.stepNumber" style="margin:8px 0">
              <strong>{{ s.stepNumber }}. {{ s.title }}</strong>
              <p style="color:#666">{{ s.content }}</p>
            </div>
          </div>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { ElMessage } from 'element-plus'
</script>
