<script lang="ts">
import { defineComponent } from 'vue'
import { useAuth } from '../../composables/useAuth'

export default defineComponent({
  name: 'AppSidebar',
  setup() {
    const { hasRole } = useAuth()

    const menuItems = [
      { name: 'Dashboard', path: '/' },
      { name: 'Books', path: '/books' },
      { name: 'Borrowing', path: '/borrowing' },
      { name: 'Profile', path: '/profile' },
      ...(hasRole('ROLE_ADMIN') ? [{ name: 'Users', path: '/users' }] : []),
    ]

    return { menuItems }
  },
})
</script>

<template>
  <aside class="w-64 bg-gray-800 text-white h-screen fixed top-0 left-0">
    <div class="p-4">
      <h1 class="text-2xl font-bold">E-Library</h1>
    </div>
    <nav class="mt-6">
      <ul>
        <li v-for="item in menuItems" :key="item.path" class="mb-2">
          <router-link
            :to="item.path"
            class="block px-4 py-2 hover:bg-gray-700 rounded"
            active-class="bg-gray-700"
          >
            {{ item.name }}
          </router-link>
        </li>
      </ul>
    </nav>
  </aside>
</template>