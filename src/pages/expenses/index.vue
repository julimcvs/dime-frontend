<template>
  <v-layout class="h-100">
    <AppBar/>
    <v-main>
      <v-container class="d-flex justify-space-between">
        <div class="d-flex">
          <h1>
            Expenses
          </h1>
        </div>
        <v-btn
          :size="isMobile ? 'x-large' : 'large'"
          color="primary"
          prepend-icon="mdi-plus"
          text="New Expense"
          to="/expenses/new">
        </v-btn>
      </v-container>
      <v-container>
        <v-tabs
          v-model="tab"
          color="primary">
          <v-tab :value="1">Calendar</v-tab>
          <v-tab :value="2">Analytics</v-tab>
        </v-tabs>
      </v-container>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item :value="1">
          <v-container>
            <v-row v-if="isMobile">
              <v-col cols="6">
                <v-card
                  class="py-5"
                  color="primary"
                  rounded="lg"
                  variant="elevated">
                  <v-card-title class="font-weight-bold text-center">
                    Total Cost
                  </v-card-title>
                  <v-card-text class="text-center">
                    <span class="font-weight-bold" style="font-size: 24px">
                      R$ {{ totalCost.toFixed(2) }}
                    </span>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
            <v-card
              v-else
              class="pa-5"
              style="width: fit-content;"
              variant="outlined">
              <p class="text-primary font-weight-medium"
                 style="font-size: 18px">
                Total Cost: R$ {{ totalCost.toFixed(2) }}
              </p>
            </v-card>
          </v-container>
          <v-container>
            <v-sheet>
              <v-container
                v-if="isMobile">
                <div v-if="expenses.length === 0">
                  <v-list>
                    <v-list-item>
                      <v-list-item-title>
                        No expenses this month!
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </div>
                <div v-for="(event, index) in eventsMap.entries()"
                     :key="index">
                  <div class="py-3">
                  <span>
                    {{ event[0].toDateString() }}
                  </span>
                    <v-divider></v-divider>
                  </div>
                  <div v-for="expense in event[1]" :key="expense.id">
                    <v-list>
                      <v-list-item
                        @click="openEvent(expense)">
                        <v-list-item-title>
                          {{ expense.description }}
                        </v-list-item-title>
                        <v-list-item-subtitle>
                          R$ {{ parseFloat(String(expense.price)).toFixed(2) }}
                        </v-list-item-subtitle>
                        <template v-slot:append>
                          <v-icon
                            color="primary"
                            size="x-large">
                            mdi-chevron-right
                          </v-icon>
                        </template>
                        <template v-slot:prepend>
                          <v-icon color="primary">
                            mdi-credit-card-clock
                          </v-icon>
                        </template>
                      </v-list-item>
                    </v-list>
                  </div>
                </div>
              </v-container>

              <v-calendar
                v-else
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
                    class="h-auto py-1 ma-1"
                    color="primary"
                    prepend-icon="mdi-circle-medium"
                    size="medium"
                    variant="outlined"
                    @click="openEvent(event)"
                  >
                    <span class="text-wrap">
                      {{ event.title }}
                      <br>
                      R$ {{ parseFloat(String(event.price)).toFixed(2) }}
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
    ...mapWritableState(useExpenseStore, ['expenses']),

    isMobile() {
      return this.$vuetify.display.smAndDown;
    }
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
    const eventsMap = new Map<Date, Expense[]>();
    return {
      calendarValue,
      events,
      tab: 0,
      eventsMap,
      totalCost: 0,
    }
  },

  methods: {
    ...mapActions(useExpenseStore, ['findExpensesByMonth']),

    generateCalendarEvents() {
      this.events = this.expenses.map((expense: Expense) => ({
        id: expense.id,
        price: expense.price,
        title: expense.description,
        start: new Date(expense.paymentDay),
        end: new Date(expense.paymentDay),
        allDay: true,
      }));
    },

    generateMobileCalendarEvents(today: Date) {
      const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
      for (let i = 1; i <= lastDayOfMonth; i++) {
        const date = new Date(today.setDate(i));
        const dayExpenses = this.expenses.filter((expense: Expense) => new Date(expense.paymentDay).getDate() === i);
        if (dayExpenses.length) {
          this.eventsMap.set(date, dayExpenses);
        }
      }
    },

    async getExpenses(month: number, year: number) {
      const res: AxiosResponse<Expense[]> = await this.findExpensesByMonth(month, year);
      this.expenses = res.data;
      this.totalCost = this.expenses.map((expense: Expense) => parseFloat(String(expense.price))).reduce((a, b) => a + b, 0);
      const today = new Date();
      today.setMonth(month - 1);
      today.setFullYear(year);
      if (this.isMobile) {
        this.generateMobileCalendarEvents(today);
      } else {
        this.generateCalendarEvents();
      }
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
