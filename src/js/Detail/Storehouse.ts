import { execFile } from "child_process";
import { XlsxRead, XlsxSheets, XlsxJson, XlsxTable } from "vue3-xlsx";
import "vue-good-table-next/dist/vue-good-table-next.css";
import { VueGoodTable } from "vue-good-table-next";
import XLSX from "xlsx";
import { ref } from "vue";
// Import the method.
import { useLoading } from "vue3-loading-overlay";
import Loading from "vue3-loading-overlay";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
// Import stylesheet

import "vue3-loading-overlay/dist/vue3-loading-overlay.css";
export default {
  components: {
    XlsxRead,
    VueGoodTable,
    Loading,
    vSelect,
  },

  data() {
    return {
      header: false,
      isLoading: false,
      columns: [
        {
          label: "出倉號",
          field: "outnum",
        },
        {
          label: "供應商",
          field: "supplier",
        },
        {
          label: "棧板號",
          field: "pallet",
          type: "number",
        },
        {
          label: "名碩料號",
          field: "pn",
        },
        {
          label: "需求量",
          field: "needamount",
          type: "number",
        },
        {
          label: "數量",
          field: "amount",
          type: "number",
        },
        {
          label: "入料量",
          field: "inamount",
          type: "number",
        },
        {
          label: "入料卷數",
          field: "inroll",
          type: "number",
        },
        {
          label: "箱數",
          field: "box",
          type: "number",
        },
        {
          label: "工單",
          field: "order",
        },
      ],
      rows: [],
      Worders: [],
      allldata: [],
      storelist: null,
    };
  },
  mounted() {
    this.isLoading = true;
    console.log("mount");
    // if (JSON.parse(localStorage.getItem("asd")) !== undefined) {
    // }
    if (localStorage.getItem("storehousedata") !== null) {
      const alldata = JSON.parse(localStorage.getItem("storehousedata") || "0");
      for (let i = 0; i < alldata[0].length; i++) {
        this.rows.push({
          outnum: alldata[0][i],
          supplier: alldata[1][i],
          pallet: alldata[2][i],
          pn: alldata[3][i],
          needamount: alldata[4][i],
          amount: alldata[5][i],
          inamount: alldata[6][i],
          inroll: alldata[7][i],
          box: alldata[8][i],
          order: "",
        });
      }
      window.alert("外倉入料明細載入完成");
      this.storelist = sessionStorage.getItem("rNo");
      this.isLoading = false;
      this.header = true;
    }
  },
  methods: {
    myFunc(row, col, cellValue, searchTerm) {
      return row.pn.toString().includes(searchTerm) > 0;
    },
  },
};
