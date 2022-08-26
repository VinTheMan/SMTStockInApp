<!-- eslint-disable vue/multi-word-component-names -->

<template>
  <div>
    <input type="file" @change="onChange" accept=".xlsx, .xls, .csv" />
    <xlsx-read :file="file">
      <xlsx-sheets>
        <template #default="{ sheets }">
          <select v-model="selectedSheet" @change="getdata">
            <option
              v-for="(sheet, index) in sheets"
              :key="sheet"
              :value="index"
            >
              {{ sheet }}
            </option>
          </select>
          <xlsx-table v-model="selectedSheet" :sheet="selectedSheet" />
        </template>
      </xlsx-sheets>
    </xlsx-read>
    <button @click="sendtoweb(file)" v-if="file">send</button>
  </div>
</template>

<script>
import { XlsxRead, XlsxSheets, XlsxJson, XlsxTable } from "vue3-xlsx";
import XLSX from "xlsx";
export default {
  components: {
    XlsxRead,
    XlsxTable,
    XlsxSheets,
  },
  data() {
    return {
      file: null,
      selectedSheet: null,
      alldata: null,
    };
  },
  methods: {
    onChange(event) {
      this.file = event.target.files ? event.target.files[0] : null;
    },
    getdata() {
      console.log(this.selectedSheet);
      if (this.file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          /* Parse data */
          const bstr = e.target.result;
          const wb = XLSX.read(bstr, { type: "binary" });
          /* Get first worksheet */
          const wsname = wb.SheetNames[this.selectedSheet];
          const ws = wb.Sheets[wsname];
          /* Convert array of arrays */
          const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
          this.alldata = data;
        };

        reader.readAsBinaryString(this.file);
      }
    },
    sendtoweb() {
      console.log(this.selectedSheet);

      console.log(this.alldata);
    },
  },
};
</script>
