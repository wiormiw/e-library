<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppCard',
})
</script>

<template>
  <div class="bg-white shadow-md rounded-lg p-6">
    <slot />
  </div>
</template>