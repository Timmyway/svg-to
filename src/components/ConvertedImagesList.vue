<script setup lang="ts">
import { useConverterStore } from '../stores/converter'

const store = useConverterStore()

const formatSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

const getFormatColor = (format: string) => {
  switch (format) {
    case 'png': return 'bg-blue-50 text-blue-700 border-blue-200'
    case 'webp': return 'bg-green-50 text-green-700 border-green-200'
    case 'jpg': return 'bg-purple-50 text-purple-700 border-purple-200'
    default: return 'bg-gray-50 text-gray-700 border-gray-200'
  }
}
</script>

<template>
  <div class="mt-8">
    <h2 class="text-xl font-semibold mb-4">Converted Images</h2>
    <div v-if="store.convertedImages.length === 0" class="text-center py-12 bg-white rounded-lg shadow-md">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <p class="text-gray-500 mb-2">No converted images yet</p>
      <p class="text-sm text-gray-400">Drop your SVG files above to get started</p>
    </div>
    <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="image in store.convertedImages"
        :key="image.id"
        class="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-lg transition-shadow"
      >
        <div class="relative aspect-video bg-gray-50 border-b">
          <img
            :src="image.url"
            :alt="image.originalName"
            class="w-full h-full object-contain p-4"
          />
          <span 
            class="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium border"
            :class="getFormatColor(image.format)"
          >
            {{ image.format.toUpperCase() }}
          </span>
        </div>
        
        <div class="p-4">
          <p class="font-medium truncate mb-3">{{ image.originalName }}</p>
          <div class="space-y-2 text-sm text-gray-500">
            <div class="flex justify-between">
              <span>Size:</span>
              <span class="font-medium text-gray-900">{{ formatSize(image.size) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Dimensions:</span>
              <span class="font-medium text-gray-900">{{ image.width }}×{{ image.height }}px</span>
            </div>
          </div>
          
          <div class="flex gap-2 mt-4">
            <button
              @click="store.downloadImage(image.id)"
              class="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Download
            </button>
            <button
              @click="store.removeConvertedImage(image.id)"
              class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>