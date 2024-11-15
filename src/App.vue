<script setup lang="ts">
import { useConverterStore } from './stores/converter'
import FileDropzone from './components/FileDropzone.vue'
import ConvertedImagesList from './components/ConvertedImagesList.vue'
import ErrorNotification from './components/ErrorNotification.vue'
import DimensionControls from './components/DimensionControls.vue'

const store = useConverterStore()
const formats = ['png', 'webp', 'jpg'] as const

const handleFilesSelected = async (files: File[]) => {
  store.isConverting = true
  store.clearErrors()
  
  try {
    for (const file of files) {
      for (const format of formats) {
        try {
          const convertedImage = await store.convertSvgToFormat(file, format, store.defaultDimensions)
          store.addConvertedImage(convertedImage)
        } catch (error) {
          store.addError({
            fileName: file.name,
            message: `Failed to convert to ${format}: ${error instanceof Error ? error.message : 'Unknown error'}`
          })
        }
      }
    }
  } finally {
    store.isConverting = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-3">
          SVG Converter
        </h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Convert your SVG files to PNG, WEBP, or JPG formats with custom dimensions while maintaining quality
        </p>
      </header>

      <main>
        <DimensionControls />
        <FileDropzone @files-selected="handleFilesSelected" />
        
        <div v-if="store.isConverting" class="mt-8 text-center">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm">
            <svg class="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="text-gray-700">Converting your files...</span>
          </div>
        </div>

        <ConvertedImagesList />
      </main>
    </div>
    <ErrorNotification />
  </div>
</template>