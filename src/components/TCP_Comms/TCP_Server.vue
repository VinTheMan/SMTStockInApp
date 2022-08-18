<template>
  <div>
    <span>address:</span>
    <input type="text" v-model="address" disabled />
    <!-- <br />
    <span>family:</span>
    <input type="text" v-model="family" disabled /> -->
    <br />
    <span>port:</span>
    <input type="text" v-model="port" />
    <br />
    <button @click="startListening">Start Listening</button>&nbsp;&nbsp;
    <button @click="stopListening">Stop</button>
    <br />
    <br />
  </div>
</template>

<script src="./TCP_Server.ts"></script>
