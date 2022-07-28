<template>
    <div>
        <span style="color: white;">address:</span>
        <input type="text" v-model="address" disabled/>
        <br/>
        <span style="color: white;">family:</span>
        <input type="text" v-model="family" disabled/>
        <br/>
        <span style="color: white;">port:</span>
        <input type="text" v-model="port" />
        <br/>
        <button @click="startListening">Start Listening</button>&nbsp;&nbsp;
        <button @click="stopListening">Stop</button>
        <br/>
        <br/>
    </div>
</template>

<script src="./TCP_Server.js">
export default {
    name: 'tcp-server',
    props: {
        msg: String
    }
}
</script>