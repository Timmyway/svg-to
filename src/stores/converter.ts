import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface ConvertedImage {
  id: string
  originalName: string
  format: 'png' | 'webp' | 'jpg'
  url: string
  size: number
  width: number
  height: number
  originalWidth: number
  originalHeight: number
}

export interface ConversionError {
  fileName: string
  message: string
}

export interface DimensionConfig {
  width?: number
  height?: number
  maintainAspectRatio: boolean
}

export const useConverterStore = defineStore('converter', () => {
  const convertedImages = ref<ConvertedImage[]>([])
  const isConverting = ref(false)
  const errors = ref<ConversionError[]>([])
  const defaultDimensions = ref<DimensionConfig>({
    width: 800,
    height: undefined,
    maintainAspectRatio: true
  })

  const clearErrors = () => {
    errors.value = []
  }

  const addError = (error: ConversionError) => {
    errors.value.push(error)
  }

  const convertSvgToFormat = async (
    file: File, 
    format: 'png' | 'webp' | 'jpg',
    dimensions?: DimensionConfig
  ): Promise<ConvertedImage> => {
    const svgUrl = URL.createObjectURL(file)
    const img = new Image()
    
    return new Promise((resolve, reject) => {
      const cleanup = () => {
        URL.revokeObjectURL(svgUrl)
      }

      const handleLoad = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        if (!ctx) {
          cleanup()
          reject(new Error('Canvas context not available'))
          return
        }

        const originalWidth = img.width || 800
        const originalHeight = img.height || 600
        const aspectRatio = originalWidth / originalHeight

        let targetWidth = dimensions?.width || defaultDimensions.value.width || originalWidth
        let targetHeight = dimensions?.height || defaultDimensions.value.height || originalHeight

        if (dimensions?.maintainAspectRatio !== false) {
          if (dimensions?.width && !dimensions?.height) {
            targetHeight = Math.round(targetWidth / aspectRatio)
          } else if (dimensions?.height && !dimensions?.width) {
            targetWidth = Math.round(targetHeight * aspectRatio)
          }
        }

        canvas.width = targetWidth
        canvas.height = targetHeight

        try {
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight)
          
          canvas.toBlob((blob) => {
            if (!blob) {
              cleanup()
              reject(new Error('Conversion failed'))
              return
            }

            const url = URL.createObjectURL(blob)
            const convertedImage: ConvertedImage = {
              id: crypto.randomUUID(),
              originalName: file.name.replace('.svg', `.${format}`),
              format,
              url,
              size: blob.size,
              width: targetWidth,
              height: targetHeight,
              originalWidth,
              originalHeight
            }

            cleanup()
            resolve(convertedImage)
          }, `image/${format}`, 0.95)
        } catch (error) {
          cleanup()
          reject(new Error('Failed to process SVG'))
        }
      }

      img.onload = handleLoad
      img.onerror = () => {
        cleanup()
        reject(new Error('Failed to load SVG'))
      }

      const timeout = setTimeout(() => {
        cleanup()
        reject(new Error('SVG loading timed out'))
      }, 10000)

      img.src = svgUrl

      img.onload = () => {
        clearTimeout(timeout)
        handleLoad()
      }
    })
  }

  const addConvertedImage = (image: ConvertedImage) => {
    convertedImages.value.push(image)
  }

  const removeConvertedImage = (id: string) => {
    const image = convertedImages.value.find(img => img.id === id)
    if (image) {
      URL.revokeObjectURL(image.url)
      convertedImages.value = convertedImages.value.filter(img => img.id !== id)
    }
  }

  const downloadImage = async (id: string) => {
    const image = convertedImages.value.find(img => img.id === id)
    if (!image) return

    try {
      const response = await fetch(image.url)
      if (!response.ok) throw new Error('Failed to download image')
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = image.originalName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      addError({
        fileName: image.originalName,
        message: 'Failed to download image'
      })
    }
  }

  const updateDefaultDimensions = (dimensions: Partial<DimensionConfig>) => {
    defaultDimensions.value = {
      ...defaultDimensions.value,
      ...dimensions
    }
  }

  return {
    convertedImages,
    isConverting,
    errors,
    defaultDimensions,
    convertSvgToFormat,
    addConvertedImage,
    removeConvertedImage,
    downloadImage,
    clearErrors,
    addError,
    updateDefaultDimensions
  }
})