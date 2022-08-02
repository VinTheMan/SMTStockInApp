"use strict";
import * as net from "net";
let socketServer;
export default {
  data() {
    return {
      address: "Not Opened",
      port: "8085",
      family: "Not Opened",
      server: null,
    };
  },
  mounted() {
    const server = new net.Server();
    socketServer = server;
    socketServer.on("listening", () => {
      console.log("We are now open and start listening on port :" + this.port);
      this.address = socketServer.address().address;
      this.family = socketServer.address().family;
    });

    socketServer.on("close", () => {
      console.log("All connections are closed !");
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
    },
  },
};
