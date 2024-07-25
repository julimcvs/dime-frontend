import { defineStore } from 'pinia'
import axios from "axios";

export interface ISallary {
  sallary: number
}

export const useSallaryStore = defineStore('sallary', {
  actions: {
    async saveSallary(sallary: ISallary) {
      return await axios.post(`${import.meta.env.VITE_API_URL}/sallary`, sallary)
    },

    async findUserSallary() {
      return await axios.get(`${import.meta.env.VITE_API_URL}/sallary`);
    },
  },
  state: () => ({

  }),
})
