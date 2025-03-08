<template>
    <div v-if="isVisible" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-6 rounded-lg shadow-lg">
        <h2 class="text-xl font-semibold" :class="messageClass">{{ title }}</h2>
        <p>{{ message }}</p>
        <button @click="closeModal" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">OK</button>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, computed } from 'vue';
  
  export default defineComponent({
    name: 'AppModals',
    props: {
      isVisible: {
        type: Boolean,
        required: true
      },
      title: {
        type: String,
        default: ''
      },
      message: {
        type: String,
        default: ''
      },
      type: {
        type: String,
        default: 'success'
      }
    },
    emits: ['update:isVisible'],
    setup(props, { emit }) {
      const closeModal = () => {
        emit('update:isVisible', false); // Emit to close the modal
      };
  
      // Dynamic class for success or error styling
      const messageClass = computed(() => {
        return props.type === 'success' ? 'text-green-500' : 'text-red-500';
      });
  
      return { closeModal, messageClass };
    }
  });
  </script>
  