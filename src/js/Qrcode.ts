/* eslint-disable */
("use strict");
import Qrcodeger from "../components/Qrcode_ger/Qrcode_ger.vue";
import * as net from "net";
import { exit, send } from "process";
import { end } from "@popperjs/core";
import { EOF } from "dns";
// import axios from "axios";
const { networkInterfaces } = require("os");
const nets = networkInterfaces();
const results = Object.create(null); // Or just '{}', an empty object

let socketServer;

export default {
  data() {
    return {
      address: null,
      port: 2000,
      componentKey: 0,
      family: "Not Opened",
      server: null,
      dataarr: [
        { data: null },
        { data: null },
        { data: null },
        { data: null },
        { data: null },
        { data: null },
        { data: null }
      ],
      test: null
    };
  },

  mounted() {
    let nrName = "";
    class Pninfor {
      static pn: string;
      static amount: number;
      static maker: string;
      static vendor: string;
      static dc: number;
      static lot: string;
      static rid: string;
    }
    for (const name of Object.keys(nets)) {
      for (const nr of nets[name]) {
        // find self ipv4 address
        // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
        // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
        const familyV4Value = typeof nr.family === "string" ? "IPv4" : 4;
        if (nr.family === familyV4Value && !nr.internal) {
          if (!results[name]) {
            results[name] = [];
          } // if
          results[name].push(nr.address);

          if (nrName === "") {
            nrName = name;
          } // if

          console.log(results); // test
        } // if
      } // for
    } // for
    this.address = results[nrName][0];

    const server = new net.Server();
    socketServer = server;
    this.port = (document.getElementById("port") as HTMLInputElement).value;
    socketServer.listen(this.port);

    socketServer.on("listening", (client) => {
      console.log("We are now open and start listening on port :" + this.port);
      //this.address = results[nrName][0];
      //this.family = socketServer.address().family;
      // var qrcode = document.getElementById('canvasDom');
      // alert(qrcode);
    });

    socketServer.on("connection", (client) => {
      client.on("data", async (data) => {
        console.log("Msg from Client : " + data.toString());
        var alldata = data.toString().replace("；", ";");
        var alldataarr: string[] = alldata.split(";");

        let correct = true;
        if (alldata.length >= 25) {
          //PN格式
          if (alldataarr[0].length > 0) {
            alldataarr[0] = alldataarr[0].replace("－", "-");
            Pninfor.pn = alldataarr[0];
          } else {
            client.write("SALAH BARCODE" + "\n" + "條碼格式錯誤");
            correct = false;
          }
          //數量格式
          if (alldataarr[1].length > 0 && alldataarr[1].charAt(0) == "Q") {
            alldataarr[1] = alldataarr[1].substring(1);
            if (parseInt(alldataarr[1]) > 0)
              Pninfor.amount = parseInt(alldataarr[1]);
            else client.write("QTY SALAH BARCODE" + "\n" + "QTY格式錯誤");
          } else {
            client.write("QTY SALAH BARCODE" + "\n" + "QTY格式錯誤");
            correct = false;
          }
          //Maker格式
          if (alldataarr[2].length > 0) {
            alldataarr[2] = alldataarr[2].substring(1);
            Pninfor.maker = alldataarr[2];
          } else {
            client.write("MAKER SALAH BARCODE" + "\n" + "Maker格式錯誤");
            correct = false;
          }
          //Vendor格式
          if (alldataarr[3].length > 0) {
            alldataarr[3] = alldataarr[3].substring(1);
            Pninfor.vendor = alldataarr[3];
          } else {
            client.write("VENDOR SALAH BARCODE" + "\n" + "Vendor格式錯誤");
            correct = false;
          }
          //Date Code 格式
          var dcerror = this.checkdatecode(alldataarr[4]);
          if (dcerror == -1) {
            client.write("D/C SALAH BARCODE" + "\n" + "D/C格式錯誤");
            correct = false;
          } else if (dcerror == -2) {
            client.write("D/C SALAH BARCODE" + "\n" + "D/C時間錯誤");
            correct = false;
          } else {
            Pninfor.dc = dcerror;
            alldataarr[4] = dcerror;
          }
          //LOT 格式
          if (alldataarr[5].length > 0 && alldataarr[5].charAt(0) == "L") {
            alldataarr[5] = alldataarr[5].substring(1).toUpperCase();
            Pninfor.lot = alldataarr[5];
          } else {
            client.write("LOT SALAH BARCODE" + "\n" + "LOT格式錯誤");
            correct = false;
          }
          //RID 格式
          alldataarr[6] = alldataarr[6].trim();
          alldataarr[6] = alldataarr[6].split(EOF)[0];
          alldataarr[6] = alldataarr[6].split("<")[0];
          if (alldataarr[6].length == 0) {
            client.write("TIDAK ADA REEL ID" + "\n" + "REELID空缺");
            correct = false;
          } else if (alldataarr[6].startsWith("R")) Pninfor.rid = alldataarr[6];
          else {
            client.write("REEL ID SALAH BARCODE" + "\n" + "RID條碼格式錯誤");
            correct = false;
          }
        } else {
          client.write("SALAH BARCODE" + "\n" + "條碼格式錯誤");
          correct = false;
        }

        if (correct) {
          for (let i = 0; i < 7; i++) {
            this.dataarr[i] = alldataarr[i];
          }
          await this.sendData(alldataarr).then((value) => {
            if (value[0] > 0) {
              client.write("OK;" + "\n" + "Correct");
              console.log("ok");
            } else if (value[0] === -1) {
              client.write(
                "D/C SALAH BARCODE" + "\n" + "沒有D/C管控，不能入料"
              );
            } else if (value[0] == -2) {
              client.write("D/C EXPIRED" + "\n" + "D/C過期，請找組長確認");
            } else if (value[0] == -3) {
              client.write(
                "REEL ID TERULANG(" +
                  "\n" +
                  value[1] +
                  "-" +
                  value[2] +
                  ")" +
                  "\n" +
                  "REELID重複(" +
                  value[1] +
                  "-" +
                  value[2] +
                  ")"
              );
            } else if (value[0] == -4) {
              client.write(
                "REEL ID TERULANG" +
                  "\n" +
                  "(" +
                  value[1] +
                  "-MATERIAL TIDAK ADA NOMOR)" +
                  "REELID重複" +
                  "\n" +
                  "(" +
                  value[1] +
                  "-無對應縮號)"
              );
            } else if (value[0] == -5) {
              client.write(
                "REEL ID TERULANG" +
                  "\n" +
                  "(MATERIAL TIDAK ADA NOMOR)" +
                  "\n" +
                  "Reel ID重複(" +
                  "無對應工單，上架)"
              );
            } else if (value[0] == -6) {
              client.write(
                "MATERIAL TIDAK ADA NOMOR" + "\n" + "無對應工單，上架"
              );
            } else if (value[0] == -7) {
              client.write(
                "Material Programming" + "\n" + "燒錄料，無法分工單"
              );
            } else if (value[0] == -8) {
              client.write(
                value[1] +
                  "-TIDAK ADA NOMOR" +
                  "\n\n" +
                  value[1] +
                  "-無對應縮號"
              );
            }
          });
        }
      });
      client.on("close", () => {
        console.log("Client closed their connections");
      });
      // 若條碼內容正確則PDA會收到 [OK;[工單號(可能是單面板、Top、Bottom或無工單需求)]-[Integer]]
    });

    socketServer.on("close", () => {
      console.log("All connections are closed !");
      //   this.address = "Not Opened";
      //   this.family = "Not Opened";
      //   this.port = "Not Opened";
    });
  },
  unmounted() {
    socketServer.close();
  },
  components: {
    Qrcodeger
  },
  methods: {
    // do nothing for now
    forceRerender() {
      this.componentKey += 1;
      try {
        console.log(
          "Closing... (will not fully close if there exist connections, but will stop accepting new connections.)"
        );
        socketServer.close();
      } catch (error) {
        console.error(error);
      } // try-catch
      if (socketServer.listening) {
        // then dont start new listen method
      } // if
      else {
        socketServer.listen(this.port);
      } // else
    },

    async sendData(alldataarr) {
      let test = 0;
      alldataarr.push(sessionStorage.getItem("rNo"));
      await this.axios
        .post("http://192.168.164.51:8088/api/getdata", {
          AllData: JSON.stringify(alldataarr)
        })
        .then((response) => {
          // console.log(response.data);
          console.log(response.status);
          test = response.data;
        })
        .catch((error) => {
          this.errorMessage = error.message;
          console.error("There was an error!", error);
        });

      return test;
    },

    checkdatecode(datecode) {
      let currentdate = new Date();
      var oneJan = new Date(currentdate.getFullYear(), 0, 1);
      var numberOfDays = Math.floor(
        (Number(currentdate) - Number(oneJan)) / (24 * 60 * 60 * 1000)
      );
      var result = Math.ceil((currentdate.getDay() + 1 + numberOfDays) / 7); //get now week number
      if (result < 10) var resultstr = "0" + result.toString();
      else resultstr = result.toString();

      if (datecode.includes("D")) {
        datecode = datecode.substring(datecode.lastIndexOf("D") + 1);
        if (parseInt(datecode) <= 0 || isNaN(parseInt(datecode))) return -1;
      } else {
        if (parseInt(datecode) <= 0 || isNaN(parseInt(datecode))) return -1;
      }

      if (datecode.length == 8) {
        var weeknum = this.getweeknumber(datecode);
        datecode = datecode.toString().substring(2, 4) + weeknum;
        //return datecode;
      } else if (datecode.length == 6) {
        var input = "20" + datecode.toString();
        var weeknum = this.getweeknumber(input);
        datecode = datecode.toString().substring(0, 2) + weeknum;
        //return datecode;
      } else if (datecode.length == 4) {
      }
      var nowyear = new Date().getFullYear();
      if (
        Number(nowyear.toString().substring(2, 4) + resultstr) -
          Number(datecode) <
        0
      )
        return -2;
      else return datecode;
    },

    getweeknumber(input) {
      input =
        input.substring(0, 4) +
        "-" +
        input.substring(4, 6) +
        "-" +
        input.substring(6, 8);

      let currentdate = new Date(input);
      var oneJan = new Date(currentdate.getFullYear(), 0, 1);
      var numberOfDays = Math.floor(
        (Number(currentdate) - Number(oneJan)) / (24 * 60 * 60 * 1000)
      );
      var result = Math.ceil((currentdate.getDay() + 1 + numberOfDays) / 7); //get now week number
      if (result < 10) return "0" + result.toString();
      else return result;
    }
  }
};
