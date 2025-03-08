<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { getRecentRentHistory, getActiveRentCount } from '../services/rentService'
import { getBookCount } from '../services/bookService'
import { Rent } from '../types/rent'
import AppCard from '../components/common/AppCard.vue'

export default defineComponent({
  name: 'AdminDashboardView',
  components: { AppCard },
  setup() {
    const recentHistory = ref<Rent[]>([])
    const bookCount = ref(0)
    const activeRentCount = ref(0)
    const error = ref('')

    const fetchDashboardData = async () => {
      try {
        recentHistory.value = await getRecentRentHistory(2)
        bookCount.value = await getBookCount()
        activeRentCount.value = await getActiveRentCount()
      } catch (err: any) {
        error.value = err.message || 'Failed to fetch dashboard data.'
      }
    }

    onMounted(() => {
      fetchDashboardData()
    })

    return { recentHistory, bookCount, activeRentCount, error }
  },
})
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Admin Dashboard</h1>
    <div v-if="error" class="text-red-500 mb-4">{{ error }}</div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <AppCard class="p-4">
        <h2 class="text-lg font-semibold">Total Books</h2>
        <p class="text-2xl">{{ bookCount }}</p>
      </AppCard>
      <AppCard class="p-4">
        <h2 class="text-lg font-semibold">Active Rents</h2>
        <p class="text-2xl">{{ activeRentCount }}</p>
      </AppCard>
    </div>

    <h2 class="text-xl font-semibold mb-2">Recent Rent History</h2>
    <AppCard class="p-4">
      <table class="w-full border-collapse">
        <thead>
          <tr class="bg-gray-200">
            <th class="p-2">Book</th>
            <th class="p-2">Rented By</th>
            <th class="p-2">Start Date</th>
            <th class="p-2">End Date</th>
            <th class="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="rent in recentHistory" :key="rent.id" class="border-b">
            <td class="p-2">{{ rent.bookName }}</td>
            <td class="p-2">{{ rent.rentedBy }}</td>
            <td class="p-2">{{ rent.startDate }}</td>
            <td class="p-2">{{ rent.endDate || 'N/A' }}</td>
            <td class="p-2">{{ rent.rentStatus }}</td>
          </tr>
        </tbody>
      </table>
    </AppCard>
  </div>
</template>