<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

const api = axios.create({
  baseURL: '',
  headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` },
})

const scams = ref<any[]>([])
const loading = ref(false)
const filterStatus = ref('PENDING')
const detailVisible = ref(false)
const selectedScam = ref<any>(null)
const preventionTips = ref('')

const severityColors: Record<string, string> = { LOW: '#67c23a', MEDIUM: '#e6a23c', HIGH: '#f56c6c', CRITICAL: '#b91c1c' }
const severityLabels: Record<string, string> = { LOW: '低', MEDIUM: '中', HIGH: '高', CRITICAL: '严重' }
const statusLabels: Record<string, string> = { PENDING: '待审核', VERIFIED: '已核实', DISMISSED: '已驳回' }

async function load() {
  loading.value = true
  try {
    const res = await api.get('/v1/admin/scams', { params: { status: filterStatus.value, pageSize: 50 } })
    scams.value = res.data?.data?.data || res.data?.data || res.data || []
  } catch {}
  finally { loading.value = false }
}

function openDetail(scam: any) {
  selectedScam.value = scam
  preventionTips.value = scam.preventionTips || ''
  detailVisible.value = true
}

async function verify(id: string, tips: string) {
  await api.put(`/v1/admin/scams/${id}/status`, { status: 'VERIFIED', preventionTips: tips })
  ElMessage.success('已核实通过')
  detailVisible.value = false
  load()
}

async function dismiss(id: string) {
  await api.put(`/v1/admin/scams/${id}/status`, { status: 'DISMISSED' })
  ElMessage.success('已驳回')
  detailVisible.value = false
  load()
}

onMounted(() => load())
</script>

<template>
  <div>
    <div style="display:flex;justify-content:space-between;margin-bottom:20px">
      <h2>骗局审核</h2>
      <el-radio-group v-model="filterStatus" @change="load">
        <el-radio-button value="PENDING">待审核</el-radio-button>
        <el-radio-button value="VERIFIED">已核实</el-radio-button>
        <el-radio-button value="DISMISSED">已驳回</el-radio-button>
        <el-radio-button value="">全部</el-radio-button>
      </el-radio-group>
    </div>

    <el-table :data="scams" v-loading="loading" stripe>
      <el-table-column prop="title" label="标题" min-width="200" />
      <el-table-column prop="scamType" label="类型" width="100" />
      <el-table-column label="严重程度" width="80">
        <template #default="{ row }">
          <el-tag :color="severityColors[row.severity]" style="color:#fff">
            {{ severityLabels[row.severity] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="targetPlatform" label="平台" width="120" />
      <el-table-column label="状态" width="80">
        <template #default="{ row }">{{ statusLabels[row.status] }}</template>
      </el-table-column>
      <el-table-column prop="createdAt" label="提交时间" width="170" />
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button size="small" @click="openDetail(row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Detail dialog -->
    <el-dialog v-model="detailVisible" :title="selectedScam?.title" width="600px">
      <template v-if="selectedScam">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="类型">{{ selectedScam.scamType }}</el-descriptions-item>
          <el-descriptions-item label="严重程度">
            <el-tag :color="severityColors[selectedScam.severity]" style="color:#fff">
              {{ severityLabels[selectedScam.severity] }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="平台">{{ selectedScam.targetPlatform || '-' }}</el-descriptions-item>
          <el-descriptions-item label="提交时间">{{ selectedScam.createdAt }}</el-descriptions-item>
          <el-descriptions-item label="描述" :span="2">
            <p style="white-space:pre-wrap">{{ selectedScam.description }}</p>
          </el-descriptions-item>
        </el-descriptions>

        <el-divider>审核操作</el-divider>
        <el-form>
          <el-form-item label="防骗建议">
            <el-input v-model="preventionTips" type="textarea" :rows="3" placeholder="添加防骗建议（选填）" />
          </el-form-item>
          <div style="display:flex;gap:12px">
            <el-button type="danger" @click="dismiss(selectedScam.id)">驳回（不实信息）</el-button>
            <el-button type="success" @click="verify(selectedScam.id, preventionTips)">核实通过</el-button>
          </div>
        </el-form>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { ElMessage } from 'element-plus'
</script>
