<template>
    <div>
        <span style="color: white;">ip:</span>
        <input type="text" v-model="ip" />
        <br/>
        <span style="color: white;">port:</span>
        <input type="text" v-model="port" />
        <br/>
        <button @click="establishConnect">Establish Connection</button>&nbsp;&nbsp;
        <button @click="closeConnection">Disconnect</button>
        <br/>
        <br/>
        <span style="color: white;">message:</span>
        <input type="text" v-model="message" />
        <button @click="sendMessage">send</button>
        <br/>
    </div>
</template>

<script src="./TCP_Reader.js">
export default {
    name: 'tcp-reader',
    props: {
        msg: String
    }
}
</script>