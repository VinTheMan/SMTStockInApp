<template>
  <div class="about">
    <h1>This is an qrcode page</h1>
    <span>address:</span>
    <input type="text" v-model="address" id="address" @input="forceRerender" />
    <br />
    <span>port:</span>
    <input type="text" v-model="port" id="port" @input="forceRerender" />
    <br />
    <br />

    <Qrcodeger :value="address + ':' + port" :key="componentKey"></Qrcodeger>
    <br />
    <br />
    <span class="m-card-user__name m--font-weight-500">
      料號 : {{ dataarr[0] }}
      <br />
      數量 : {{ dataarr[1] }}
      <br />
      Maker : {{ dataarr[2] }}
      <br />
      Vendor : {{ dataarr[3] }}
      <br />
      DC : {{ dataarr[4] }}
      <br />
      LOT : {{ dataarr[5] }}
      <br />
      RID : {{ dataarr[6] }}
      <br />
      Test: {{ test }}
    </span>
  </div>
</template>
<script src="../js/Qrcode" lang="ts"></script>
