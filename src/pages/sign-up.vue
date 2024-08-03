<template>
  <v-layout id="layout">
    <v-main>
      <v-container
        class="d-flex justify-center align-center">
        <v-card
          :width="isMobile ? '100%' : '50vw'"
          color="black"
          >
          <v-card-title>
            <v-img height="200px" src="../assets/dime-logo-white.png">
            </v-img>
            <v-container class="text-center">
              <h1>
                Sign-up
              </h1>
            </v-container>
          </v-card-title>
          <v-card-text>
            <v-container class="text-center">
              <p>
                Passwords must have at least 8 characters, one uppercase letter, and one special character.
              </p>
            </v-container>
            <v-form
              validate-on="input lazy"
              ref="form"
              v-model="formValid"
              @submit.prevent="doSignUp">
              <v-container
                :class="isMobile ? '' : 'px-15'">
                <v-text-field
                  v-model="form.username"
                  :rules="[required, maxLength]"
                  label="Username"
                  prepend-inner-icon="mdi-account"
                  required
                  rounded="lg"
                  variant="outlined"
                />
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
                  :rules="[required, minLengthPassword, maxLength, passwordsMatch, passwordPattern]"
                  :type="showPassword ? 'text' : 'password'"
                  label="Password"
                  @update:model-value="formRef.validate()"
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
                <v-text-field
                  v-model="form.confirmPassword"
                  :rules="[required, minLengthPassword, maxLength, passwordsMatch]"
                  :type="showPassword ? 'text' : 'password'"
                  @update:model-value="formRef.validate()"
                  hide-details="auto"
                  label="Confirm Password"
                  prepend-inner-icon="mdi-check-circle-outline"
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
                <v-container class="px-0">
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
                    Sign Up!
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
  name: 'SignUp',

  computed: {
    formRef() {
      return this.$refs.form as any;
    },

    isMobile() {
      return this.$vuetify.display.smAndDown;
    }
  },

  data() {
    return {
      formValid: false,
      form: {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      },
      loading: false,
      showPassword: false,
    }
  },

  methods: {
    ...mapActions(useAuthStore, ['signUp']),

    async doSignUp() {
      this.loading = true;
      try {
        await this.signUp(this.form);
        this.$router.push('/login');
      } finally {
        this.loading = false;
      }
    },

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

    required(value: string) {
      return !!value || 'Required.'
    },

    passwordsMatch() {
      return this.form.confirmPassword === this.form.password || 'Passwords do not match.'
    },

    passwordPattern(value: string) {
      return !!value.match(/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).{8,}$/) || 'Password is invalid.'
    }
  }
})
</script>
<style scoped>
#layout {
  background-image: url('../assets/background.jpg');
  background-size: cover;
}

.underline-text {
  text-decoration: underline;
}
</style>
