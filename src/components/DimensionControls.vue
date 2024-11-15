<script setup lang="ts">
import { ref, watch } from 'vue'
import { useConverterStore } from '../stores/converter'
import type { DimensionConfig } from '../stores/converter'

const store = useConverterStore()
const dimensions = ref<DimensionConfig>({
  width: store.defaultDimensions.width,
  height: store.defaultDimensions.height,
  maintainAspectRatio: true
})

const emit = defineEmits<{
  (e: 'dimensionsChanged', dimensions: DimensionConfig): void
}>()

watch(dimensions, (newDimensions) => {
  store.updateDefaultDimensions(newDimensions)
  emit('dimensionsChanged', newDimensions)
}, { deep: true })

const handleInput = (field: 'width' | 'height', value: string) => {
  const numValue = value ? parseInt(value, 10) : undefined
  
  if (numValue && numValue < 1) return
  if (numValue && numValue > 10000) return

  dimensions.value[field] = numValue
}

const presetSizes = [
  { name: 'Small', width: 640, height: undefined },
  { name: 'Medium', width: 1280, height: undefined },
  { name: 'Large', width: 1920, height: undefined },
]

const applyPreset = (preset: { width?: number, height?: number }) => {
  dimensions.value = {
    ...dimensions.value,
    ...preset
  }
}
</script>

<template>
  <div class="bg-white p-6 rounded-lg shadow-md mb-8">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold">Output Dimensions</h3>
      <div class="flex gap-2">
        <button
          v-for="preset in presetSizes"
          :key="preset.name"
          @click="applyPreset(preset)"
          class="px-3 py-1 text-sm rounded-full border border-gray-200 hover:border-primary hover:text-primary transition-colors"
          :class="{ 'bg-primary/5 border-primary text-primary': dimensions.width === preset.width }"
        >
          {{ preset.name }}
        </button>
      </div>
    </div>
    
    <div class="grid grid-cols-2 gap-6">
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">
          Width (px)
        </label>
        <div class="relative">
          <input
            type="number"
            :value="dimensions.width"
            @input="(e) => handleInput('width', (e.target as HTMLInputElement).value)"
            min="1"
            max="10000"
            class="w-full pl-3 pr-12 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
            placeholder="Auto"
          >
          <span class="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">px</span>
        </div>
      </div>
      
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">
          Height (px)
        </label>
        <div class="relative">
          <input
            type="number"
            :value="dimensions.height"
            @input="(e) => handleInput('height', (e.target as HTMLInputElement).value)"
            min="1"
            max="10000"
            class="w-full pl-3 pr-12 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
            placeholder="Auto"
          >
          <span class="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">px</span>
        </div>
      </div>
    </div>

    <div class="mt-6 flex items-center justify-between">
      <label class="flex items-center group cursor-pointer">
        <input
          type="checkbox"
          v-model="dimensions.maintainAspectRatio"
          class="rounded border-gray-300 text-primary focus:ring-primary"
        >
        <span class="ml-2 text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
          Maintain aspect ratio
        </span>
      </label>
      
      <button
        @click="dimensions = { ...store.defaultDimensions }"
        class="text-sm text-gray-500 hover:text-primary transition-colors"
      >
        Reset to defaults
      </button>
    </div>

    <div class="mt-4 p-3 bg-gray-50 rounded-lg">
      <div class="flex items-center text-sm text-gray-600">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
        </svg>
        Leave either width or height empty for automatic calculation based on aspect ratio
      </div>
    </div>
  </div>
</template>