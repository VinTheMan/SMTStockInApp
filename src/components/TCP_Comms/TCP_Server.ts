/* eslint-disable */
"use strict";
import * as net from "net";
const { networkInterfaces } = require("os");
const nets = networkInterfaces();
const results = Object.create(null); // Or just '{}', an empty object

let socketServer;
export default {
  name: "tcp-server",
  data() {
    return {
      address: "Not Opened",
      port: "8085",
      family: "Not Opened",
      server: null
    };
  },
  mounted() {
    let nrName = "";
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

    const server = new net.Server();
    socketServer = server;

    socketServer.on("listening", () => {
      console.log("We are now open and start listening on port :" + this.port);
      this.address = results[nrName][0];
      this.family = socketServer.address().family;
      // var qrcode = document.getElementById('canvasDom');
      // alert(qrcode);
    });

    socketServer.on("close", () => {
      console.log("All connections are closed !");
      this.address = "Not Opened";
      this.family = "Not Opened";
    });

    socketServer.on("connection", (client) => {
      client.on("data", (data) =>
        console.log("Msg from Client : " + data.toString())
      );
      client.on("close", () => console.log("Client closed their connections"));
      // 若條碼內容正確則PDA會收到 [OK;[工單號(可能是單面板、Top、Bottom或無工單需求)]-[Integer]]
      client.write("OK;單面板-123"); // correct msg example return from External Storage App
    });
  },
  methods: {
    startListening() {
      if (socketServer.listening) {
        // then dont start new listen method
      } // if
      else {
        socketServer.listen(8085);
      } // else
    },
    stopListening() {
      try {
        console.log(
          "Closing... (will not fully close if there exist connections, but will stop accepting new connections.)"
        );
        socketServer.close();
      } catch (error) {
        console.error(error);
      } // try-catch
    }
  }
};
