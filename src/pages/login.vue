<template>
  <v-layout id="layout">
    <v-main>
      <v-container
        class="py-15 d-flex justify-center align-center">
        <v-card
          :width="isMobile ? '100%' : '50vw'"
          color="black"
          >
          <v-card-title>
            <v-img class="my-7" height="200px" src="../assets/dime-logo-white.png">
            </v-img>
            <v-container class="text-center">
              <h1>
                Login
              </h1>
            </v-container>
          </v-card-title>
          <v-card-text>
            <v-form
              v-model="formValid"
              fast-fail
              @submit.prevent="doLogin">
              <v-container
                :class="isMobile ? '' : 'px-15'">
                <v-text-field
                  v-model="form.email"
                  :rules="[required, email, maxLength]"
                  label="Email"
                  prepend-inner-icon="mdi-email"
                  required
                  rounded="lg"
                  variant="outlined"
                />
                <v-text-field
                  v-model="form.password"
                  :rules="[required, minLengthPassword, maxLength]"
                  :type="showPassword ? 'text' : 'password'"
                  hide-details="auto"
                  label="Password"
                  prepend-inner-icon="mdi-lock"
                  required
                  rounded="lg"
                  variant="outlined"
                >
                  <template v-slot:append-inner>
                    <v-icon
                      @click="showPassword = !showPassword"
                    >
                      {{ showPassword ? 'mdi-eye-off' : 'mdi-eye' }}
                    </v-icon>
                  </template>
                </v-text-field>
                <div class="text-end mt-2 mb-5">
                  <v-btn
                    variant="text">
                    <span class="text-grey underline-text">Forgot your password?</span>
                  </v-btn>
                </div>
                <v-btn
                  :disabled="!formValid"
                  :loading="loading"
                  color="primary"
                  rounded="lg"
                  size="x-large"
                  type="submit"
                  variant="elevated"
                  width="100%"
                >
                  Login
                </v-btn>
                <v-container class="text-grey text-center">
                  <v-btn
                    href="/sign-up"
                    variant="text">
                    <span>
                      Not a member?
                      <a class="underline-text">
                        Sign up now
                      </a>
                    </span>
                  </v-btn>
                </v-container>
              </v-container>
            </v-form>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
  </v-layout>
</template>
<script lang="ts">
import {mapActions} from "pinia";
import {useAuthStore} from "@/stores/auth";

export default defineComponent({
  name: 'Login',

  computed: {
    isMobile() {
      return this.$vuetify.display.smAndDown;
    }
  },

  data() {
    return {
      formValid: false,
      form: {
        email: '',
        password: '',
      },
      loading: false,
      showPassword: false,
    }
  },

  methods: {
    ...mapActions(useAuthStore, ['login']),

    email(value: string) {
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return pattern.test(value) || 'Invalid email.'
    },

    minLengthPassword(value: string) {
      return value.length >= 8 || 'Min 8 characters.'
    },

    maxLength(value: string) {
      return value.length <= 100 || 'Max 100 characters.'
    },

    async doLogin() {
      this.loading = true;
      try {
        const { data } = await this.login(this.form);
        const { authToken, username, email } = data;
        const userDetails = {
          username,
          email
        }
        localStorage.setItem('user-details', JSON.stringify(userDetails));
        localStorage.setItem('auth-token', authToken);
        this.$router.push('/');
      } finally {
        this.loading = false;
      }

    },

    required(value: string) {
      return !!value || 'Required.'
    },
  }
})
</script>
<style scoped>
#layout {
  background-image: url('src/assets/background.jpg');
  background-size: cover;
}

.underline-text {
  text-decoration: underline;
}
</style>
