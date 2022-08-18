<template>
  <div>
    <p>message: {{ $t("messages.hello", { name: "Vincent" }) }}</p>
    <span>ip:</span>
    <input type="text" v-model="ip" />
    <br />
    <span>port:</span>
    <input type="text" v-model="port" />
    <br />
    <button @click="establishConnect">Establish Connection</button>&nbsp;&nbsp;
    <button @click="closeConnection">Disconnect</button>
    <br />
    <br />
    <span>message:</span>
    <input type="text" v-model="message" />
    <button @click="sendMessage">send</button>
    <br />
  </div>
</template>

<script src="./PostToCheckScannerData.ts" lang="ts"></script>
