import { defineStore } from 'pinia'
import axios from "axios";

export interface ILoginUser {
  email: string,
  password: string
}

export interface ISignUpUser {
  username: string,
  email: string,
  password: string
}

export const useAuthStore = defineStore('auth', {
  actions: {
    async login(user: ILoginUser) {
      return await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, user)
    },

    async signUp(user: ISignUpUser) {
      return await axios.post(`${import.meta.env.VITE_API_URL}/auth/sign-up`, user)
    },
  },
  state: () => ({

  }),
})
