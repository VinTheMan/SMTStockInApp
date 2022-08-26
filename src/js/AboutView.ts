("use strict");
import TcpServer from "../components/TCP_Comms/TCP_Server.vue";
import PostToCheckScannerData from "../components/ExternalStorageModule/PostToCheckScannerData.vue";

export default {
  data() {
    return {
      test: false,
    };
  },
  mounted() {
    // do nothing for now
  },
  components: {
    TcpServer,
    PostToCheckScannerData,
  },
  methods: {
    // do nothing for now
  },
};
