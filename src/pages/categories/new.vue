<template>
  <v-layout class="h-100">
    <AppBar/>
    <v-main>
      <v-container class="d-flex align-center">
        <v-btn
          color="primary"
          prepend-icon="mdi-chevron-left"
          size="large"
          text="Back"
          to="/bills"
          variant="outlined">
        </v-btn>
        <h1 class="ml-5">
          New Category
        </h1>
      </v-container>
      <NewCategory/>
    </v-main>
  </v-layout>
</template>
<script lang="ts">
import NewCategory from "@/components/NewCategory.vue";

export interface ICreateCategory {
  id?: number,
  description?: string,
}

export default defineComponent({
  components: {NewCategory}
})
</script>
<style scoped>
</style>
<route lang="json">
{
"meta": {
"requiresAuth": true
}
}
</route>
