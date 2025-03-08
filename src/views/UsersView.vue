<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { getUsers, getUserCount, getUserByEmail } from '../services/userService'
import { PaginatedResponse, User } from '../types/user'
import AppCard from '../components/common/AppCard.vue'
import AppTable from '../components/common/AppTable.vue'
import AppButton from '../components/common/AppButton.vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'UsersView',
  components: { AppCard, AppTable, AppButton },
  setup() {
    const router = useRouter()
    const users = ref<User[]>([])
    const totalUsers = ref(0)
    const page = ref(0)
    const size = ref(2)
    const search = ref('')
    const totalPages = ref(0)
    const error = ref('')
    const emailError = ref('')

    const headers = ['ID', 'Email', 'Renting Status', 'Actions']

    const fetchUsers = async () => {
      try {
        const response: PaginatedResponse<User> = await getUsers(page.value, size.value, search.value)
        users.value = response.content
        totalPages.value = response.totalPages
      } catch (err) {
        error.value = 'Failed to fetch users.'
      }
    }

    const fetchUserCount = async () => {
      try {
        totalUsers.value = await getUserCount()
      } catch (err) {
        error.value = 'Failed to fetch user count.'
      }
    }

    const handleSearch = () => {
      page.value = 0
      fetchUsers()
    }

    const goToPage = (newPage: number) => {
      if (newPage >= 0 && newPage < totalPages.value) {
        page.value = newPage
        fetchUsers()
      }
    }

    const viewUser = (userId: string) => {
      router.push(`/users/${userId}`)
    }

    onMounted(() => {
      fetchUsers()
      fetchUserCount()
    })

    return {
      users,
      totalUsers,
      page,
      size,
      search,
      totalPages,
      error,
      emailError,
      headers,
      handleSearch,
      goToPage,
      viewUser,
    }
  },
})
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Manage Users</h1>
    <AppCard>
      <div class="mb-4">
        <p>Total Users: {{ totalUsers }}</p>
      </div>
      <div class="mb-4 flex space-x-4">
        <input
          v-model="search"
          type="text"
          placeholder="Search users..."
          class="px-3 py-2 border rounded"
        />
        <AppButton @click="handleSearch" variant="primary">Search</AppButton>
      </div>
      <div v-if="error" class="text-red-500 mb-4">{{ error }}</div>
      <div v-if="emailError" class="text-red-500 mb-4">{{ emailError }}</div>
      <AppTable :headers="headers" :items="users">
        <template #default="{ item }">
          <td class="px-4 py-2 border">{{ item.id }}</td>
          <td class="px-4 py-2 border">{{ item.email }}</td>
          <td class="px-4 py-2 border">{{ item.rentingStatus ? 'Yes' : 'No' }}</td>
          <td class="px-4 py-2 border">
            <AppButton @click="viewUser(item.id)" variant="primary">View</AppButton>
          </td>
        </template>
      </AppTable>
      <div class="mt-4 flex justify-between">
        <AppButton :disabled="page === 0" @click="goToPage(page - 1)">Previous</AppButton>
        <span>Page {{ page + 1 }} of {{ totalPages }}</span>
        <AppButton :disabled="page + 1 === totalPages" @click="goToPage(page + 1)">Next</AppButton>
      </div>
    </AppCard>
  </div>
</template>