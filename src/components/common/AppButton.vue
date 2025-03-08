<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppButton',
  props: {
    type: { type: String, default: 'button' },
    variant: { type: String, default: 'primary' },
    disabled: { type: Boolean, default: false },
  },
  computed: {
    buttonClass(): string {
      const base = 'px-4 py-2 rounded font-semibold'
      if (this.variant === 'primary') return `${base} bg-blue-500 text-white hover:bg-blue-600`
      if (this.variant === 'secondary') return `${base} bg-gray-500 text-white hover:bg-gray-600`
      if (this.variant === 'danger') return `${base} bg-red-500 text-white hover:bg-red-600`
      return base
    },
  },
})
</script>

<template>
  <button :type="type" :class="buttonClass" :disabled="disabled">
    <slot />
  </button>
</template>