<template>
  <section>

    <aside class="is-hidden-desktop">
      <b-input
        v-model="searchName"
        placeholder="Pesquisar..."
        icon="magnify"
        size="is-small"
      />
    </aside>
    <b-table
      checkable
      :data="data"
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
              @icon-click="searchCode(props.index)"
              icon-right="barcode-scan"
              icon-right-clickable
              @icon-right-click="readImg(props.index)"
            />
            <input
              type="file"
              accept="image/*;capture=camera"
              class="is-hidden"
              @change="(event) => checkImg(event, props.index)"
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
          <b-button type="is-primary" @click="create(props.index)">
            <b-icon icon="plus" />
          </b-button>
        </section>
      </b-table-column>
    </b-table>
  </section>
</template>

<script>
import Quagga from "quagga";
export default {
  name: "ListSearch",
  data() {
    return {
      searchName: "",
      listItensSelected: [],
      data: [
        {
          id: 1,
          code: '',
          count: 0,
          name: '',
          size: '',
          codeReading: false,
          date: (new Date).toISOString().split('T')[0],
        },
      ],
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
  methods: {
    create(ref) {
      console.log(ref)
      this.data.unshift({
        id:  1,
        code: '',
        count: 0,
        name: '',
        size: '',
        codeReading: false,
        date: (new Date).toISOString().split('T')[0],
      });
    },
    readImg(ref) {
      this.$refs[`inputImage_${ref}`][0].click();
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
    searchCode(ref) {
      const code = this.data[ref].code;
      if (code.length > 12)
        this.changeItem(ref, { codeResult: { code } });
    },
    changeItem(ref, data) {
      const item = this.data[ref];
      if (data.codeResult) {
        item.code = data.codeResult.code;
        this.searchInGoogle(item.code).then(results=> {
          const extractValues = this.formartDescrition(results[0].title)
          item.name = extractValues.name;
          item.size = extractValues.size;
          this.data = [...this.data];
        })
      } else {
        this.$buefy.snackbar.open({
          message: "Houve uma falha ao tentar ler o código de barras",
          position: "is-top",
          duration: 5e3
        });
      }
      item.codeReading = false;
      this.data = [...this.data];
    },
    async searchInGoogle(query) {
      return await fetch("https://www.googleapis.com/customsearch/v1?q="+query+""+process.env.KEYS).then(el=>el.json()).then(el=>el.items);
    },
    async checkImg(event, ref) {
      const item = this.data[ref];
      item.codeReading = true;
      const file = event.target.files[0];
      file.result = await this.getBase64(file);
      Quagga.decodeSingle(
        {
          inputStream: { size: 1280 },
          locator: { patchSize: "medium", halfSample: true },
          numOfWorkers: 1,
          decoder: { readers: [{ format: "ean_reader", config: {} }] },
          locate: true,
          src: file.result,
        },
        result => this.changeItem(ref, result)
      );
    },
  },
};
</script>
