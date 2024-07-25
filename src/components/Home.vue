<template>
<v-layout
  class="h-screen"
  id="layout">
  <AppBar/>
  <v-main>
    <v-container>
      <v-row>
        <v-col cols="12">
            <v-img width="200" src="../assets/dime-logo-white.png"></v-img>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</v-layout>
</template>
<script lang="ts">

</script>
<style scoped>
#layout {
  background-image: url('src/assets/background.jpg');
  background-size: cover;
}
</style>
