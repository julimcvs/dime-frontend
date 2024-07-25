<template>
<v-layout class="h-100">
  <AppBar/>
  <v-main>
    <v-container>
      <h1>
        Sallary
      </h1>
    </v-container>
    <v-container>
      <v-form v-model="formValid" fast-fail @submit.prevent="save">
        <v-number-input
          prepend-inner-icon="mdi-currency-usd"
          label="Sallary"
          placeholder="Enter your sallary"
          v-model="form.sallary"
          variant="outlined">
        </v-number-input>
        <v-btn
          :loading="loading"
          type="submit"
          prepend-icon="mdi-check"
          size="large"
          color="primary"
          :disabled="!formValid"
          text="Save">
        </v-btn>
      </v-form>
    </v-container>
  </v-main>
</v-layout>
</template>
<script lang="ts">
import {mapActions} from "pinia";
import {useSallaryStore} from "@/stores/sallary";

export default defineComponent({
  async created() {
    await this.getUserSallary();
  },

  data() {
    return {
      formValid: false,
      form: {
        sallary: 0
      },
      loading: false,
    }
  },

  methods: {
    ...mapActions(useSallaryStore, ['saveSallary', 'findUserSallary']),

    async getUserSallary() {
      const { data } = await this.findUserSallary();
      if (data.sallary) {
        this.form.sallary = data.sallary;
      }
    },

    async save() {
      this.loading = true;
      try {
        await this.saveSallary(this.form);
      } finally {
        this.loading = false;
      }
    }
  }
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
