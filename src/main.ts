/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import {registerPlugins} from '@/plugins'

// Components
import App from './App.vue'

// Composables
import {createApp} from 'vue'
import axios from "axios";
import {getActivePinia} from "pinia";
import {useAlertStore} from "@/stores/alert";
import router from "@/router";

const app = createApp(App)
registerPlugins(app)

const pinia = getActivePinia();
const alertStore = useAlertStore(pinia);

axios.interceptors.request.use((config) => {
  const authToken = localStorage.getItem('auth-token');
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        if (router.currentRoute.value.path !== '/login') {
          router.push('/login');
          alertStore.showError('Your session has expired. Please log in again.');
        } else {
          alertStore.showError(error.response.data.message);
        }
        return;
      }
      if (error.response.status === 500) {
        alertStore.showError('Internal server error');
        return;
      }
      if (error.response.status >= 400 && error.response.status <= 499) {
        if (error.response.data.message) {
          alertStore.showError(error.response.data.message);
        } else {
          alertStore.showError('Invalid parameters');
        }
        return;
      }
    }
    return Promise.reject(error)
  },
);
app.config.globalProperties.$axios = axios;

app.mount('#app')
