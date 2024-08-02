import {defineStore} from 'pinia'
import axios from "axios";
import {ICreateExpense} from "@/pages/expenses/new.vue";

export interface Expense {
  id?: number,
  description: string,
  price: number,
  paymentDay: Date,
  category: any
}

export const useExpenseStore = defineStore('expense', {
  actions: {
    async createExpense(expense: ICreateExpense) {
      return await axios.post(`${import.meta.env.VITE_API_URL}/expense`, expense)
    },

    async deleteExpense(id: number) {
      return await axios.delete(`${import.meta.env.VITE_API_URL}/expense/${id}`);
    },

    async findExpenseById(id: number) {
      return await axios.get(`${import.meta.env.VITE_API_URL}/expense/${id}`);
    },

    async findExpensesByMonth(month: number, year: number) {
      return await axios.post(`${import.meta.env.VITE_API_URL}/expense/get-by-month`, {month, year})
    },

    async getYearComparisonByCategory() {
      return await axios.get(`${import.meta.env.VITE_API_URL}/expense/year-comparison-by-category`)
    }
  },
  state() {
      const expenses: Expense[] = [];
      return {
        expenses
      }
  },
})
