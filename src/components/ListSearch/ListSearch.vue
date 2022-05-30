<template>
  <section>
    <article class="is-flex px-4 py-2">
      <b-checkbox-button
        v-model="modeView"
        @input="changeMode"
        type="is-orange"
        class="flex-1"
      >
        Lista de compras
      </b-checkbox-button>
    </article>
    <b-table class="form" v-if="modeView">
      <template #footer>
        <th class="is-hidden-desktop">
          <b-field
            label="Filtro"
            type="is-success"
            message="Filtrar itens por aqui"
          >
            <b-input
              type="is-success"
              v-model="searchName"
              placeholder="Pesquisar..."
              icon="magnify"
            />
          </b-field>
        </th>
        <th>
          <b-input
            type="number"
            placeholder="Código"
            v-model="newItem.code"
            :loading="newItem.codeReading"
            icon="magnify"
            icon-clickable
            @icon-click="searchManualCode(newItem)"
            icon-right="barcode-scan"
            icon-right-clickable
            @icon-right-click="readImg('new')"
          />
          <input
            type="file"
            accept="image/*;capture=camera"
            class="is-hidden"
            @change="event => checkImg(event, newItem)"
            ref="inputImage_new"
          />
        </th>
        <th>
          <b-input type="text" placeholder="Nome" v-model="newItem.name" />
        </th>
        <th>
          <b-input type="text" placeholder="Peso" v-model="newItem.size" />
        </th>
        <th>
          <b-input type="date" placeholder="Data" v-model="newItem.date" />
        </th>
        <th>
          <b-input
            type="number"
            placeholder="Quantidade"
            v-model="newItem.count"
            min="1"
          />
        </th>
        <th class="is-flex">
          <b-button type="is-primary" class="flex-1" @click="create()">
            <b-icon icon="plus" />
            <span class="is-hidden-desktop">Adicionar</span>
          </b-button>
        </th>
      </template>
    </b-table>
    <b-table
      v-if="modeView"
      :paginated="true"
      :per-page="10"
      :pagination-rounded="true"
      checkable
      :data="getListItens(searchName)"
      :checked-rows.sync="listItensSelected"
      :debounce-search="500"
    >
      <template v-for="column in columns">
        <b-table-column
          :key="column.id"
          v-bind="column"
          :sortable="column.sortable"
        >
          <template v-if="column.searchable" #searchable="props">
            <b-datepicker
              v-if="column.type === 'batata'"
              placeholder="Pesquisar..."
              v-model="props.filters[props.column.field]"
              range
            />
            <b-input
              v-else
              v-model="props.filters[props.column.field]"
              placeholder="Pesquisar..."
              icon="magnify"
              size="is-small"
            />
          </template>
          <template v-slot="props" v-if="column.field === 'code'">
            <b-input
              type="text"
              v-model="props.row.code"
              :loading="props.row.codeReading"
              icon="magnify"
              icon-clickable
              @icon-click="searchManualCode(props.row)"
              icon-right="barcode-scan"
              icon-right-clickable
              @icon-right-click="readImg(props.index)"
            />
            <input
              type="file"
              accept="image/*;capture=camera"
              class="is-hidden"
              @change="event => checkImg(event, props.row)"
              :ref="`inputImage_${props.index}`"
            />
          </template>
          <template v-slot="props" v-else>
            <b-input
              :type="column.type || 'text'"
              v-model="props.row[column.field]"
            />
          </template>
        </b-table-column>
      </template>
      <b-table-column label="Actions" v-slot="props">
        <section class="buttons">
          <b-button type="is-orange" @click="editProduct(props.row)">
            <b-icon icon="pen" />
          </b-button>
          <b-button
            type="is-danger"
            class="ml-2"
            @click="confirmModalDelete(props.row)"
          >
            <b-icon icon="delete" />
          </b-button>
        </section>
      </b-table-column>
    </b-table>
    <section v-else class="p-4">
      <div class="item py-2 is-size-5" v-for="item in buyList" :key="item.id">
        <b-checkbox v-model="item.buy" type="is-success">
          <p>{{ item.name }}</p>
          <p>
            <span class="has-text-weight-semibold">Peso: </span>
            <span>{{ item.size }}</span>
          </p>
          <p>
            <span class="has-text-weight-semibold">Quantidade: </span>
            <span>{{ item.count }}</span>
          </p>
        </b-checkbox>
      </div>
    </section>
  </section>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import { General } from "@/utils/constants";
import { readBarCode } from "@/utils/readCode";
import ModalWarning from "@/components/ModalWarning/ModalWarning";
import ModalListSearch from "@/components/ModalListSearch/ModalListSearch";
import debounce from "buefy/src/utils/debounce";

