<template>
  <v-dialog v-model="previewStore.isVisible" max-width="600">
    <v-card>
      <v-card-title class="text-h6">Image Preview</v-card-title>
      <v-card-text>
        <v-img :src="previewStore.previewData" max-height="400" contain />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="previewStore.isVisible = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup lang="ts">
import { usePreviewStore } from "../stores/PreviewPanelStore"


const previewStore = usePreviewStore();
</script>