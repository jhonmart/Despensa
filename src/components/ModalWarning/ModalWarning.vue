<template>
  <div class="modal-card">
    <b-loading :is-full-page="false" :active="isLoading" />
    <header class="modal-card-head">
      <span class="modal-card-title is-size-5 has-text-centered">{{
        title
      }}</span>
      <div class="close-button cursor-pointer" @click.stop="denyAction()">
        <b-icon icon="close" />
      </div>
    </header>

    <div class="modal-content-container">
      <div data-cy="WARNING_MESSAGE" class="p-5" v-html="message"></div>

      <footer class="modal-card-foot is-justify-content-flex-end">
        <div class="buttons">
          <b-button
            v-for="(button, index) in buttons"
            :key="index"
            @click="() => (button.action ? confirmAction() : denyAction())"
            :type="button.isConfirm ? 'is-success' : 'is-danger'"
            class="is-medium"
            :class="{ 'is-outlined': button.isConfirm }"
          >
            {{ button.label }}
          </b-button>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
import { General } from "@/utils/constants";

export default {
  props: {
    title: {
      type: String,
      default: General.WARNING
    },
    message: {
      type: String,
      default: ""
    },
    confirm: {
      type: Function,
      default: () => null
    },
    deny: {
      type: Function,
      default: () => null
    },
    buttons: {
      type: Array,
      default: () => [
        { label: General.YES, isConfirm: true, action: true },
        { label: General.NO, isConfirm: false, action: false }
      ]
    }
  },

  data() {
    return {
      General,
      isLoading: false
    };
  },

  methods: {
    async confirmAction() {
      this.isLoading = true;
      await this.confirm();
      this.isLoading = false;
      this.close();
    },

    async denyAction() {
      this.isLoading = true;
      await this.deny();
      this.isLoading = false;
      this.close();
    },

    close() {
      this.$parent.close();
    }
  }
};
</script>

<style lang="scss" scoped>
.modal-card {
  display: flex;
  justify-content: space-between;
  max-height: 75vh;
  background-color: #ffffff;
}

.header-body {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  border-bottom: 1px solid;
  border-bottom-color: #cdcdcd;
}

.card-body {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid;
  border-bottom-color: #cdcdcd;
}

.modal-content-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: auto;
}
</style>
