import { defineStore } from 'pinia'
import axios from "axios";
import {ICreateCategory} from "@/pages/categories/new.vue";

export const useCategoryStore = defineStore('category', {
  actions: {
    async createCategory(bill: ICreateCategory) {
      return await axios.post(`${import.meta.env.VITE_API_URL}/category`, bill)
    },

    async findAllCategories() {
      return await axios.get(`${import.meta.env.VITE_API_URL}/category`);
    },

    async findCategoryById(id: number) {
      return await axios.get(`${import.meta.env.VITE_API_URL}/category/${id}`);
    },
  },
  state: () => ({

  }),
})
