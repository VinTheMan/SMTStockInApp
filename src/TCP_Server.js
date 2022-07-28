'use strict';
const net = require('net');
var socketServer;
export default {
  data() {
    return {
      address: 'Not Opened',
      port: '8085',
      family: 'None',
      server: null
    }
  },
  mounted() {
    const server = new net.Server();
    socketServer = server;
    socketServer.on('listening', () => {
      console.log("We are now open and start listening on port :" + this.port);
      this.address = socketServer.address().address;
      this.family = socketServer.address().family;
    });

    socketServer.on('close', () => {
      console.log("All connections are closed !");
    });

    socketServer.on('connection', (client) => {
      client.on('data', (data) => console.log("Msg from Client : " + data.toString()));
      client.write('From server : Copy that, Over!');
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
        console.log('Closing... (will not fully close if there exist connections, but will stop accepting new connections.)');
        socketServer.close();
      } catch (error) {
        console.error(error);
      } // try-catch
    }
  }
}
