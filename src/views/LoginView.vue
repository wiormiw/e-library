<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../services/authService'
import { useAuth } from '../composables/useAuth'
import AppModals from '../components/common/AppModals.vue'

export default defineComponent({
  name: 'LoginView',
  setup() {
    const router = useRouter()
    const { setAuthData, hasRole } = useAuth()
    const email = ref('')
    const password = ref('')
    const error = ref('')
    const isModalVisible = ref(false);
    const modalTitle = ref('');
    const modalMessage = ref('');
    const modalType = ref('success');

    const handleLogin = async () => {
    try {
        const response = await login({
        email: email.value,
        password: password.value,
        })
        setAuthData(response.token)
        useAuth
        if (hasRole('ROLE_ADMIN')) {
            router.push('/admin')
        } else {
            router.push('/')
        }
    } catch (err) {
        error.value = 'Login failed. Please check your credentials.'
        modalTitle.value = 'Error';
        modalMessage.value = 'Login Failed. Please check your credentials!';
        modalType.value = 'Error';
        isModalVisible.value = true;
    }
    }

    return { email, password, error, handleLogin, isModalVisible, modalTitle, modalMessage, modalType }
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
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
      <h1 class="text-2xl font-bold mb-4">Login</h1>
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label class="block text-gray-700">Email</label>
          <input v-model="email" type="email" class="w-full px-3 py-2 border rounded" required />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700">Password</label>
          <input v-model="password" type="password" class="w-full px-3 py-2 border rounded" required />
        </div>
        <button type="submit" class="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Login
        </button>
      </form>
      <p class="mt-4 text-center">
        Don't have an account? <router-link to="/register" class="text-blue-500">Register</router-link>
      </p>
    </div>
  </div>
</template>