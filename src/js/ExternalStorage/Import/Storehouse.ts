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
      selectedSheet: null,
      alldata: null,
      showsend: false,
      header: false,
      isLoading: false,
      fullPage: true,
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
          label: "箱數",
          field: "box",
          type: "number",
        },
      ],
      rows: [],
      selectmsg: "請選擇外倉入料文件",
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
      //外倉入料
      this.isLoading = true;
      //const loader = useLoading();
      // loader.show({
      //   // Optional parameters
      //   color: "#642100",
      //   loader: "spinner",
      //   width: 128,
      //   height: 128,
      //   backgroundColor: "#ADADAD",
      //   opacity: 0.5,
      //   zIndex: 999,
      // });

      let rNo = "";
      const outnum: string[] = [];
      const supplier: string[] = [];
      const pallet: string[] = [];
      const pn: string[] = [];
      const needamount: number[] = [];
      const amount: number[] = [];
      const input: number[] = [];
      const inputroll: number[] = [];
      const box: number[] = [];
      const worder: string[] = [];
      const alldataarr: (string | number)[][] = [];

      const alllength = this.alldata.length;
      for (let i = 0; i < alllength; i++) {
        const allwidth = this.alldata[i].length;
        for (let j = 0; j < allwidth; j++) {
          if (this.alldata[i][j] !== undefined) {
            //console.log(this.alldata[i][j]);
            if (this.alldata[i][j] === "Request NO：") {
              rNo = this.alldata[i][j + 1];
            }
          }
        }
      }
      if (rNo.length > 50) {
        window.alert("rNo : " + rNo + "\n長度大於50，無法匯入!!");
        return false;
      } else {
        if (
          this.alldata[6] !== undefined &&
          this.alldata[6][0].toString() === "出仓号"
        ) {
          if (alllength - 7 >= 7) {
            for (let i = 7; i < alllength; i++) {
              if (pn.includes(this.alldata[i][3])) {
                const index = pn.indexOf(this.alldata[i][3]);
                needamount[index] = needamount[index] + this.alldata[i][4];
                amount[index] = amount[index] + this.alldata[i][5];
                box[index] = box[index] + this.alldata[i][6];
              }
              if (this.alldata[i][3] !== undefined) {
                this.alldata[i][3] = this.alldata[i][3]
                  .toString()
                  .replace("－", "-");
              }
              if (this.alldata[i] !== null && this.alldata[i] !== undefined) {
                outnum[i - 7] = this.alldata[i][0].toString();
                supplier[i - 7] = this.alldata[i][1].toString();
                pallet[i - 7] = this.alldata[i][2].toString();
                pn[i - 7] = this.alldata[i][3].toString();
                needamount[i - 7] = parseInt(this.alldata[i][4]);
                amount[i - 7] = parseInt(this.alldata[i][5]);
                input[i - 7] = 0;
                inputroll[i - 7] = 0;
                box[i - 7] = parseInt(this.alldata[i][6]);
                worder[i - 7] = "";
              }
            }

            alldataarr.push(outnum);
            alldataarr.push(supplier);
            alldataarr.push(pallet);
            alldataarr.push(pn);
            alldataarr.push(needamount);
            alldataarr.push(amount);
            alldataarr.push(input);
            alldataarr.push(inputroll);
            alldataarr.push(box);
            alldataarr.push(worder);

            await this.axios
              .post(GlobalVar.API_URL_DEV + "/insertliaohdetail", {
                AllData: JSON.stringify(alldataarr),
                rNo: JSON.stringify(rNo),
              })
              .then((response) => {
                //loader.hide();
                this.isLoading = false;
                window.alert(response.data[1]);
                if (response.data[0] !== 0) {
                  location.reload();
                } else {
                  sessionStorage.setItem("rNo", rNo);
                  sessionStorage.setItem(
                    "storehousedata",
                    JSON.stringify(alldataarr)
                  );

                  this.header = true;
                  for (let i = 0; i < outnum.length; i++) {
                    this.rows.push({
                      outnum: outnum[i],
                      supplier: supplier[i],
                      pallet: pallet[i],
                      pn: pn[i],
                      needamount: needamount[i],
                      amount: amount[i],
                      box: box[i],
                    });
                  }
                  this.showsend = true;
                }

                const connect = document.getElementById("orderconnect");
                if (connect !== null) {
                  connect.style.display = "block";
                }
              })
              .catch((error) => {
                this.errorMessage = error.message;
                console.error("There was an error!", error);
                window.alert(error);
                //location.reload();
              });
          } else {
            this.isLoading = false;
            window.alert(
              "外倉明細匯入失敗。請確認Excel表欄位分別為：出倉號、供應商、棧板號、名碩料號、需求量、數量、箱數"
            );
            location.reload();
            return false;
          }
        } else {
          window.alert("外倉清單格式不對！！");
          location.reload();
          return false;
        }
      }
    },
  },
};
