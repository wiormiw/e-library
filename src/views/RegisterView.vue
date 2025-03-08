<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '../services/authService'

export default defineComponent({
  name: 'RegisterView',
  setup() {
    const router = useRouter()
    const email = ref('')
    const password = ref('')
    const fullName = ref('')
    const address = ref('')
    const phoneNumber = ref('')
    const error = ref('')

    const handleRegister = async () => {
      try {
        await register({
          email: email.value,
          password: password.value,
          fullName: fullName.value,
          address: address.value,
          phoneNumber: phoneNumber.value,
        })
        router.push('/login')
      } catch (err) {
        error.value = 'Registration failed. Please try again.'
      }
    }

    return { email, password, fullName, address, phoneNumber, error, handleRegister }
  },
})
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
      <h1 class="text-2xl font-bold mb-4">Register</h1>
      <form @submit.prevent="handleRegister">
        <div class="mb-4">
          <label class="block text-gray-700">Email</label>
          <input v-model="email" type="email" class="w-full px-3 py-2 border rounded" required />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Password</label>
          <input v-model="password" type="password" class="w-full px-3 py-2 border rounded" required />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Full Name</label>
          <input v-model="fullName" type="text" class="w-full px-3 py-2 border rounded" required />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Address</label>
          <input v-model="address" type="text" class="w-full px-3 py-2 border rounded" required />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Phone Number</label>
          <input v-model="phoneNumber" type="text" class="w-full px-3 py-2 border rounded" required />
        </div>
        <div v-if="error" class="text-red-500 mb-4">{{ error }}</div>
        <button type="submit" class="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Register
        </button>
      </form>
      <p class="mt-4 text-center">
        Already have an account? <router-link to="/login" class="text-blue-500">Login</router-link>
      </p>
    </div>
  </div>
</template>