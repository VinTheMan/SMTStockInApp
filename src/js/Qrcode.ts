/* eslint-disable */
("use strict");
import Qrcodeger from "../components/Qrcode_ger/Qrcode_ger.vue";
import * as net from "net";
import { exit, send } from "process";
import { end } from "@popperjs/core";
import { EOF } from "dns";
import axios from "axios";
const { networkInterfaces } = require("os");
const nets = networkInterfaces();
const results = Object.create(null); // Or just '{}', an empty object

let socketServer;

export default {
  data() {
    return {
      address: null,
      port: 8089,
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
  //   beforeMount() {
  //     // do nothing for now
  //     let nrName = "";
  //     for (const name of Object.keys(nets)) {
  //       for (const nr of nets[name]) {
  //         // find self ipv4 address
  //         // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
  //         // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
  //         const familyV4Value = typeof nr.family === "string" ? "IPv4" : 4;
  //         if (nr.family === familyV4Value && !nr.internal) {
  //           if (!results[name]) {
  //             results[name] = [];
  //           } // if
  //           results[name].push(nr.address);

  //           if (nrName === "") {
  //             nrName = name;
  //           } // if

  //           console.log(results); // test
  //         } // if
  //       } // for
  //     } // for
  //     this.address = results[nrName][0];
  //   },
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
    socketServer.listen(this.port);

    socketServer.on("listening", (client) => {
      console.log("We are now open and start listening on port :" + this.port);
      //this.address = results[nrName][0];
      this.family = socketServer.address().family;
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
          var dcerror = checkdatecode(alldataarr[4]);
          if (dcerror == -1) {
            client.write("D/C SALAH BARCODE" + "\n" + "D/C格式錯誤");
            correct = false;
          } else if (dcerror == -2) {
            client.write("D/C SALAH BARCODE" + "\n" + "D/C時間錯誤");
            correct = false;
          } else Pninfor.dc = dcerror;
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
          }
          if (alldataarr[6].startsWith("R")) Pninfor.rid = alldataarr[6];
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

          await sendData(alldataarr).then((value) => {
            client.write("113");

            console.log(value); // "Success"
          });
          //   sendData(alldataarr, code);
          //   sendData(alldataarr).then((value) => {
          //     console.log(value); // "Success"
          //     client.write("test");
          //   });
          //   axios
          //     .post("http://127.0.0.1:8088/api/test", {
          //       var1: alldataarr[0],
          //       var2: alldataarr[1],
          //       var3: alldataarr[2],
          //       var4: alldataarr[3],
          //       var5: alldataarr[4],
          //       var6: alldataarr[5],
          //       var7: alldataarr[6]
          //     })
          //     .then((response) => {
          //       if (response.data[0] == -1) {
          //         this.code = -1;
          //       }
          //       this.test = response.data[0];
          //       console.log(response.data);
          //     })
          //     .catch((error) => {
          //       this.errorMessage = error.message;
          //       console.error("There was an error!", error);
          //     });
          // .finally(() => {
          //   if (this.code == -1) {
          //     client.write(
          //       "D/C SALAH BARCODE" + "\n" + "沒有D/C管控，不能入料"
          //     );
          //   }
          // });]
          //   console.log("test");
          //   //   client.write("OK;" + "\n" + "Correct");

          //   setTimeout(function () {
          //     console.log("123");
          //   }, 5 * 1 * 1000); // after 5s
          //   } else {
          //     client.write("OK;" + "\n" + "Correct");
          //   }
        }
      });
      client.on("close", () => {
        console.log("Client closed their connections");
      });
      // 若條碼內容正確則PDA會收到 [OK;[工單號(可能是單面板、Top、Bottom或無工單需求)]-[Integer]]
    });

    socketServer.on("close", () => {
      console.log("All connections are closed !");
      //this.address = "Not Opened";
      this.family = "Not Opened";
    });
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
    }
  }
};
function checkdatecode(datecode) {
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
    var weeknum = getweeknumber(datecode);
    datecode = datecode.toString().substring(2, 4) + weeknum;
    //return datecode;
  } else if (datecode.length == 6) {
    var input = "20" + datecode.toString();
    var weeknum = getweeknumber(input);
    datecode = datecode.toString().substring(0, 2) + weeknum;
    //return datecode;
  } else if (datecode.length == 4) {
  }
  var nowyear = new Date().getFullYear();
  if (
    Number(nowyear.toString().substring(2, 4) + resultstr) - Number(datecode) <
    0
  )
    return -2;
  else return datecode;
}

function getweeknumber(input) {
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
async function sendData(alldataarr) {
  let test = 0;
  await axios
    .post("http://127.0.0.1:8088/api/test", {
      var1: alldataarr[0],
      var2: alldataarr[1],
      var3: alldataarr[2],
      var4: alldataarr[3],
      var5: alldataarr[4],
      var6: alldataarr[5],
      var7: alldataarr[6]
    })
    .then((response) => {
      //   if (response.data[0] == -1) {
      //     code = -1;
      //   } else {
      //     code = 2;
      //   }
      //   //   this.test = response.data[0];
      //   return code;
      console.log(response.data[0]);
      test = response.data[0];
    })
    .catch((error) => {
      this.errorMessage = error.message;
      console.error("There was an error!", error);
    });

  return test;
}

// async function showresult(alldataarr, code, client) {
//   console.log(code);

//   await sendData(alldataarr).then((value) => {
//     console.log(value);
//     code = value;
//   });

//   //client.write("SALAH BARCODE" + "\n" + "條碼11格式錯誤");
//   console.log("++++++++++++++++++++++++++++++++");
//   return code;
// }