export default {
  name: "ListSearch",
  data() {
    return {
      searchName: "",
      listItensSelected: [],
      modeView: true,
      newItem: {
        id: Math.random()
          .toString(16)
          .slice(2),
        code: "",
        count: 1,
        name: "",
        size: "",
        codeReading: false,
        date: new Date().toISOString().split("T")[0]
      },
      General,
      columns: [
        {
          field: "code",
          label: "Código",
          searchable: true,
          sortable: true
        },
        {
          field: "name",
          label: "Nome",
          searchable: true,
          sortable: true
        },
        {
          field: "size",
          label: "Peso",
          searchable: true,
          sortable: true
        },
        {
          field: "date",
          label: "Data",
          type: "date",
          searchable: true,
          centered: true,
          sortable: true
        },
        {
          field: "count",
          label: "Quantidade",
          type: "number",
          sortable: true
        }
      ]
    };
  },
  computed: {
    ...mapGetters(["getListItens", "getListBuys"]),
    buyList: {
      get() {
        return this.getListBuys;
      },
      set(value) {
        this.setListItens(value);
      }
    }
  },
  methods: {
    ...mapMutations(["editItem", "setListItens"]),
    ...mapActions([
      "addProduct",
      "editProduct",
      "removeProduct",
      "searchCodeInGoogle",
      "listItensRequest"
    ]),
    create: debounce(
      function() {
        if (this.newItem.count === 0) {
          this.$buefy.toast.open({
            message: "A quantidade não pode ser menor que 1(um)!",
            type: "is-danger",
            duration: 5e3
          });
          return;
        }
        this.addProduct(this.newItem);
        this.newItem = {
          id: ((Math.random() + Date.now()) * 1e4).toString(36),
          code: "",
          count: 1,
          name: "",
          size: "",
          codeReading: false,
          date: new Date().toISOString().split("T")[0]
        };
      },
      1e3,
      1
    ),
    readImg(ref) {
      if (ref === "new") this.$refs[`inputImage_new`].click();
      else this.$refs[`inputImage_${ref}`][0].click();
    },
    async getBase64(file) {
      return new Promise((res, rej) => {
        try {
          var reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = function() {
            res(reader.result);
          };
          reader.onerror = function(error) {
            rej("Error: ", error);
          };
        } catch (error) {
          rej(error);
        }
      });
    },
    formartDescrition(listObject) {
      let sizes = [];
      let titles = [];
      function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
      }
      sizes = JSON.stringify(listObject)
        .match(/ \d{1,4}[gklmrund]{1,4}/gi)
        .map(size => size.trim())
        .filter(onlyUnique)
        .sort((first, second) => first.localeCompare(second));

      const regExp = RegExp(sizes.join("|"), "i");
      titles = listObject
        .map(item => item.title.replace(regExp, ""))
        .filter(onlyUnique)
        .sort((first, second) => first.localeCompare(second));

      return {
        titles,
        sizes: sizes.filter(onlyUnique)
      };
    },
    searchManualCode(item) {
      const code = item.code;
      if (code.length > 12) this.changeItem(item, { codeResult: { code } });
    },
    changeItem(item, data) {
      if (data.codeResult) {
        item.code = data.codeResult.code;
        this.searchCodeInGoogle(item.code).then(results => {
          const listOptions = this.formartDescrition(results);
          this.showModalSelectSearch(listOptions, option => {
            item.name = option.name;
            item.size = option.size;
            this.editItem(item);
          });
        });
      } else {
        this.$buefy.snackbar.open({
          message: "Houve uma falha ao tentar ler o código de barras",
          position: "is-top",
          duration: 5e3
        });
      }
      item.codeReading = false;
    },
    async checkImg(event, item) {
      item.codeReading = true;
      this.editItem(item);
      const file = event.target.files[0];
      file.result = await this.getBase64(file);
      readBarCode(file.result, result => this.changeItem(item, result));
    },
    confirmModalDelete(item) {
      this.$buefy.modal.open({
        parent: this,
        component: ModalWarning,
        props: {
          title: `${this.General.WARNING}!`,
          message: `${General.MESSAGES.CONFIRM_DELETE_ITEM.replace(
            "(CODE)",
            item.code
          ).replace("(NAME)", item.name)}`,
          confirm: () => {
            this.removeProduct(item.id);
          },
          buttons: [
            { label: General.YES, isConfirm: false, action: true },
            { label: General.NO, isConfirm: true, action: false }
          ]
        },
        hasModalCard: true,
        trapFocus: true
      });
    },
    showModalSelectSearch(list, confirm) {
      this.$buefy.modal.open({
        parent: this,
        component: ModalListSearch,
        props: {
          list,
          confirm
        },
        hasModalCard: true,
        trapFocus: true
      });
    },
    changeMode(value) {
      console.log(this);
      this.$router.push({
        path: value ? "/compras" : "/",
        query: { hash: this.$router.currentRoute.query.hash }
      });
    }
  },
  beforeMount() {
    this.modeView = this.$route.name === "home";
    const hash = this.$router.currentRoute.query.hash;
    if (hash && hash !== "yes") {
      this.$connect();
      setTimeout(() => {
        this.listItensRequest(hash);
      }, 1e3);
    } else if (hash) {
      this.$router.push({
        path: `?hash=${((Math.random() + Date.now()) * 1e4).toString(36)}`
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.flex-1 {
  flex: 1;
}
.icon {
  vertical-align: bottom;
}
.buttons {
  min-width: 100px;
}
</style>
<style lang="scss">
.form tbody {
  display: none !important;
}
</style>
