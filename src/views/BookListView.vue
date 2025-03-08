<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { getBooks, getGenres, createBook, deleteBook } from '../services/bookService'
import { getProfile } from '../services/userService'
import { Book, PaginatedBooks, Genre } from '../types/book'
import { User } from '../types/user'
import { useAuth } from '../composables/useAuth'
import AppCard from '../components/common/AppCard.vue'
import AppButton from '../components/common/AppButton.vue'
import { rentBook } from '../services/rentService'
import { useRouter } from 'vue-router'
import AppModals from '../components/common/AppModals.vue'

export default defineComponent({
  name: 'BookListView',
  components: { AppCard, AppButton, AppModals },
  setup() {
    const books = ref<Book[]>([])
    const genres = ref<Genre[]>([])
    const user = ref<User | null>(null)
    const error = ref('')
    const isModalVisible = ref(false);
    const modalTitle = ref('');
    const modalMessage = ref('');
    const modalType = ref('success');
    const { hasRole } = useAuth()
    const router = useRouter()
    const newBook = ref({
      title: '',
      quantity: 0,
      availableQuantity: 0,
      coverUrl: '',
      genreIds: [] as string[], // Array for selected genre IDs
    })

    const fetchBooks = async () => {
      try {
        const response: PaginatedBooks = await getBooks()
        books.value = response.content
      } catch (err: any) {
        error.value = err.message || 'Failed to fetch books.'
      }
    }

    const fetchGenres = async () => {
      try {
        genres.value = await getGenres()
      } catch (err: any) {
        error.value = err.message || 'Failed to fetch genres.'
      }
    }

    const fetchUserProfile = async () => {
      try {
        user.value = await getProfile()
      } catch (err: any) {
        error.value = err.message || 'Failed to fetch user profile.'
      }
    }

    const handleRent = async (bookId: string) => {
      try {
        await rentBook(bookId)
        await fetchUserProfile()
        await fetchBooks()
      } catch (err: any) {
        error.value = err.message || 'Failed to rent book.'
      }
    }

    const goToDetails = (bookId: string) => {
      router.push(`/books/detail/${bookId}`)
    }

    const handleCreateBook = async () => {
      try {
        const bookData = {
          title: newBook.value.title,
          quantity: newBook.value.quantity,
          availableQuantity: newBook.value.quantity, // Match quantity initially
          coverUrl: newBook.value.coverUrl,
          genreIds: newBook.value.genreIds, // Already an array
        }
        await createBook(bookData)
        await fetchBooks()
        modalTitle.value = 'Success';
        modalMessage.value = 'Success create a book!';
        modalType.value = 'success';
        isModalVisible.value = true;
        newBook.value = { title: '', quantity: 0, availableQuantity: 0, coverUrl: '', genreIds: [] }
      } catch (err: any) {
        error.value = err.message || 'Failed to create book.'
        modalTitle.value = 'Error';
        modalMessage.value = 'Failed to create a book!';
        modalType.value = 'Error';
        isModalVisible.value = true;
      }
    }

    const handleDeleteBook = async (bookId: string) => {
      try {
        await deleteBook(bookId)
        await fetchBooks()
        modalTitle.value = 'Success';
        modalMessage.value = 'Success delete a book!';
        modalType.value = 'success';
        isModalVisible.value = true;
      } catch (err: any) {
        error.value = err.message || 'Failed to delete book.'
        modalTitle.value = 'Error';
        modalMessage.value = 'Failed to delete a book!';
        modalType.value = 'Error';
        isModalVisible.value = true;
      }
    }

    onMounted(() => {
      fetchBooks()
      if (hasRole('ROLE_ADMIN')) fetchGenres() // Fetch genres for admins
      else fetchUserProfile()
    })

    return {
      books,
      genres,
      user,
      error,
      hasRole,
      handleRent,
      goToDetails,
      newBook,
      handleCreateBook,
      handleDeleteBook,
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
    <h1 class="text-2xl font-bold mb-4">Books</h1>
    <div v-if="error" class="text-red-500 mb-4">{{ error }}</div>

    <!-- Admin CRUD Interface -->
    <div v-if="hasRole('ROLE_ADMIN')" class="mb-6">
      <h2 class="text-xl mb-2">Add New Book</h2>
      <div class="space-y-2">
        <input v-model="newBook.title" placeholder="Title" class="w-full px-3 py-2 border rounded" />
        <input
          v-model.number="newBook.quantity"
          type="number"
          placeholder="Quantity"
          class="w-full px-3 py-2 border rounded"
        />
        <input class="w-full px-3 py-2 border rounded" disabled="true" placeholder="Update the image separately!" />
        <select
          v-model="newBook.genreIds"
          multiple
          class="w-full px-3 py-2 border rounded h-24"
        >
          <option v-for="genre in genres" :key="genre.id" :value="genre.id">
            {{ genre.name }}
          </option>
        </select>
        <AppButton @click="handleCreateBook" variant="primary">Create Book</AppButton>
      </div>
    </div>

    <!-- Book List -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <AppCard v-for="book in books" :key="book.id" class="p-4">
        <img :src="book.coverUrl" alt="Book Cover" class="w-full h-48 object-cover mb-2" />
        <h2 class="text-lg font-semibold">{{ book.title }}</h2>
        <p>Available: {{ book.availableQuantity }} / {{ book.quantity }}</p>
        <div class="mt-2 flex space-x-2">
          <AppButton @click="goToDetails(book.id)" variant="secondary">Details</AppButton>
          <AppButton
            v-if="!hasRole('ROLE_ADMIN') && user && !user.rentingStatus && book.availableQuantity > 0"
            @click="handleRent(book.id)"
            variant="primary"
          >
            Rent
          </AppButton>
          <AppButton v-if="hasRole('ROLE_ADMIN')" @click="handleDeleteBook(book.id)" variant="danger">
            Delete
          </AppButton>
        </div>
      </AppCard>
    </div>
  </div>
</template>