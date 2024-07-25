<template>
  <v-layout class="h-100">
    <AppBar/>
    <v-main>
      <v-container class="d-flex justify-space-between">
        <div class="d-flex">
          <h1>
            Expenses
          </h1>
          <v-tabs
            v-model="tab"
            class="ml-5"
            color="primary">
            <v-tab :value="1">Calendar</v-tab>
            <v-tab :value="2">Analytics</v-tab>
          </v-tabs>
        </div>
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          size="large"
          text="Register Expense"
          to="/expenses/new">
        </v-btn>
      </v-container>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item :value="1">
          <v-container>
            <v-card
              class="pa-5"
              style="width: fit-content;"
              variant="outlined">
              <p class="text-primary font-weight-medium"
                 style="font-size: 18px">
                Total Cost: R$ {{ totalCost }}
              </p>
            </v-card>
          </v-container>
          <v-container>
            <v-sheet>
              <v-calendar
                ref="calendar"
                v-model="calendarValue"
                :events="events"
                :weekdays="[0, 1, 2, 3, 4, 5, 6]"
                view-mode="month"
                @change="openEvent"
                @update:model-value="updatedMonth"
              >
                <template v-slot:event="{ event }">
                  <v-btn
                    color="primary"
                    class="h-auto py-1 ma-1"
                    prepend-icon="mdi-circle-medium"
                    size="medium"
                    variant="outlined"
                    @click="openEvent(event)"
                  >
                    <span class="text-wrap">
                      {{ event.title }}
                      <br>
                      R$ {{ event.price }}
                    </span>
                  </v-btn>
                </template>
              </v-calendar>
            </v-sheet>
          </v-container>
        </v-tabs-window-item>
        <v-tabs-window-item :value="2">
          <v-container>
            <ExpenseAnalytics v-if="expenses.length"/>
          </v-container>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-main>
  </v-layout>
</template>
<script lang="ts">
import {mapActions, mapWritableState} from "pinia";
import {AxiosResponse} from "axios";
import {Expense, useExpenseStore} from "@/stores/expenses";

export default defineComponent({
  computed: {
    ...mapWritableState(useExpenseStore, ['expenses'])
  },

  async created() {
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();
    await this.getExpenses(month + 1, year);
  },

  data() {
    const calendarValue = [new Date()];
    const events: any[] = [];
    return {
      calendarValue,
      events,
      tab: 0,
      totalCost: 0,
    }
  },

  methods: {
    ...mapActions(useExpenseStore, ['findExpensesByMonth']),

    async getExpenses(month: number, year: number) {
      const res: AxiosResponse<Expense[]> = await this.findExpensesByMonth(month, year);
      this.expenses = res.data;
      this.totalCost = this.expenses.map((expense: Expense) => parseFloat(String(expense.price))).reduce((a, b) => a + b, 0);
      const today = new Date();
      today.setMonth(month - 1);
      today.setFullYear(year);
      this.events = this.expenses.map((expense: Expense) => ({
        id: expense.id,
        price: expense.price,
        title: expense.description,
        start: new Date(expense.paymentDay),
        end: new Date(expense.paymentDay),
        allDay: true,
      }));
    },

    openEvent(event: any) {
      this.$router.push({
        path: `/expenses/new`,
        query: {id: event.id}
      })
    },

    async updatedMonth(event: Date[]) {
      const date = event[0];
      const month = date.getMonth();
      const year = date.getFullYear();
      await this.getExpenses(month + 1, year);
    }
  },
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
