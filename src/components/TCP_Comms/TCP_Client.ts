"use strict";
import * as net from "net";

let socketClient;

export default {
  name: "tcp-client",
  data() {
    return {
      ip: "172.20.10.2",
      port: "23",
      message: "test message",
    };
  },
  mounted() {
    // do nothing
  },
  methods: {
    establishConnect() {
      console.log("Try to connect");
      socketClient = net.connect({ host: this.ip, port: this.port }, () => {
        // 'connect' listener
        console.log("connected to server!");
        socketClient.write("connected!\r\n Hi! I am Vue!\n"); // send msg to server
      });

      socketClient.on("end", () => {
        socketClient.end();
        console.log("disconnected from server.");
      });

      socketClient.on("data", (data) => {
        console.log("Server message : " + data);
      });
    },
    sendMessage() {
      try {
        console.log("Try to connect");
        socketClient = net.connect({ host: this.ip, port: this.port }, () => {
          // 'connect' listener
          console.log("connected to server!");
          socketClient.write(this.message + "\n");
        });
      } catch (error) {
        console.error(error);
      } // try-catch
    },
    closeConnection() {
      // for established connection only
      try {
        socketClient.end();
      } catch (error) {
        console.error(error);
        console.warn("No Sockets to Close !");
      } // try catch
    },
  },
};
