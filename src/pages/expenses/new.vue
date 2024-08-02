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
          to="/expenses"
          variant="outlined">
        </v-btn>
        <h1 class="ml-5">
          New Expense
        </h1>
      </v-container>
      <v-container>
        <v-form v-model="formValid" @submit.prevent="create">
          <v-row>
            <v-col cols="12" md="6">
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
            <v-col cols="12" md="6">
              <v-number-input
                v-model="form.price"
                :hideInput="false"
                :inset="false"
                :reverse="false"
                controlVariant="default"
                label="Price (R$)"
                prepend-inner-icon="mdi-cash"
                required
                variant="outlined"
              ></v-number-input>
            </v-col>
            <v-col cols="12" md="6">
              <v-autocomplete
                v-model="form.categoryId"
                :items="categories"
                :rules="[required]"
                color="primary"
                item-title="description"
                item-value="id"
                label="Categories"
                prepend-inner-icon="mdi-tag"
                required
                variant="outlined">
                <template v-slot:append-inner>
                  <v-btn
                    fab
                    icon="mdi-plus"
                    small
                    @click="dialogCategory = true"
                  >
                  </v-btn>
                </template>
              </v-autocomplete>
            </v-col>
            <v-col cols="12" md="6">
              <v-date-input
                v-model="form.paymentDay"
                color="primary"
                label="Payment Day"
                required
                variant="outlined">
              </v-date-input>
            </v-col>
          </v-row>
          <div>
            <v-btn
              :loading="loading"
              color="primary"
              prepend-icon="mdi-check"
              size="large"
              text="Create"
              type="submit"
              variant="elevated">
            </v-btn>
            <v-btn
              v-if="isEditing"
              :loading="loadingDelete"
              class="ml-5"
              color="danger"
              prepend-icon="mdi-trash-can"
              size="large"
              text="Delete"
              variant="elevated"
              @click="deleteById">
            </v-btn>
          </div>
        </v-form>
      </v-container>
      <v-dialog
        v-model="dialogCategory"
        max-width="600">
        <v-card
          class="pa-5"
          variant="elevated">
          <v-card-title>
            New Category
          </v-card-title>
          <v-card-text>
            <NewCategory :created="getCategories"/>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-main>
  </v-layout>
</template>
<script lang="ts">
import {mapActions} from "pinia";
import {useExpenseStore} from "@/stores/expenses";
import {useCategoryStore} from "@/stores/categories";
import NewCategory from "@/components/NewCategory.vue";

export interface ICreateExpense {
  id?: number,
  description?: string,
  price?: number,
  paymentDay?: Date,
  categoryId?: number,
}

export default defineComponent({
  name: 'NewExpense',
  components: {NewCategory},
  async created() {
    await this.getCategories();
    const query = this.$route.query;
    if (query.id) {
      this.isEditing = true;
      await this.findById(Number(query.id));
    }
  },

  data() {
    const form: ICreateExpense = {};
    return {
      categories: [],
      dialogCategory: false,
      form,
      formValid: false,
      isEditing: false,
      loading: false,
      loadingDelete: false,
    }
  },

  methods: {
    ...mapActions(useExpenseStore, ['createExpense', 'deleteExpense', 'findExpenseById']),
    ...mapActions(useCategoryStore, ['findAllCategories']),

    async create() {
      if (this.formValid) {
        try {
          const form = {
            ...this.form,
            price: this.form.price ? parseFloat(String(this.form.price)) : 0
          };
          await this.createExpense(form);
          this.$router.push('/expenses');
        } catch (e) {
          console.error('Error creating expense: ', e);
        }
      }
    },

    async deleteById() {
      this.loadingDelete = true;
      try {
        if (this.form.id) {
          await this.deleteExpense(this.form.id);
          this.$router.push('/expenses');
        }
        return;
      } catch (e) {
        console.error('This expense does not exist.')
      } finally {
        this.loadingDelete = false;
      }
    },

    async findById(id: number) {
      try {
        const res = await this.findExpenseById(id);
        const expense = res.data;
        this.form = {
          ...expense,
          categoryId: expense.category.id
        }
      } catch (e) {
        console.error('This expense does not exist.')
      }
    },

    async getCategories() {
      const res = await this.findAllCategories();
      this.categories = res.data;
      this.dialogCategory = false;
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
:deep(i.mdi-cash.mdi.v-icon.notranslate.v-theme--dark.v-icon--size-default) {
  margin-left: 10px;
}
</style>
<route lang="json">
{
"meta": {
"requiresAuth": true
}
}
</route>
