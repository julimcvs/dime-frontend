<template>
  <v-layout>
    <v-main>
      <v-container>
        <h1>Analytics</h1>
      </v-container>
      <v-container>
        <PieChart v-if="barChartData.data.length > 0" :chart-data="barChartData" :sallary="sallary"></PieChart>
      </v-container>
      <v-container>
        <LineChart v-if="yearComparisonByCategoryData.length > 0" :chart-data="yearComparisonByCategoryData"></LineChart>
      </v-container>
    </v-main>
  </v-layout>
</template>
<script lang="ts">
import {mapActions, mapWritableState} from "pinia";
import {Expense, useExpenseStore} from "@/stores/expenses";
import {useCategoryStore} from "@/stores/categories";
import {useSallaryStore} from "@/stores/sallary";

export default defineComponent({
  name: 'ExpenseAnalytics',
  computed: {
    ...mapWritableState(useExpenseStore, ['expenses'])
  },

  async created() {
    await this.getCategories();
    await this.getUserSallary();
    this.generateBarChartData();
    await this.generateYearComparisonByCategoryChart();
  },

  data() {
    const categories: any[] = [];
    const barChartData = {
      items: [] as any[],
      data: [] as any[]
    };
    return {
      categories,
      barChartData: barChartData,
      yearComparisonByCategoryData: [],
      sallary: 0
    }
  },

  methods: {
    ...mapActions(useCategoryStore, ['findAllCategories']),
    ...mapActions(useExpenseStore, ['getYearComparisonByCategory']),
    ...mapActions(useSallaryStore, ['saveSallary', 'findUserSallary']),

    async getUserSallary() {
      const { data } = await this.findUserSallary();
      if (data.sallary) {
        this.sallary = parseFloat(data.sallary);
      }
    },

    async getCategories() {
      const res = await this.findAllCategories();
      this.categories = res.data;
    },

    generateBarChartData() {
      const expensesPerCategory = new Map<string, number>();
      console.log(this.categories)
      this.expenses.forEach((expense: Expense) => {
        const category = this.categories.find((category: any) => category.id === expense.category.id);
        const expensesPerCategoryValue = expensesPerCategory.get(category.description);
        if (expensesPerCategoryValue) {
          expensesPerCategory.set(category.description, expensesPerCategoryValue + parseFloat(String(expense.price)));
        } else {
          expensesPerCategory.set(category.description, parseFloat(String(expense.price)));
        }
      });
      this.barChartData = {
        items: Array.from(expensesPerCategory.keys()),
        data: Array.from(expensesPerCategory.values())
      }
    },

    async generateYearComparisonByCategoryChart() {
      const res = await this.getYearComparisonByCategory();
      this.yearComparisonByCategoryData = res.data;
    }
  },
})
</script>
