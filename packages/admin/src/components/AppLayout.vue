<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const collapsed = ref(false)

const menuItems = [
  { path: '/dashboard', label: '数据看板', icon: 'Odometer' },
  { path: '/reviews', label: '评测管理', icon: 'Document' },
  { path: '/articles', label: '资讯管理', icon: 'Notebook' },
  { path: '/guides', label: '指南管理', icon: 'Reading' },
  { path: '/hustles', label: '副业库', icon: 'List' },
  { path: '/scams', label: '骗局审核', icon: 'Warning' },
  { path: '/community', label: '社区管理', icon: 'ChatDotSquare' },
  { path: '/banners', label: '横幅管理', icon: 'Picture' },
  { path: '/users', label: '用户管理', icon: 'User' },
  { path: '/categories', label: '系统设置', icon: 'Setting' },
]

function logout() {
  localStorage.removeItem('admin_token')
  router.push('/login')
}
</script>

<template>
  <el-container style="min-height: 100vh">
    <el-aside :width="collapsed ? '64px' : '220px'">
      <el-menu router :collapse="collapsed" style="height: 100%">
        <el-menu-item index="/dashboard">
          <el-icon><Odometer /></el-icon>
          <template #title>数据看板</template>
        </el-menu-item>
        <el-menu-item index="/reviews">
          <el-icon><Document /></el-icon>
          <template #title>评测管理</template>
        </el-menu-item>
        <el-menu-item index="/articles">
          <el-icon><Notebook /></el-icon>
          <template #title>资讯管理</template>
        </el-menu-item>
        <el-menu-item index="/guides">
          <el-icon><Reading /></el-icon>
          <template #title>指南管理</template>
        </el-menu-item>
        <el-menu-item index="/hustles">
          <el-icon><List /></el-icon>
          <template #title>副业库</template>
        </el-menu-item>
        <el-menu-item index="/scams">
          <el-icon><Warning /></el-icon>
          <template #title>骗局审核</template>
        </el-menu-item>
        <el-menu-item index="/community">
          <el-icon><ChatDotSquare /></el-icon>
          <template #title>社区管理</template>
        </el-menu-item>
        <el-menu-item index="/banners">
          <el-icon><Picture /></el-icon>
          <template #title>横幅管理</template>
        </el-menu-item>
        <el-menu-item index="/users">
          <el-icon><User /></el-icon>
          <template #title>用户管理</template>
        </el-menu-item>
        <el-menu-item index="/categories">
          <el-icon><Setting /></el-icon>
          <template #title>系统设置</template>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header style="display: flex; align-items: center; justify-content: space-between; padding: 0 20px">
        <el-button @click="collapsed = !collapsed" type="text">
          {{ collapsed ? '⟩⟩' : '⟨⟨' }}
        </el-button>
        <el-button @click="logout" type="text">退出登录</el-button>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>
