<!-- eslint-disable vue/valid-v-slot -->
<template>
  <div>
    <h1>{{ selectmsg }}</h1>
    <br />
    <input
      type="file"
      @change="onChange"
      accept=".xlsx, .xls, .csv"
      v-if="!showsend"
    />
    <button @click="sendtoweb()" v-if="file !== null" v-show="!showsend">
      send
    </button>
    <loading v-model:active="isLoading" :is-full-page="fullPage">
      <div class="loadingio-spinner-spinner-gmzok6mjj2r">
        <div class="ldio-rh43p65bot">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      <div class="right" v-if="isLoading">
        <b align="center">外倉清單匯入中，請稍候。</b>
      </div>
    </loading>

    <xlsx-read :file="file"> </xlsx-read>
    <div class="w-100" style="height: 1ch"></div>
    <!-- </div>breaks cols to a new line-->
    <div class="w-100" style="height: 1ch"></div>
    <!-- </div>breaks cols to a new line-->
    <vue-good-table
      :columns="columns"
      :rows="rows"
      max-height="500px"
      theme="black-rhino"
      :fixed-header="header"
      :search-options="{
        enabled: true,
      }"
      :pagination-options="{
        enabled: true,
        mode: 'records',
      }"
    ></vue-good-table>
  </div>
</template>

<script
  src="../../../js/ExternalStorage/Import/Storehouse.ts"
  lang="ts"
></script>

<style type="text/css">
@keyframes ldio-rh43p65bot {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
.ldio-rh43p65bot div {
  left: 94px;
  top: 38px;
  position: absolute;
  animation: ldio-rh43p65bot linear 1s infinite;
  background: #290908;
  width: 12px;
  height: 24px;
  border-radius: 6px / 12px;
  transform-origin: 6px 62px;
}
.ldio-rh43p65bot div:nth-child(1) {
  transform: rotate(0deg);
  animation-delay: -0.9333333333333333s;
  background: #290908;
}
.ldio-rh43p65bot div:nth-child(2) {
  transform: rotate(24deg);
  animation-delay: -0.8666666666666667s;
  background: #491212;
}
.ldio-rh43p65bot div:nth-child(3) {
  transform: rotate(48deg);
  animation-delay: -0.8s;
  background: #831a19;
}
.ldio-rh43p65bot div:nth-child(4) {
  transform: rotate(72deg);
  animation-delay: -0.7333333333333333s;
  background: #c24229;
}
.ldio-rh43p65bot div:nth-child(5) {
  transform: rotate(96deg);
  animation-delay: -0.6666666666666666s;
  background: #dd8437;
}
.ldio-rh43p65bot div:nth-child(6) {
  transform: rotate(120deg);
  animation-delay: -0.6s;
  background: #eeb440;
}
.ldio-rh43p65bot div:nth-child(7) {
  transform: rotate(144deg);
  animation-delay: -0.5333333333333333s;
  background: #d8cea7;
}
.ldio-rh43p65bot div:nth-child(8) {
  transform: rotate(168deg);
  animation-delay: -0.4666666666666667s;
  background: #290908;
}
.ldio-rh43p65bot div:nth-child(9) {
  transform: rotate(192deg);
  animation-delay: -0.4s;
  background: #491212;
}
.ldio-rh43p65bot div:nth-child(10) {
  transform: rotate(216deg);
  animation-delay: -0.3333333333333333s;
  background: #831a19;
}
.ldio-rh43p65bot div:nth-child(11) {
  transform: rotate(240deg);
  animation-delay: -0.26666666666666666s;
  background: #c24229;
}
.ldio-rh43p65bot div:nth-child(12) {
  transform: rotate(264deg);
  animation-delay: -0.2s;
  background: #dd8437;
}
.ldio-rh43p65bot div:nth-child(13) {
  transform: rotate(288deg);
  animation-delay: -0.13333333333333333s;
  background: #eeb440;
}
.ldio-rh43p65bot div:nth-child(14) {
  transform: rotate(312deg);
  animation-delay: -0.06666666666666667s;
  background: #d8cea7;
}
.ldio-rh43p65bot div:nth-child(15) {
  transform: rotate(336deg);
  animation-delay: 0s;
  background: #290908;
}
.loadingio-spinner-spinner-gmzok6mjj2r {
  width: 200px;
  height: 200px;
  display: inline-block;
  overflow: hidden;
  background: none;
}
.ldio-rh43p65bot {
  width: 100%;
  height: 100%;
  position: relative;
  transform: translateZ(0) scale(1);
  backface-visibility: hidden;
  transform-origin: 0 0; /* see note above */
}
.ldio-rh43p65bot div {
  box-sizing: content-box;
}
/* generated by https://loading.io/ */
</style>
