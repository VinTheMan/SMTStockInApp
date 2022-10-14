import { XlsxRead } from "vue3-xlsx";
import "vue-good-table-next/dist/vue-good-table-next.css";
import { VueGoodTable } from "vue-good-table-next";
import { GlobalVar } from "../../../../GlobalVar";

// Import the method.
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
          label: "工單(Order)",
          field: "order",
        },
        {
          label: "料號(P/N)",
          field: "pn",
        },
        {
          label: "需求量(Request Qty)",
          field: "needamount",
          type: "number",
        },
        {
          label: "數量(Received Qty)",
          field: "amount",
          type: "number",
        },
      ],
      rows: [],
      Worders: [],
      allldata: [],
    };
  },
  mounted() {
    this.isLoading = true;
    console.log("mount");
    if (sessionStorage.getItem("rNo") !== undefined) {
      const storehouse = document.getElementById("storehouse");
      if (storehouse !== null) {
        storehouse.style.display = "none";
      }
    }
    this.axios
      .post(GlobalVar.API_URL_DEV + "/getorderlist", {})
      .then((response) => {
        this.isLoading = false;
        this.header = true;
        this.Worders.push("所有工單(All)");
        this.alldata = response.data[0];
        for (let i = 0; i < response.data[0].length; i++) {
          if (!this.Worders.includes(response.data[0][i].Worder)) {
            this.Worders.push(response.data[0][i].Worder);
            // const selector = document.getElementById("Worders");
            // const newoption = document.createElement("option");
            // newoption.text = response.data[i].Worder;
            // selector.add(newoption);
          }
          this.rows.push({
            order: response.data[0][i].Worder,
            pn: response.data[0][i].Liaoh,
            needamount: response.data[0][i].rQty,
            amount: response.data[0][i].Qty,
          });
        }
        window.alert("工單發料明細載入完成");
      })
      .catch((error) => {
        this.errorMessage = error.message;
        console.error("There was an error!", error);
        window.alert(error);
        //location.reload();
      });
  },
  methods: {
    onChange(event) {
      const selectworder = event.target.value;
      this.rows = [];
      if (selectworder !== "所有工單(All)") {
        for (let i = 0; i < this.alldata.length; i++) {
          if (this.alldata[i].Worder === selectworder) {
            this.rows.push({
              order: this.alldata[i].Worder,
              pn: this.alldata[i].Liaoh,
              needamount: this.alldata[i].rQty,
              amount: this.alldata[i].Qty,
            });
          }
        }
      } else {
        for (let i = 0; i < this.alldata.length; i++) {
          this.rows.push({
            order: this.alldata[i].Worder,
            pn: this.alldata[i].Liaoh,
            needamount: this.alldata[i].rQty,
            amount: this.alldata[i].Qty,
          });
        }
      }
    },
  },
};
