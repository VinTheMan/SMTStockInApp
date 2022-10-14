import { XlsxRead } from "vue3-xlsx";
import "vue-good-table-next/dist/vue-good-table-next.css";
import { VueGoodTable } from "vue-good-table-next";
import { GlobalVar } from "../../../../GlobalVar";
// Import the method.
import Loading from "vue3-loading-overlay";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";

import * as net from "net";
import { EOF } from "dns";
// Import stylesheet
/* eslint-disable */
("use strict");
// import axios from "axios";
const { networkInterfaces } = require("os");
const nets = networkInterfaces();
const results = Object.create(null); // Or just '{}', an empty object

let socketServer;

import "vue3-loading-overlay/dist/vue3-loading-overlay.css";
export default {
  components: {
    XlsxRead,
    VueGoodTable,
    Loading,
    vSelect
  },

  data() {
    return {
      header: false,
      isLoading: false,
      columns: [
        {
          label: "出倉號",
          field: "outnum"
        },
        {
          label: "供應商",
          field: "supplier"
        },
        {
          label: "棧板號",
          field: "pallet",
          type: "number"
        },
        {
          label: "名碩料號",
          field: "pn"
        },
        {
          label: "需求量",
          field: "needamount",
          type: "number"
        },
        {
          label: "數量",
          field: "amount",
          type: "number"
        },
        {
          label: "入料量",
          field: "inamount",
          type: "number"
        },
        {
          label: "入料卷數",
          field: "inroll",
          type: "number"
        },
        {
          label: "箱數",
          field: "box",
          type: "number"
        },
        {
          label: "工單",
          field: "order"
        }
      ],
      rows: [],
      Worders: [],
      allldata: [],
      storelist: null,
      address: null,
      port: 2000
    };
  },
  mounted() {
    //this.isLoading = true;
    if (sessionStorage.getItem("rNo") !== undefined) {
      const storehouse = document.getElementById("storehouse");
      if (storehouse !== null) {
        storehouse.style.display = "none";
      }
    }
    let alldata = JSON.parse(sessionStorage.getItem("storehousedata") || "0");
    if (sessionStorage.getItem("storehousedata") !== null) {
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
          order: alldata[9][i]
        });
      }
    } else {
      window.alert("尚未上傳外倉入料明細");
      this.isLoading = false;
    }
  },
  methods: {
    myFunc(row, col, cellValue, searchTerm) {
      return row.pn.toString().includes(searchTerm) > 0;
    },
    test(e, test) {
      console.log(e);
      test.rows = [];
    }
  }
};
