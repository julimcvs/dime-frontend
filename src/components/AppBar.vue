<template>
  <v-app-bar
    v-if="isMobile"
  >
    <v-app-bar-nav-icon
      @click="openNavBar()"
    ></v-app-bar-nav-icon>
    <v-toolbar-title>
      Dime
    </v-toolbar-title>
  </v-app-bar>
  <v-navigation-drawer
    v-model="isOpen"
    @update:rail="isExpanded = !$event"
    expand-on-hover
    :rail="!isMobile"
  >
    <v-list>
      <v-list-item
        prepend-icon="mdi-account"
        :subtitle="userDetails.email"
        :title="userDetails.username"
      ></v-list-item>
      <v-list-item
        class="my-2"
        v-if="isExpanded"
      >
          <v-btn
            class="w-100"
            prepend-icon="mdi-logout"
            color="primary"
            @click="logout"
          >
            Logout
          </v-btn>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list density="comfortable" nav>
      <v-list-item class="text-primary" to="/" prepend-icon="mdi-home" title="Home"></v-list-item>
      <v-list-item class="text-primary" to="/sallary" prepend-icon="mdi-currency-usd" title="Sallary"></v-list-item>
      <v-list-item class="text-primary" to="/bills" prepend-icon="mdi-cash-multiple" title="Bills"></v-list-item>
      <v-list-item class="text-primary" to="/expenses" prepend-icon="mdi-wallet" title="Expenses"></v-list-item>
      <v-list-item class="text-primary" to="/categories/new" prepend-icon="mdi-tag" title="Categories"></v-list-item>
    </v-list>
  </v-navigation-drawer>

</template>
<script lang="ts">

export default defineComponent({
  name: 'AppBar',

  computed: {
    isMobile() {
      return this.$vuetify.display.smAndDown;
    }
  },

  created() {
    const userDetails = localStorage.getItem('user-details');
    if (userDetails) {
      this.userDetails = JSON.parse(userDetails);
    }
  },

  data() {
    const isOpen: boolean | null = null as boolean | null;
    return {
      isExpanded: false,
      isOpen,
      userDetails: {
        email: '',
        username: ''
      },
    }
  },

  methods: {
    openNavBar() {
      this.isOpen = !this.isOpen;
    },
    logout() {
      localStorage.removeItem('user-details');
      localStorage.removeItem('auth-token');
      this.$router.push('/login');
    }
  }
})
</script>
<style scoped>

</style>
