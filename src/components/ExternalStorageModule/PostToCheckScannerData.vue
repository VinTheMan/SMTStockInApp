<template>
  <div>
    <p>message: {{ $t("messages.hello", { name: "Vincent" }) }}</p>
    <input type="text" v-model="test_api" readonly />
    <br />
    <button @click="postRequest">send</button>
    <br />
  </div>
</template>

<script src="./PostToCheckScannerData.ts" lang="ts"></script>
