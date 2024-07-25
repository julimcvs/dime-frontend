/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'
import { VCalendar } from 'vuetify/labs/VCalendar'
import { VNumberInput } from 'vuetify/labs/VNumberInput'
import { VDateInput } from 'vuetify/labs/VDateInput'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  components: {
    VCalendar,
    VNumberInput,
    VDateInput,
  },
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        dark: true,
        colors: {
          primary: '#f0681e',
          secondary: '#121212',
          success: '#00AC17',
          danger: '#660000',
          warning: '#D57D00',
        }
      }
    }
  },
})
