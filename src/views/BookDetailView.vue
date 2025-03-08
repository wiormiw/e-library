<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getBookById, updateBookCover } from '../services/bookService'
import { getProfile } from '../services/userService'
import { Book } from '../types/book'
import { User } from '../types/user'
import AppCard from '../components/common/AppCard.vue'
import AppButton from '../components/common/AppButton.vue'
import { rentBook } from '../services/rentService'
import { useAuth } from '../composables/useAuth'
import AppModals from '../components/common/AppModals.vue'

export default defineComponent({
  name: 'BookDetailView',
  components: { AppCard, AppButton, AppModals },
  setup() {
    const route = useRoute()
    const bookId = route.params.bookId as string
    const book = ref<Book | null>(null)
    const bookCoverUrl = ref('')
    const user = ref<User | null>(null)
    const imageFile = ref<File | null>(null)
    const error = ref('')
    const success = ref('')
    const isModalVisible = ref(false);
    const modalTitle = ref('');
    const modalMessage = ref('');
    const modalType = ref('success');
    const { hasRole } = useAuth()

    const fetchBook = async () => {
      try {
        book.value = await getBookById(route.params.bookId as string)
      } catch (err: any) {
        error.value = err.message || 'Failed to fetch book.'
      }
    }

    const fetchUserProfile = async () => {
      try {
        user.value = await getProfile()
      } catch (err: any) {
        error.value = err.message || 'Failed to fetch user profile.'
      }
    }

    const handleImageUpload = async () => {
      if (!imageFile.value) {
        error.value = 'Please select an image to upload.'
        return
      }
      try {
        const response = await updateBookCover(bookId, imageFile.value)
        bookCoverUrl.value = response.imageUrl
        if (book.value) {
          book.value.coverUrl = response.imageUrl
        }
        success.value = 'User image updated successfully!'
        error.value = ''
        modalTitle.value = 'Success';
        modalMessage.value = 'Success updating book cover!';
        modalType.value = 'success';
        isModalVisible.value = true;
      } catch (err) {
        error.value = 'Failed to upload image.'
        success.value = ''
        modalTitle.value = 'Error';
        modalMessage.value = 'Failed to update book cover!';
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

    const handleRent = async () => {
      if (!book.value) return
      try {
        await rentBook(book.value.id)
        await fetchUserProfile()
        await fetchBook()
        modalTitle.value = 'Success';
        modalMessage.value = 'Success rent a book!';
        modalType.value = 'success';
        isModalVisible.value = true;
      } catch (err: any) {
        error.value = err.message || 'Failed to rent book.'
        modalTitle.value = 'Error';
        modalMessage.value = 'Failed rent a book!';
        modalType.value = 'Error';
        isModalVisible.value = true;
      }
    }

    onMounted(() => {
      fetchBook()
      if (!hasRole('ROLE_ADMIN')) fetchUserProfile()
    })

    return { book, user, error, hasRole, handleRent, bookCoverUrl, handleImageUpload, handleFileChange, isModalVisible, modalTitle, modalMessage, modalType };
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
      <h1 class="text-2xl font-bold mb-4">Book Details</h1>
      <div v-if="error" class="text-red-500 mb-4">{{ error }}</div>
      <AppButton @click="$router.push('/books/')" variant="secondary">Back to Book List</AppButton>
    </div>
    <AppCard v-if="book" class="p-4">
      <img :src="book.coverUrl" alt="Book Cover" class="w-64 h-96 object-cover mb-4" />
      <h2 class="text-xl font-semibold">{{ book.title }}</h2>
      <p>Quantity: {{ book.quantity }}</p>
      <p>Available: {{ book.availableQuantity }}</p>
      <p>Genres: {{ book.genreIds.join(', ') }}</p>
      <AppButton
        v-if="!hasRole('ROLE_ADMIN') && user && !user.rentingStatus && book.availableQuantity > 0"
        @click="handleRent"
        variant="primary"
        class="mt-4"
      >
        Rent
      </AppButton>
      <div v-if="hasRole('ROLE_ADMIN')">
            <input type="file" accept="image/*" @change="handleFileChange" class="mb-2" />
            <AppButton @click="handleImageUpload" variant="primary">Edit book cover</AppButton>
      </div>
    </AppCard>
    <div v-else class="text-gray-500">Loading...</div>
  </div>
</template>