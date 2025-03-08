<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { getCurrentRent, getUserRentHistory, returnBook, getAllActiveRents, getAllRentHistory } from '../services/rentService'
import { Rent, AdminRent } from '../types/rent'
import AppCard from '../components/common/AppCard.vue'
import AppButton from '../components/common/AppButton.vue'
import { useAuth } from '../composables/useAuth'
import AppModals from '../components/common/AppModals.vue'

export default defineComponent({
  name: 'BorrowingView',
  components: { AppCard, AppButton, AppModals },
  setup() {
    const currentRent = ref<Rent | null>(null)
    const rentHistory = ref<Rent[]>([])
    const activeRents = ref<AdminRent[]>([])
    const error = ref('')
    const isModalVisible = ref(false)
    const modalTitle = ref('')
    const modalMessage = ref('')
    const modalType = ref('success')
    const { hasRole } = useAuth()

    const fetchUserRentData = async () => {
      try {
        console.log('Fetching current rent...')
        currentRent.value = await getCurrentRent()
        console.log('Current rent:', currentRent.value)
      } catch (err: any) {
        console.log('Full error object:', JSON.stringify(err, null, 2)) // Log the entire error object
        console.log('Response status:', err.response?.status)
        console.log('Response data:', err.response?.data)

        error.value = err.response?.data?.message || err.response?.data || err.message || 'Failed to fetch current rent data.'
        console.error('Unexpected fetch error:', err.response?.status, err.response?.data)
        modalTitle.value = 'INFO'
        modalMessage.value = 'You currently not renting anything OR you just successfully return the book, go get another one! :)'
        modalType.value = 'success'
        isModalVisible.value = true
      }
    }

    const fetchAdminRentData = async () => {
      try {
        console.log('Fetching admin rent data...')
        activeRents.value = await getAllActiveRents()
      } catch (err: any) {
        error.value = err.response?.data?.message || err.message || 'Failed to fetch admin rent data.'
        console.error('Admin fetch error:', err.response?.status, err.response?.data)
        modalTitle.value = 'Error'
        modalMessage.value = error.value
        modalType.value = 'error'
        isModalVisible.value = true
      }
    }

    const fetchUserHistory = async () => {
      try {
        console.log('Fetching rent history...')
        if (hasRole('ROLE_ADMIN')) {
          rentHistory.value = await getAllRentHistory()
        } else {
          rentHistory.value = await getUserRentHistory()
        }
        console.log('Rent history:', rentHistory.value)
      } catch (err: any) {
        error.value = err.response?.data?.message || err.message || 'Failed to fetch rent history.'
        console.error('History fetch error:', err.response?.status, err.response?.data)
        modalTitle.value = 'Error'
        modalMessage.value = error.value
        modalType.value = 'error'
        isModalVisible.value = true
      }
    }

    const handleReturn = async () => {
      if (!currentRent.value) return
      try {
        console.log('Returning book with rent ID:', currentRent.value.id)
        await returnBook(currentRent.value.id)
        console.log('Book returned successfully')
        await fetchUserRentData() // This will handle the 404 and show the no-rent modal
        await fetchUserHistory()
      } catch (err: any) {
        error.value = err.response?.data?.message || err.message || 'Failed to return book.'
        console.error('Return error:', err.response?.status, err.response?.data)
        modalTitle.value = 'Error'
        modalMessage.value = error.value
        modalType.value = 'error'
        isModalVisible.value = true
      }
    }

    onMounted(() => {
      if (hasRole('ROLE_ADMIN')) {
        fetchAdminRentData()
      } else {
        fetchUserRentData()
      }
      fetchUserHistory()
    })

    return {
      currentRent,
      rentHistory,
      activeRents,
      error,
      hasRole,
      handleReturn,
      isModalVisible,
      modalTitle,
      modalMessage,
      modalType,
    }
  },
})
</script>

<template>
  <AppModals
    :isVisible="isModalVisible"
    @update:isVisible="isModalVisible = $event"
    :title="modalTitle"
    :message="modalMessage"
    :type="modalType"
  />
  <div>
    <h1 class="text-2xl font-bold mb-4">Borrowing</h1>
    <div v-if="currentRent === null">
      <div class="text-gray-500 mb-6">No active rent.</div>
    </div>

    <!-- User View -->
    <div v-if="!hasRole('ROLE_ADMIN')">
      <AppCard v-if="currentRent" class="p-4 mb-6">
        <h2 class="text-xl font-semibold">Current Rent</h2>
        <p>Book: {{ currentRent.bookName }}</p>
        <p>Start Date: {{ currentRent.startDate }}</p>
        <p>Deadline: {{ currentRent.deadline }}</p>
        <AppButton @click="handleReturn" variant="primary" class="mt-4">Return</AppButton>
      </AppCard>

      <h2 class="text-xl font-semibold mb-2">Rent History</h2>
      <table class="w-full border-collapse">
        <thead>
          <tr class="bg-gray-200">
            <th class="p-2">Book</th>
            <th class="p-2">Start Date</th>
            <th class="p-2">End Date</th>
            <th class="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="rent in rentHistory" :key="rent.id" class="border-b">
            <td class="p-2">{{ rent.bookName }}</td>
            <td class="p-2">{{ rent.startDate }}</td>
            <td class="p-2">{{ rent.endDate || 'N/A' }}</td>
            <td class="p-2">{{ rent.rentStatus }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Admin View -->
    <div v-else>
      <h2 class="text-xl font-semibold mb-2">Active Rents</h2>
      <table class="w-full border-collapse mb-6">
        <thead>
          <tr class="bg-gray-200">
            <th class="p-2">Rent ID</th>
            <th class="p-2">User ID</th>
            <th class="p-2">Book ID</th>
            <th class="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="rent in activeRents" :key="rent.id" class="border-b">
            <td class="p-2">{{ rent.id }}</td>
            <td class="p-2">{{ rent.userId }}</td>
            <td class="p-2">{{ rent.bookId }}</td>
            <td class="p-2">{{ rent.status }}</td>
          </tr>
        </tbody>
      </table>

      <h2 class="text-xl font-semibold mb-2">All Rent History</h2>
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
          <tr v-for="rent in rentHistory" :key="rent.id" class="border-b">
            <td class="p-2">{{ rent.bookName }}</td>
            <td class="p-2">{{ rent.rentedBy }}</td>
            <td class="p-2">{{ rent.startDate }}</td>
            <td class="p-2">{{ rent.endDate || 'N/A' }}</td>
            <td class="p-2">{{ rent.rentStatus }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>