<template>
  <v-layout class="h-100">
    <AppBar/>
    <v-main>
      <v-container class="d-flex align-center">
        <v-btn
          prepend-icon="mdi-chevron-left"
          to="/bills"
          size="large"
          text="Back"
          variant="outlined"
          color="primary">
        </v-btn>
        <h1 class="ml-5">
          New Bill
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
              <div class="d-flex">
                <v-number-input
                  v-model="form.price"
                  :reverse="false"
                  controlVariant="default"
                  label="Price (R$)"
                  prepend-inner-icon="mdi-cash"
                  required
                  :hideInput="false"
                  :inset="false"
                  variant="outlined"
                ></v-number-input>
              <v-checkbox
                v-model="form.isFixedPrice"
                color="primary"
                label="Fixed?">
              </v-checkbox>
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <v-autocomplete
                :items="days"
                v-model="form.recurrentPaymentDay"
                :rules="[required]"
                color="primary"
                label="Recurrent Payment Day"
                prepend-inner-icon="mdi-calendar"
                required
                variant="outlined">
              </v-autocomplete>
            </v-col>
            <v-col cols="12" md="3">
              <v-checkbox
                v-model="form.sendNotification"
                color="primary"
                label="Send Notification">
              </v-checkbox>
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
          <v-btn
            @click="deleteById"
            class="ml-5"
            v-if="isEditing"
            text="Delete"
            color="danger"
            :loading="loadingDelete"
            prepend-icon="mdi-trash-can"
            size="large"
            variant="elevated">
          </v-btn>
          </div>
        </v-form>
      </v-container>
    </v-main>
  </v-layout>
</template>
<script lang="ts">
import {useBillStore} from "@/stores/bills";
import {mapActions} from "pinia";

export interface ICreateBill {
  id?: number,
  description?: string,
  price?: number,
  recurrentPaymentDay?: number,
  sendNotification?: boolean,
  isFixedPrice?: boolean,
}

export default defineComponent({
  name: 'NewBill',

  async created() {
    const query = this.$route.query;
    if (query.id) {
      this.isEditing = true;
      await this.findById(Number(query.id));
    }
  },

  data() {
    const form: ICreateBill = {
      sendNotification: true,
      isFixedPrice: true
    };
    const days: number[] = Array.from({length: 31}, (_, i) => i + 1);
    return {
      days,
      form,
      formValid: false,
      isEditing: false,
      loading: false,
      loadingDelete: false,
    }
  },

  methods: {
    ...mapActions(useBillStore, ['createBill', 'deleteBill', 'findBillById']),

    async create() {
      if (this.formValid) {
        try {
          const form = {
            ...this.form,
            price: this.form.price ? parseFloat(String(this.form.price)) : 0
          };
          await this.createBill(form);
          this.$router.push('/bills');
        } catch (e) {
          console.error('Error creating bill.');
        }
      }
    },

    async deleteById() {
      this.loadingDelete = true;
      try {
        if (this.form.id) {
          await this.deleteBill(this.form.id);
          this.$router.push('/bills');
        }
        return;
      } catch (e) {
        console.error('This bill does not exist.')
      } finally {
        this.loadingDelete = false;
      }
    },

    async findById(id: number) {
      try {
        const res = await this.findBillById(id);
        const bill = res.data;
        this.form = {
          ...bill
        }
      } catch (e) {
        console.error('This bill does not exist.')
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
