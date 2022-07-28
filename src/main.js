// import { createApp } from 'vue';
import { createApp } from 'vue/dist/vue.esm-bundler';
// import App from './App.vue'
import TCPReader from './TCP_Client.vue';
import TCPServer from './TCP_Server.vue';
import router from './router'

createApp({
    components: {
        'tcp-reader': TCPReader,
        'tcp-server': TCPServer,
    }
}).use(router).mount('#mountingPoint');



