import { defineStore } from 'pinia'

export const usePreviewStore = defineStore('PreviewPanel', {
  state: () => ({
    isVisible: false,
    previewData: '',
  }),
  actions: {
    showImage(base64Image: string) {
      this.previewData = base64Image
      this.isVisible = true
    },
  },
})
