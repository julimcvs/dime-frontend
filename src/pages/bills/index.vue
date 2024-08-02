<template>
  <v-layout class="h-100">
    <AppBar/>
    <v-main>
      <v-container class="d-flex justify-space-between">
        <h1>
          Bills
        </h1>
        <!--          <v-tabs-->
        <!--            v-model="tab"-->
        <!--            class="ml-5"-->
        <!--            color="primary">-->
        <!--            <v-tab :value="1">Calendar</v-tab>-->
        <!--            <v-tab :value="2">Analytics</v-tab>-->
        <!--          </v-tabs>-->
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          :size="isMobile ? 'x-large' : 'large'"
          text="New bill"
          to="/bills/new">
        </v-btn>
      </v-container>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item :value="1">
          <v-container v-if="isMobile">
            <v-row>
              <v-col cols="6">
                <v-card
                  class="py-5"
                  color="primary"
                  rounded="lg"
                  variant="elevated">
                  <v-card-title class="font-weight-bold text-center">
                    Variable Cost
                  </v-card-title>
                  <v-card-text class="text-center">
                    <span class="font-weight-bold" style="font-size: 24px">
                      R$ {{ variableCost.toFixed(2) }}
                    </span>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="6">
                <v-card
                  class="py-5"
                  color="black"
                  rounded="lg"
                  variant="elevated">
                  <v-card-title class="font-weight-bold text-center">
                    Fixed Cost
                  </v-card-title>
                  <v-card-text class="text-center">
                    <span class="font-weight-bold" style="font-size: 24px">
                      R$ {{ fixedCost.toFixed(2) }}
                    </span>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
          <v-container
            v-else
          >
            <v-card
              class="pa-5"
              style="width: fit-content;"
              variant="outlined">
              <p class="text-primary font-weight-medium"
                 style="font-size: 18px">
                Variable Cost: R$ {{ variableCost.toFixed(2) }}
                <span class="ml-5 text-white">
                  Fixed Cost: R$ {{ fixedCost.toFixed(2) }}
                </span>
              </p>
            </v-card>
          </v-container>
          <v-container>
            <v-sheet>
              <v-container
                v-if="isMobile">
                <div v-if="eventsMap.size === 0">
                  <v-list>
                    <v-list-item>
                      <v-list-item-title>
                        No expenses this month!
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </div>
                <div v-for="(event, index) in eventsMap.entries()" :key="index">
                  <div class="py-3">
                  <span>
                    {{event[0].toDateString()}}
                  </span>
                    <v-divider></v-divider>
                  </div>
                  <div v-for="bill in event[1]" :key="bill.id">
                    <v-list>
                      <v-list-item
                        @click="openEvent(bill)">
                          <v-list-item-title>
                            {{bill.description}}
                          </v-list-item-title>
                          <v-list-item-subtitle>
                            R$ {{bill.price}}
                          </v-list-item-subtitle>
                        <template v-slot:append>
                          <v-icon
                            size="x-large"
                            color="primary">
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
                      R$ {{ event.price }}
                    </span>
                  </v-btn>
                </template>
              </v-calendar>

            </v-sheet>
          </v-container>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-main>
  </v-layout>
</template>
<script lang="ts">
import {mapActions} from "pinia";
import {Bill, useBillStore} from "@/stores/bills";
import {AxiosResponse} from "axios";

export default defineComponent({
  computed: {
    isMobile() {
      return this.$vuetify.display.smAndDown;
    }
  },

  async created() {
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();
    await this.getBills(month + 1, year);
    console.log(this.eventsMap);
  },

  data() {
    const calendarValue = [new Date()];
    const events: any[] = [];
    const eventsMap = new Map<Date, Bill[]>();
    return {
      tab: 0,
      calendarValue,
      events,
      eventsMap,
      variableCost: 0,
      fixedCost: 0,
    }
  },

  methods: {
    ...mapActions(useBillStore, ['findBillsByMonth']),

    generateCalendarEvents(bills: Bill[], today: Date) {
      this.events = bills.map((bill: any) => ({
        id: bill.id,
        price: bill.price,
        title: bill.description,
        start: new Date(today.setDate(bill.recurrentPaymentDay)),
        end: new Date(today.setDate(bill.recurrentPaymentDay)),
        allDay: true,
      }));
    },

    generateMobileCalendarEvents(bills: Bill[], today: Date) {
      const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
      for (let i = 1; i <= lastDayOfMonth; i++) {
        const date = new Date(today.setDate(i));
        const dayBills = bills.filter((bill: Bill) => bill.recurrentPaymentDay === i);
        if (dayBills.length) {
          this.eventsMap.set(date, dayBills);
        }
      }
    },

    async getBills(month: number, year: number) {
      const res: AxiosResponse<Bill[]> = await this.findBillsByMonth(month, year);
      const bills: Bill[] = res.data;
      this.variableCost = bills.map((bill: Bill) => parseFloat(String(bill.price))).reduce((a, b) => a + b, 0);
      this.fixedCost = bills.filter((bill: Bill) => bill.isFixedPrice).map((bill: Bill) => parseFloat(String(bill.price))).reduce((a, b) => a + b, 0);
      const today = new Date();
      today.setMonth(month - 1);
      today.setFullYear(year);
      if (this.isMobile) {
        this.generateMobileCalendarEvents(bills, today);
      } else {
        this.generateCalendarEvents(bills, today);
      }
    },

    openEvent(event: any) {
      this.$router.push({
        path: `/bills/new`,
        query: {id: event.id}
      })
    },

    async updatedMonth(event: Date[]) {
      const date = event[0];
      const month = date.getMonth();
      const year = date.getFullYear();
      await this.getBills(month + 1, year);
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
