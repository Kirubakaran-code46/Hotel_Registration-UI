<template>
  <v-snackbar v-model="snackbarStore.snackbar" :location="'top right'" :color="snackbarStore.SnackBarColor">
    {{ snackbarStore.msg }}
    <template v-slot:actions>
      <v-icon @click="snackbarStore.close()">mdi-close-circle</v-icon>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import { useSnackbarStore } from '../stores/snackbarStore'


const snackbarStore = useSnackbarStore();
</script>