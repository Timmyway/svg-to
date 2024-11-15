<script setup lang="ts">
import { ref } from 'vue'
import { useConverterStore } from '../stores/converter'

const emit = defineEmits<{
  (e: 'filesSelected', files: File[]): void
}>()

const isDragging = ref(false)
const store = useConverterStore()

const validateFiles = (files: File[]): File[] => {
  return files.filter(file => {
    if (file.type !== 'image/svg+xml') {
      store.addError({
        fileName: file.name,
        message: 'Only SVG files are supported'
      })
      return false
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      store.addError({
        fileName: file.name,
        message: 'File size exceeds 10MB limit'
      })
      return false
    }
    return true
  })
}

const onDrop = (e: DragEvent) => {
  e.preventDefault()
  isDragging.value = false
  
  const files = Array.from(e.dataTransfer?.files || [])
  const validFiles = validateFiles(files)
  
  if (validFiles.length > 0) {
    emit('filesSelected', validFiles)
  }
}

const onFileInput = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (input.files) {
    const files = Array.from(input.files)
    const validFiles = validateFiles(files)
    
    if (validFiles.length > 0) {
      emit('filesSelected', validFiles)
    }
  }
}
</script>

<template>
  <div
    @dragenter.prevent="isDragging = true"
    @dragleave.prevent="isDragging = false"
    @dragover.prevent
    @drop="onDrop"
    class="w-full p-8 border-2 border-dashed rounded-lg transition-colors"
    :class="[
      isDragging 
        ? 'border-primary bg-primary/10' 
        : 'border-gray-300 hover:border-primary'
    ]"
  >
    <div class="text-center">
      <input
        type="file"
        accept=".svg"
        multiple
        class="hidden"
        @change="onFileInput"
        id="file-input"
      >
      <label
        for="file-input"
        class="cursor-pointer"
      >
        <div class="flex flex-col items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p class="text-lg font-medium text-gray-600">
            Drop SVG files here or click to select
          </p>
          <p class="text-sm text-gray-500">
            Only SVG files up to 10MB are supported
          </p>
        </div>
      </label>
    </div>
  </div>
</template>