import { XlsxRead } from "vue3-xlsx";
import "vue-good-table-next/dist/vue-good-table-next.css";
import { VueGoodTable } from "vue-good-table-next";
import XLSX from "xlsx";
// Import the method.
import Loading from "vue3-loading-overlay";
import { GlobalVar } from "../../../../GlobalVar";

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
      filename: [],
      selectedSheet: null,
      alldata: [[]],
      nameindex: [],
      npmindex: [],
      showsend: false,
      header: false,
      isLoading: false,
      fullPage: true,
      columns: [
        {
          label: "Worder",
          field: "worder",
          type: "string",
        },
        {
          label: "VirtualWorder",
          field: "virtualworder",
          type: "string",
        },
        {
          label: "Name",
          field: "name",
          type: "string",
        },
        {
          label: "StageSlot",
          field: "stageslot",
          type: "string",
        },
        {
          label: "PN",
          field: "pn",
          type: "string",
        },
        {
          label: "rQty",
          field: "rqty",
          type: "number",
        },
        {
          label: "wQty",
          field: "wqty",
          type: "number",
        },
        {
          label: "Total",
          field: "total",
          type: "number",
        },
        {
          label: "ReceiveQty",
          field: "receiveqty",
          type: "number",
        },
      ],
      rows: [],
      orders: [],
      selectmsg: "請選擇料站表文件",
      orderstring: [],
      divide: 1, //連板數
      npmdivide: 1, //NPM機台分單模與雙模
      worder: [], //生產工單
      worderqty: [], //單站需求料件數量
      virtualworder: [], //工單分正反面
      npm: false,
      index: null,
      locationindex: -1, //腳位所在列號
      stageslot: null,
      prestageslot: null,
      qty: null,
      pn: null,
      name: [[]],
    };
  },
  mounted() {
    console.log("mount");
    if (sessionStorage.getItem("rNo") !== undefined) {
      const storehouse = document.getElementById("storehouse");
      if (storehouse !== null) {
        storehouse.style.display = "none";
      }
    }
  },
  //this.alldata[file][sheetindex][row][column]
  methods: {
    onChange(event) {
      for (let i = 0; i < event.target.files.length; i++) {
        this.file = event.target.files ? event.target.files[i] : null;
        if (this.file) {
          this.filename[i] = this.file.name;
          const reader = new FileReader();
          reader.onload = () => {
            /* Parse data */
            const bstr = reader.result;
            const wb = XLSX.read(bstr, { type: "binary" });
            /* Get first worksheet */
            const wscount = wb.SheetNames.length;
            this.alldata[i] = [];
            this.name[i] = [];
            for (let j = 0; j < wscount; j++) {
              const wsname = wb.SheetNames[j];
              this.name[i][j] = wsname;
              const ws = wb.Sheets[wsname];
              const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
              this.alldata[i][j] = data;
              if (wsname === "程式名稱") {
                this.nameindex[i] = j;
                this.orderstring[i] = this.alldata[i][j][0][1].toString();
                this.worderqty[i] = parseInt(
                  this.alldata[i][j][0][6].toString()
                );
              } else if (wsname.includes("NPM")) {
                this.npm[i] = true;
                this.npmindex[i] = j;
              }

              /* Convert array of arrays */
            }
            this.showsend = false;
          };

          reader.readAsBinaryString(this.file);
        }
      }
    },
    async sendtoweb() {
      this.isLoading = true;

      let error = false;
      const alldataarr: any[] = [];
      for (let a = 0; a < this.alldata.length; a++) {
        //loop 檔案
        alldataarr[a] = [];
        if (this.orderstring[a] !== undefined) {
          const temp = this.orderstring[a].split("-");

          if (temp.length === 2) {
            this.divide[a] = parseInt(temp[1]);
          }
          this.virtualworder[a] = temp[0];
        } else {
          const res =
            "檔案:" +
            this.filename[a] +
            "，" +
            "料站表格式錯誤!!第五列必須為標題列";
          window.alert(res);
          location.reload();
          error = true;
        }
        if (!error) {
          if (this.virtualworder[a] === undefined) {
            window.alert(this.filename[a] + "，非料站表檔案");
            location.reload();
          }
        }
        if (
          this.virtualworder[a].includes("B") ||
          this.virtualworder[a].includes("T")
        ) {
          this.worder[a] = this.virtualworder[a]
            .trim()
            .substring(0, this.virtualworder[a].length - 1);
        } else {
          this.worder[a] = this.virtualworder[a].trim();
        }

        for (let i = 0; i < this.alldata[a].length; i++) {
          if (i !== this.nameindex[a]) {
            const row = this.alldata[a][i][4];
            if (
              row !== undefined &&
              row.length > 0 &&
              row[0].toString().toUpperCase().includes("SLOT")
            ) {
              for (let j = 0; j < row.length; j++) {
                if (row[j].toString() === "QTY") {
                  this.index = j;
                } else if (row[j].toString().toUpperCase() === "LOCATIONS") {
                  this.locationindex = j;
                }
              }
            } else {
              const res =
                "檔案:" +
                this.filename[a] +
                "，" +
                "料站表格式錯誤!!第五列必須為標題列";
              window.alert(res);
              location.reload();
            }
          }
        } //for
        if (this.npm[a]) {
          if (this.locationindex >= 0) {
            for (let j = 0; j < this.alldata[a].length; j++) {
              if (j !== this.nameindex[a]) {
                for (let k = 5; k < this.alldata[a][j].length; k++) {
                  const r = this.alldata[a][j][k];
                  if (r === undefined || r.length === 0) {
                    continue;
                  } else if (r.length < this.locationindex + 1) {
                    if (
                      r[0].toString().trim().length > 0 &&
                      parseInt(r[this.index].tostring()) > 0 //站位名稱不能為空
                    ) {
                      this.npmdivide = 2; //站位名稱為空，可能是替代料沒有合併欄位
                      break;
                    }
                  } else if (
                    parseInt(r[this.locationindex].tostring().trim()) === 0
                  ) {
                    if (
                      r[0].toString().trim().length > 0 &&
                      parseInt(r[this.index].tostring()) > 0
                    ) {
                      this.npmdivide = 2;
                      break;
                    }
                  }
                }
              }
              if (this.npmdivide > 1) {
                break;
              }
            }
          }
        } // if npm

        for (let i = 0; i < this.alldata[a].length; i++) {
          // console.log(this.alldata[i]);
          if (i !== this.nameindex[a]) {
            for (let j = 5; j < this.alldata[a][i].length; j++) {
              if (this.alldata[a][i][j].length < 2) {
                continue;
              }

              if (
                this.alldata[a][i][j][0] !== undefined &&
                this.alldata[a][i][j][0].trim().length > 0
              ) {
                this.stageslot = this.alldata[a][i][j][0];
              }
              if (this.stageslot !== this.prestageslot) {
                this.qty = 0;
                if (this.stageslot === "手工置件") {
                  break;
                } else {
                  if (typeof this.alldata[a][i][j][this.index] === "number") {
                    this.qty =
                      (this.worderqty[a] * this.alldata[a][i][j][this.index]) /
                      this.divide /
                      this.npmdivide;
                  } else {
                    for (let z = 0; z < this.alldata[a][i][j].length; z++) {
                      if (typeof this.alldata[a][i][j][z] === "number") {
                        this.qty =
                          (this.worderqty[a] * this.alldata[i][j][z]) /
                          this.npmdivide;
                      }
                    }
                  }
                }
              }
              if (this.alldata[a][i][j].length !== 7) {
                continue;
              } else {
                if (
                  this.alldata[a][i][j][1] !== undefined &&
                  this.alldata[a][i][j][2] !== undefined
                ) {
                  this.pn = this.alldata[a][i][j][1]
                    .toString()
                    .replace("－", "-");
                }
              }
              this.prestageslot = this.stageslot;

              alldataarr[a].push({
                Worder: this.worder[a],
                VirtualWorder: this.virtualworder[a],
                Name: this.name[a][i],
                StageSlot: this.stageslot,
                PN: this.pn,
                rQty: this.qty,
                Total: 0,
                wQty: 0,
                ReceivedQty: 0,
              });
            } //for
          }
        }
        if (!this.orders.includes(this.worder[a])) {
          this.orders.push(this.worder[a]);
        }

        this.divide = 1;
        this.npmdivide = 1;
        this.stageslot = null;
        this.prestageslot = null;
        this.qty = 0;
      }

      console.log(this.virtualworder);
      console.log(this.orders);
      console.log(alldataarr);
      await this.axios
        .post(GlobalVar.API_URL_DEV + "/checkworder", {
          worder: JSON.stringify(this.virtualworder),
          order: JSON.stringify(this.orders),
          Alldata: JSON.stringify(alldataarr),
        })
        .then((response) => {
          // loader.hide();
          this.isLoading = false;
          if (response.data[0][0] !== 0) {
            for (let i = 0; i < this.virtualworder.length; i++) {
              if (this.virtualworder[i] === response.data[1]) {
                window.alert(
                  "料站表:" +
                    this.filename[i] +
                    "中工單已完成過工單排序，需要再次導入請找工程師處理."
                );
              }
            }
          } else {
            if (response.data[0][2].length > 0) {
              let temp = "";
              for (let i = 0; i < response.data[0][2].length; i++) {
                temp = temp + response.data[0][2][i] + "\n";
              }
              window.alert(
                response.data[0][1] +
                  "\n" +
                  "料站表：如下工單無程式料表，無法執行工單分料" +
                  "\n" +
                  temp
              );
            } else {
              window.alert(response.data[0][1]);
            }
            const filelength = response.data[1].length;
            for (let i = 0; i < filelength; i++) {
              const datalength = response.data[1][i].length;
              for (let j = 0; j < datalength; j++) {
                this.rows.push({
                  worder: response.data[1][i][j].Worder,
                  virtualworder: response.data[1][i][j].VirtualWorder,
                  name: response.data[1][i][j].Name,
                  stageslot: response.data[1][i][j].StageSlot,
                  pn: response.data[1][i][j].PN,
                  rqty: response.data[1][i][j].rQty,
                  total: response.data[1][i][j].Total,
                  wqty: response.data[1][i][j].wQty,
                  receiveqty: response.data[1][i][j].ReceivedQty,
                });
              }
            }
          }
          this.header = true;
          this.showsend = true;
          sessionStorage.setItem(
            "programming table",
            JSON.stringify(this.rows)
          );
        })
        .catch((error) => {
          this.errorMessage = error.message;
          console.error("There was an error!", error);
          window.alert(error);
          //location.reload();
        });
    },
  },
};
