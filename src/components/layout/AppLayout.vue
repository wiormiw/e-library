<script lang="ts">
import { defineComponent } from 'vue'
import AppNavbar from './AppNavbar.vue'
import AppSidebar from './AppSidebar.vue'

export default defineComponent({
  name: 'AppLayout',
  components: { AppNavbar, AppSidebar },
})
</script>

<template>
  <div class="flex">
    <AppSidebar />
    <div class="flex-1 ml-64">
      <AppNavbar />
      <main class="p-6 mt-16">
        <router-view />
      </main>
    </div>
  </div>
</template>