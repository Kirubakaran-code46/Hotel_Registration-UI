<template>
    <v-overlay v-model="loaderStore.loading" class="d-flex align-center justify-center">
      <v-container class="fill-height">
        <v-row class="fill-height align-center justify-center">
          <v-col cols="12" class="text-center">
            <v-progress-circular indeterminate size="64" color="primary"></v-progress-circular>
            <p class="mt-5 text-h7 text--primary">{{ loaderStore.text }}</p>
          </v-col>
        </v-row>
      </v-container>
    </v-overlay>
</template>

<script setup lang="ts">
import { useLoaderStore } from '@/stores/loaderStore';
const loaderStore = useLoaderStore();
</script>
  