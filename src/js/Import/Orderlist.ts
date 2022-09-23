import { execFile } from "child_process";
import { XlsxRead, XlsxSheets, XlsxJson, XlsxTable } from "vue3-xlsx";
import "vue-good-table-next/dist/vue-good-table-next.css";
import { VueGoodTable } from "vue-good-table-next";
import XLSX from "xlsx";
import { ref } from "vue";
// Import the method.
import { useLoading } from "vue3-loading-overlay";
import Loading from "vue3-loading-overlay";

// Import stylesheet

import "vue3-loading-overlay/dist/vue3-loading-overlay.css";
export default {
  components: {
    XlsxRead,
    VueGoodTable,
    Loading,
  },

  data() {
    return {
      file: null,
      selectedSheet: null,
      alldata: null,
      showsend: false,
      header: false,
      isLoading: false,
      fullPage: true,
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
      selectmsg: "請選擇工單明細文件",
    };
  },
  mounted() {
    console.log("mount");
  },
  methods: {
    onChange(event) {
      this.file = event.target.files ? event.target.files[0] : null;
      if (this.file) {
        const reader = new FileReader();
        reader.onload = () => {
          /* Parse data */
          const bstr = reader.result;
          const wb = XLSX.read(bstr, { type: "binary" });
          /* Get first worksheet */
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          /* Convert array of arrays */
          const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
          this.alldata = data;
          this.showsend = false;
        };

        reader.readAsBinaryString(this.file);
      }
    },
    async sendtoweb() {
      this.isLoading = true;
      const worder: string[] = [];
      const pn: string[] = [];
      const rqty: number[] = [];
      const alldataarr: (string | number)[][] = [];

      const alllength = this.alldata.length;

      if (
        this.alldata[0] !== undefined &&
        this.alldata[0][0].toString().toLowerCase() === "order" &&
        this.alldata[0][1].toString().toLowerCase() === "material"
      ) {
        for (let i = 1; i < alllength; i++) {
          if (
            this.alldata[i][0] !== undefined &&
            parseInt(this.alldata[i][4]) !== 0
          ) {
            if (this.alldata[i][1] !== undefined) {
              this.alldata[i][1] = this.alldata[i][1]
                .toString()
                .replace("－", "-");
            }
            if (this.alldata[i] !== null) {
              worder[i - 1] = this.alldata[i][0].toString();
              pn[i - 1] = this.alldata[i][1].toString();
              rqty[i - 1] = parseInt(this.alldata[i][4].toString());
            }
          } else {
            continue;
          }
        }

        alldataarr.push(worder);
        alldataarr.push(pn);
        alldataarr.push(rqty);

        await this.axios
          .post("http://192.168.164.51:8088/api/insertorderlist", {
            AllData: JSON.stringify(alldataarr),
          })
          .then((response) => {
            this.isLoading = false;
            if (response.data[0] !== 0) {
              window.alert(
                "讀取第" +
                  response.data[1] +
                  "列，發生錯誤!!" +
                  "\n" +
                  "工單:" +
                  response.data[2] +
                  "重複，請找工程師確認？？需要重新導入請先清空orderlist中對應工單明細!!"
              );
              location.reload();
            } else {
              this.header = true;
              for (let i = 0; i < worder.length; i++) {
                this.rows.push({
                  order: worder[i],
                  pn: pn[i],
                  needamount: rqty[i],
                  amount: 0,
                });
              }
              window.alert(response.data[1]);
              this.showsend = true;
              //   this.index += 1;
              //   this.selectmsg = "請選擇工單發料明細";
              //this.$router.push("/test/import1");
              this.selectmsg = "請選擇料站表文件";
            }
          })
          .catch((error) => {
            this.errorMessage = error.message;
            console.error("There was an error!", error);
            window.alert(error);
            //location.reload();
          });
      } else {
        window.alert("請確認是否為正確的工單發料明細");
        return false;
      }
    },
  },
};
