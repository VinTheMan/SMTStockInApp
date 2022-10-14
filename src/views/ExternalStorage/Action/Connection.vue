<!-- eslint-disable vue/multi-word-component-names -->

<template>
  <h1>{{ selectmsg }}</h1>
  <h2>Request NO : {{ rNo }}</h2>

  <div class="container" id="connectorder">
    <div class="row justify-content-center">
      <div class="col-auto">
        <span>未選取工單</span>
        <br />
        <select
          v-model="selected"
          multiple
          size="15"
          class="form-control-lg"
          @change="onChange"
          id="selectworder"
          style="width: 15ch; text-align: center"
        >
          <option disabled>&nbsp;</option>
          <option v-for="worder in Worders" :key="worder">
            {{ worder }}
          </option>
        </select>
      </div>
      <div class="col-auto">
        <br />
        <br />
        <br />
        <button
          class="basic btn btn-info btn-lg m-0 p-0 rounded-circle form-control-lg"
          @click="addtolist()"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="50"
            height="50"
            fill="currentColor"
            class="bi bi-arrow-right"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
            />
          </svg>
        </button>
        <br />
        <br />
        <br />
        <br />
        <button
          class="basic btn btn-info btn-lg m-0 p-0 rounded-circle form-control-lg"
          @click="delfromlist()"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="50"
            height="50"
            fill="currentColor"
            class="bi bi-arrow-left"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
            />
          </svg>
        </button>
      </div>
      <div class="col-auto">
        <span>已選取工單 : </span>{{ selectcount }}
        <br />

        <select
          v-model="selected1"
          class="form-control-lg"
          multiple
          size="15"
          style="width: 15ch; text-align: center"
        >
          <option disabled>&nbsp;</option>
          <option v-for="worder in selectworders" :key="worder">
            {{ worder }}
          </option>
        </select>
      </div>
      <div style="text-align: center">
        <button
          @click="connectorder()"
          class="btn-primary btn-lg col-auto"
          v-show="showsubmit"
        >
          Submit
        </button>
        <br />
        <br />
        <button
          @click="beginmatch()"
          class="btn-success btn-lg col-auto"
          v-show="showbegin"
        >
          開始入料
        </button>
      </div>
    </div>
  </div>
  <div style="position: relative; height: 300px">
    <loading v-model:active="isLoading" :is-full-page="false">
      <div class="loadingio-spinner-bean-eater-awd9l66xoi6">
        <div class="ldio-kpfjh5lom8p">
          <div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>

      <div style="width: 120px; margin: 0 auto" v-if="isLoading">
        <h4><b>入料執行中...</b></h4>
      </div>
    </loading>
  </div>
  <br />
  <div class="container" id="qrcode" v-if="isLoading">
    <div class="row justify-content-center">
      <div class="col-auto">
        <label>address: </label
        ><input
          type="text"
          v-model="address"
          id="address"
          @input="forceRerender"
        />
        <br />
        <label>port:</label>
        <input type="text" v-model="port" id="port" @input="forceRerender" />
        <br />
      </div>
      <div class="col-auto">
        <Qrcodeger
          :value="address + ':' + port"
          :key="componentKey"
        ></Qrcodeger>
        <br />
      </div>
      <div style="text-align: center">
        <button @click="endmatch()" class="btn-danger btn-lg col-auto">
          結束入料
        </button>
        <br />
      </div>
    </div>
  </div>
</template>

<script
  src="../../../js/ExternalStorage/Action/Connection.ts"
  lang="ts"
></script>

<style type="text/css">
@keyframes ldio-kpfjh5lom8p-1 {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(-45deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
@keyframes ldio-kpfjh5lom8p-2 {
  0% {
    transform: rotate(180deg);
  }
  50% {
    transform: rotate(225deg);
  }
  100% {
    transform: rotate(180deg);
  }
}
.ldio-kpfjh5lom8p > div:nth-child(2) {
  transform: translate(-15px, 0);
}
.ldio-kpfjh5lom8p > div:nth-child(2) div {
  position: absolute;
  top: 40px;
  left: 40px;
  width: 120px;
  height: 60px;
  border-radius: 120px 120px 0 0;
  background: #5f2a62;
  animation: ldio-kpfjh5lom8p-1 1s linear infinite;
  transform-origin: 60px 60px;
}
.ldio-kpfjh5lom8p > div:nth-child(2) div:nth-child(2) {
  animation: ldio-kpfjh5lom8p-2 1s linear infinite;
}
.ldio-kpfjh5lom8p > div:nth-child(2) div:nth-child(3) {
  transform: rotate(-90deg);
  animation: none;
}
@keyframes ldio-kpfjh5lom8p-3 {
  0% {
    transform: translate(190px, 0);
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  100% {
    transform: translate(70px, 0);
    opacity: 1;
  }
}
.ldio-kpfjh5lom8p > div:nth-child(1) {
  display: block;
}
.ldio-kpfjh5lom8p > div:nth-child(1) div {
  position: absolute;
  top: 92px;
  left: -8px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #a976c3;
  animation: ldio-kpfjh5lom8p-3 1s linear infinite;
}
.ldio-kpfjh5lom8p > div:nth-child(1) div:nth-child(1) {
  animation-delay: -0.67s;
}
.ldio-kpfjh5lom8p > div:nth-child(1) div:nth-child(2) {
  animation-delay: -0.33s;
}
.ldio-kpfjh5lom8p > div:nth-child(1) div:nth-child(3) {
  animation-delay: 0s;
}
.loadingio-spinner-bean-eater-awd9l66xoi6 {
  width: 200px;
  height: 200px;
  display: inline-block;
  overflow: hidden;
  background: none;
}
.ldio-kpfjh5lom8p {
  width: 100%;
  height: 100%;
  position: relative;
  transform: translateZ(0) scale(1);
  backface-visibility: hidden;
  transform-origin: 0 0; /* see note above */
}
.ldio-kpfjh5lom8p div {
  box-sizing: content-box;
}
/* generated by https://loading.io/ */
</style>
