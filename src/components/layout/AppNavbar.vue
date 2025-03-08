<script lang="ts">
import { defineComponent } from 'vue'
import { useAuth } from '../../composables/useAuth'

export default defineComponent({
  name: 'AppNavbar',
  setup() {
    const { userRoles, clearAuthData } = useAuth()

    return { userRoles, clearAuthData }
  },
})
</script>

<template>
  <header class="bg-gray-900 text-white p-4 flex justify-between items-center fixed top-0 left-64 right-0">
    <h2 class="text-lg">Dashboard</h2>
    <div class="flex items-center">
      <span class="mr-4">Roles: {{ userRoles.join(', ') || 'Guest' }}</span>
      <button class="bg-red-500 px-4 py-2 rounded hover:bg-red-600" @click="clearAuthData">Logout</button>
    </div>
  </header>
</template>