<template>
  <v-layout>
    <!-- <v-app-bar color="primary" density="compact">
        <v-app-bar-title>SDT UI DEV</v-app-bar-title>
      </v-app-bar> -->
    <v-main>
      <router-view />
    </v-main>

    <MessageBar />
    <Loader />
  </v-layout>
</template>
<script lang="ts">
import MessageBar from './Visibility/MessageBar.vue';
import Loader from './Visibility/Loader.vue'
export default {
  components: {
    MessageBar,
    Loader
  },
  data(){
    return{
    }
  },
}
</script>

<style>
body{
  background-color: #E0F2F1;
}
</style>