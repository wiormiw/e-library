<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getUserById, updateUser, uploadUserImage } from '../services/userService'
import { User, UpdateProfileRequest } from '../types/user'
import AppCard from '../components/common/AppCard.vue'
import AppButton from '../components/common/AppButton.vue'
import AppModals from '../components/common/AppModals.vue'

export default defineComponent({
  name: 'UserDetailView',
  components: { AppCard, AppButton, AppModals },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const userId = route.params.userId as string
    const user = ref<User | null>(null)
    const fullName = ref('')
    const address = ref('')
    const phoneNumber = ref('')
    const password = ref('')
    const imageFile = ref<File | null>(null)
    const error = ref('')
    const success = ref('')
    const profileImageUrl = ref('')
    const isModalVisible = ref(false);
    const modalTitle = ref('');
    const modalMessage = ref('');
    const modalType = ref('success');

    const fetchUser = async () => {
      try {
        const response = await getUserById(userId)
        user.value = response
        fullName.value = response.profile?.fullName || ''
        address.value = response.profile?.address || ''
        phoneNumber.value = response.profile?.phoneNumber || ''
        profileImageUrl.value = response.profile?.profileUrl || ''
      } catch (err) {
        error.value = 'Failed to fetch user.'
      }
    }

    const handleUpdateUser = async () => {
      try {
        const updateData: UpdateProfileRequest = {
          fullName: fullName.value,
          address: address.value,
          phoneNumber: phoneNumber.value,
        }
        if (password.value) {
          updateData.password = password.value
        }
        const updatedUser = await updateUser(userId, updateData)
        user.value = updatedUser
        success.value = 'User updated successfully!'
        error.value = ''
        modalTitle.value = 'Success';
        modalMessage.value = 'Success updating a user!';
        modalType.value = 'success';
        isModalVisible.value = true;
      } catch (err) {
        error.value = 'Failed to update user.'
        success.value = ''
        modalTitle.value = 'Error';
        modalMessage.value = 'Failed updating a user!';
        modalType.value = 'Error';
        isModalVisible.value = true;
      }
    }

    const handleImageUpload = async () => {
      if (!imageFile.value) {
        error.value = 'Please select an image to upload.'
        return
      }
      try {
        const response = await uploadUserImage(userId, imageFile.value)
        profileImageUrl.value = response.imageUrl
        if (user.value && user.value.profile) {
          user.value.profile.profileUrl = response.imageUrl
        }
        success.value = 'User image updated successfully!'
        error.value = ''
        modalTitle.value = 'Success';
        modalMessage.value = 'Success updating profile image!';
        modalType.value = 'success';
        isModalVisible.value = true;
      } catch (err) {
        error.value = 'Failed to upload image.'
        success.value = ''
        modalTitle.value = 'Error';
        modalMessage.value = 'Failed to update profile image!';
        modalType.value = 'Error';
        isModalVisible.value = true;
      }
    }

    const handleFileChange = (event: Event) => {
      const target = event.target as HTMLInputElement
      if (target.files && target.files.length > 0) {
        imageFile.value = target.files[0]
      }
    }

    onMounted(fetchUser)

    return {
      user,
      fullName,
      address,
      phoneNumber,
      password,
      error,
      success,
      profileImageUrl,
      handleUpdateUser,
      handleImageUpload,
      handleFileChange,
      isModalVisible,
      modalTitle,
      modalMessage,
      modalType
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
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">User Details</h1>
      <AppButton @click="$router.push('/users')" variant="secondary">Back to Users</AppButton>
    </div>
    <AppCard>
      <div v-if="user" class="space-y-6">
        <!-- Display Profile Image -->
        <div class="flex items-center space-x-4">
          <img
            v-if="profileImageUrl"
            :src="profileImageUrl"
            alt="Profile Image"
            class="w-24 h-24 rounded-full object-cover"
          />
          <div v-else class="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
            <span class="text-gray-500">No Image</span>
          </div>
          <div>
            <input type="file" accept="image/*" @change="handleFileChange" class="mb-2" />
            <AppButton @click="handleImageUpload" variant="primary">Upload Image</AppButton>
          </div>
        </div>

        <!-- User Information -->
        <div class="space-y-4">
          <div>
            <label class="block text-gray-700">Email</label>
            <input
              type="text"
              :value="user.email"
              class="w-full px-3 py-2 border rounded bg-gray-100"
              disabled
            />
          </div>
          <div>
            <label class="block text-gray-700">Full Name</label>
            <input
              v-model="fullName"
              type="text"
              class="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div>
            <label class="block text-gray-700">Address</label>
            <input
              v-model="address"
              type="text"
              class="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div>
            <label class="block text-gray-700">Phone Number</label>
            <input
              v-model="phoneNumber"
              type="text"
              class="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div>
            <label class="block text-gray-700">New Password (optional)</label>
            <input
              v-model="password"
              type="password"
              class="w-full px-3 py-2 border rounded"
              placeholder="Leave blank to keep current password"
            />
          </div>
        </div>

        <!-- Messages -->
        <div v-if="error" class="text-red-500">{{ error }}</div>
        <div v-if="success" class="text-green-500">{{ success }}</div>

        <!-- Update Button -->
        <AppButton @click="handleUpdateUser" variant="primary">Update User</AppButton>
      </div>
      <div v-else class="text-gray-500">Loading...</div>
    </AppCard>
  </div>
</template>