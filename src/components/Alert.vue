<template>
  <div class="notification-container">
    <v-slide-y-transition>
      <v-alert
        v-model="alert.show"
        :text="alert.message"
        :title="alert.title"
        :type="alert.type"
        class="text-wrap"
      ></v-alert>
    </v-slide-y-transition>
  </div>
</template>
<script lang="ts">
import {mapState} from "pinia";
import {useAlertStore} from "@/stores/alert";

export default defineComponent({
  computed: {
    ...mapState(useAlertStore, ['alert']),
  },

  watch: {
    'alert.show'(currentValue) {
      if (currentValue) {
        setTimeout(() => {
          this.alert.show = false;
        }, 5000);
      }
    }
  }
})
</script>
<style scoped>
.notification-container {
  position: fixed;
  top: 10px;
  right: 10px;
  display: grid;
  grid-gap: 0.5em;
  z-index: 9999;
  width: 400px;
}
</style>
