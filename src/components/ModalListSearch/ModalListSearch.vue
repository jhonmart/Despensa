<template>
  <div class="modal-card">
    <b-loading :is-full-page="false" :active="isLoading" />
    <header class="modal-card-head">
      <span class="modal-card-title is-size-5 has-text-centered">{{
        General.MESSAGES.SEARCH_RESULT
      }}</span>
      <div class="close-button cursor-pointer" @click.stop="close()">
        <b-icon icon="close" />
      </div>
    </header>

    <section class="modal-content-container p-5">
      <section>
        <span class="label">{{ General.NAMES }}</span>
        <div class="list-name">
          <b-radio
            v-for="item in list.titles"
            :key="item"
            v-model="name"
            :native-value="item"
            type="is-success"
          >
            {{ item }}
          </b-radio>
        </div>
      </section>
      <section>
        <span class="label">{{ General.SIZES }}</span>
        <div class="is-flex">
          <b-radio
            v-for="item in list.sizes"
            :key="item"
            v-model="size"
            :native-value="item"
            type="is-info"
          >
            {{ item }}
          </b-radio>
        </div>
      </section>
    </section>

    <footer class="modal-card-foot is-justify-content-flex-end">
      <div class="buttons">
        <b-button @click="close" type="is-danger" class="is-medium is-outlined">
          {{ General.CANCEL }}
        </b-button>
        <b-button @click="confirmAction" type="is-success" class="is-medium">
          {{ General.CONFIRM }}
        </b-button>
      </div>
    </footer>
  </div>
</template>

<script>
import { General } from "@/utils/constants";
import debounce from "buefy/src/utils/debounce";

export default {
  props: {
    confirm: Function,
    list: Object
  },

  data() {
    return {
      General,
      isLoading: false,
      name: "",
      size: ""
    };
  },

  computed: {
    bestItem() {
      const count = {};
      this.list
        .map(item =>
          item.title
            .split(" ")
            .filter(keyword => !keyword.match(/[\d\W]+/gi)?.length)
        )
        .map(list =>
          list.map(item =>
            count[item.toLowerCase()]
              ? count[item.toLowerCase()]++
              : (count[item.toLowerCase()] = 1)
          )
        );
      const bestWords = Object.entries(count)
        .filter(item => item[1] > 2)
        .sort((b, a) => a[1] - b[1])
        .map(item => item[0]);
      this.list.filter(
        item =>
          item.title
            .split(" ")
            .filter(title => bestWords.includes(title.toLowerCase())).length > 4
      );
      return bestWords;
    }
  },

  methods: {
    confirmAction: debounce(
      async function() {
        this.isLoading = true;
        if (this.name.length && this.size.length) {
          await this.confirm({
            name: this.name,
            size: this.size
          });
          this.close();
        } else
          this.$buefy.toast.open({
            message: "Selecione o nome e peso!",
            type: "is-danger",
            duration: 5e3
          });
        this.isLoading = false;
      },
      2e3,
      1
    ),

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

.list-name {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
</style>
