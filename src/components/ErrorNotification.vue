<script setup lang="ts">
import { useConverterStore } from '../stores/converter'

const store = useConverterStore()

const dismiss = (index: number) => {
  store.errors.splice(index, 1)
}
</script>

<template>
  <div
    v-if="store.errors.length > 0"
    class="fixed bottom-4 right-4 z-50 space-y-2"
  >
    <div
      v-for="(error, index) in store.errors"
      :key="index"
      class="bg-red-50 border-l-4 border-red-500 p-4 flex items-start shadow-lg rounded-r-lg max-w-md"
    >
      <div class="flex-1">
        <p class="text-sm font-medium text-red-800">
          Error processing: {{ error.fileName }}
        </p>
        <p class="mt-1 text-sm text-red-700">
          {{ error.message }}
        </p>
      </div>
      <button
        @click="dismiss(index)"
        class="ml-4 text-red-500 hover:text-red-700"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>
  </div>
</template>