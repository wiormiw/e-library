<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppTable',
  props: {
    headers: { type: Array as () => string[], required: true },
    items: { type: Array as () => any[], required: true },
  },
})
</script>

<template>
  <table class="min-w-full bg-white border">
    <thead>
      <tr>
        <th v-for="header in headers" :key="header" class="px-4 py-2 border">{{ header }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in items" :key="index" class="border-t">
        <slot :item="item">
          <td v-for="header in headers" :key="header" class="px-4 py-2 border">
            {{ item[header.toLowerCase()] }}
          </td>
        </slot>
      </tr>
    </tbody>
  </table>
</template>