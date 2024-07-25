<template>
  <v-container>
    <v-form v-model="formValid" @submit.prevent="create">
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="form.description"
            :rules="[required, maxLength]"
            color="primary"
            label="Description"
            prepend-inner-icon="mdi-tag-text"
            required
            variant="outlined">
          </v-text-field>
        </v-col>
      </v-row>
      <div>
        <v-btn
          text="Create"
          color="primary"
          :loading="loading"
          prepend-icon="mdi-check"
          size="large"
          type="submit"
          variant="elevated">
        </v-btn>
      </div>
    </v-form>
  </v-container>
</template>
<script lang="ts">
import {mapActions} from "pinia";
import {useCategoryStore} from "@/stores/categories";

export interface ICreateCategory {
  id?: number,
  description?: string,
}

export default defineComponent({
  name: 'NewCategory',
  emits: ['created'],

  async created() {
    const query = this.$route.query;
    if (query.id) {
      this.isEditing = true;
      await this.findById(Number(query.id));
    }
  },

  data() {
    const form: ICreateCategory = {};
    return {
      form,
      formValid: false,
      isEditing: false,
      loading: false,
    }
  },

  methods: {
    ...mapActions(useCategoryStore, ['createCategory', 'findCategoryById']),

    async create() {
      if (this.formValid) {
        this.loading = true;
        try {
          await this.createCategory(this.form);
          this.$emit('created');
        } finally {
          this.loading = false;
        }
      }
    },

    async findById(id: number) {
      try {
        const res = await this.findCategoryById(id);
        const category = res.data;
        this.form = {
          ...category
        }
      } catch (e) {
        console.error('This category does not exist.')
      }
    },

    required(value: string) {
      return !!value || 'This field is required.';
    },

    maxLength(value: string) {
      return value.length <= 255 || 'Max 255 characters.';
    },
  },
})
</script>
<style scoped>
</style>
