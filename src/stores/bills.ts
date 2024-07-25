import { defineStore } from 'pinia'
import axios from "axios";
import {ICreateBill} from "@/pages/bills/new.vue";

export interface Bill {
  id: number,
  description: string,
  price: number,
  recurrentPaymentDay: number,
  sendNotification: boolean,
  isFixedPrice: boolean,
}

export const useBillStore = defineStore('bill', {
  actions: {
    async createBill(bill: ICreateBill) {
      return await axios.post(`${import.meta.env.VITE_API_URL}/bills`, bill)
    },

    async deleteBill(id: number) {
      return await axios.delete(`${import.meta.env.VITE_API_URL}/bills/${id}`);
    },

    async findBillById(id: number) {
      return await axios.get(`${import.meta.env.VITE_API_URL}/bills/${id}`);
    },

    async findBillsByMonth(month: number, year: number) {
      return await axios.post(`${import.meta.env.VITE_API_URL}/bills/get-by-month`, { month, year })
    }
  },
  state: () => ({

  }),
})
