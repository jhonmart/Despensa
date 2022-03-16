<template>
  <section>
    <b-table class="form">
      <template #footer>
        <th class="is-hidden-desktop">
          <b-field label="Filtro"
            type="is-success"
            message="Filtrar itens por aqui">
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
            type="text"
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
            @change="(event) => checkImg(event, newItem)"
            ref="inputImage_new"
          />
        </th>
        <th>
        <b-input
          type="text"
            placeholder="Nome"
          v-model="newItem.name"
        />
        </th>
        <th>
        <b-input
          type="text"
          placeholder="Quantidade"
          v-model="newItem.size"
        />
        </th>
        <th>
        <b-input
          type="date"
            placeholder="Data"
          v-model="newItem.date"
        />
        </th>
        <th>
        <b-input
          type="number"
            placeholder="Quantidade"
          v-model="newItem.count"
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
      checkable
      :data="getListItens(searchName)"
      :checked-rows.sync="listItensSelected"
      :debounce-search="500"
    >
      <template v-for="column in columns">
        <b-table-column :key="column.id" v-bind="column">
          <template
            v-if="column.searchable"
            #searchable="props"
          >
            <b-input
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
              @change="(event) => checkImg(event, props.row)"
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
        <section>
          <b-button type="is-orange" @click="editItem(props.row)">
            <b-icon icon="pen" />
          </b-button>
          <b-button type="is-danger" class="ml-2" @click="removeItemById(props.row.id)">
            <b-icon icon="delete" />
          </b-button>
        </section>
      </b-table-column>
    </b-table>
  </section>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import { readBarCode } from "@/utils/readCode";

export default {
  name: "ListSearch",
  data() {
    return {
      searchName: "",
      listItensSelected: [],
      newItem: {
        id: Math.random().toString(16).slice(2),
        code: '',
        count: 0,
        name: '',
        size: '',
        codeReading: false,
        date: (new Date).toISOString().split('T')[0]
      },
      columns: [
        {
          field: "code",
          label: "Código",
          searchable: true,
        },
        {
          field: "name",
          label: "Nome",
          searchable: true,
        },
        {
          field: "size",
          label: "Peso",
          searchable: true,
        },
        {
          field: "date",
          label: "Data",
          type: "date",
          centered: true,
        },
        {
          field: "count",
          label: "Quantidade",
          type: "number"
        },
      ],
    };
  },
  computed: {
    ...mapGetters([
      "getListItens"
    ])
  },
  methods: {
    ...mapMutations([
      "insertNewItem",
      "removeItemById",
      "editItem"
    ]),
    ...mapActions([
      "searchCodeInGoogle"
    ]),
    create() {
      this.insertNewItem(this.newItem);
      this.newItem = {
        id: Math.random().toString(16).slice(2),
        code: '',
        count: 0,
        name: '',
        size: '',
        codeReading: false,
        date: (new Date).toISOString().split('T')[0]
      };
    },
    readImg(ref) {
      if (ref === "new") this.$refs[`inputImage_new`].click()
      else this.$refs[`inputImage_${ref}`][0].click();
    },
    async getBase64(file) {
      return new Promise((res, rej) => {
        try {
          var reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = function () {
            res(reader.result);
          };
          reader.onerror = function (error) {
            rej("Error: ", error);
          };
        } catch (error) {
          rej(error);
        }
      });
    },
    formartDescrition(name) {
      const size = name.match(/\d+\w{2,3}/) || [""];
      const newName = size ? name.replace(size[0], "") : name;
      return { name: newName.padronize(), size: size[0] };
    },
    searchManualCode(item) {
      const code = item.code;
      if (code.length > 12)
        this.changeItem(item, { codeResult: { code } });
    },
    changeItem(item, data) {
      if (data.codeResult) {
        item.code = data.codeResult.code;
        this.searchCodeInGoogle(item.code).then(results=> {
          const extractValues = this.formartDescrition(results[0].title)
          item.name = extractValues.name;
          item.size = extractValues.size;
          this.editItem(item);
        });
      } else {
        this.$buefy.snackbar.open({
          message: "Houve uma falha ao tentar ler o código de barras",
          position: "is-top",
          duration: 5e3
        });
      }
      item.codeReading = false;
      this.editItem(item);
    },
    async checkImg(event, item) {
      item.codeReading = true;
      this.editItem(item);
      const file = event.target.files[0];
      file.result = await this.getBase64(file);
      readBarCode(file.result, result => this.changeItem(item, result));
    },
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
</style>