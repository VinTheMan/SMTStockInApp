import { computed } from "vue";

("use strict");

export default {
  data() {
    return {
      active_el: "",
    };
  },
  mounted() {
    // do nothing
    console.log("sidebar mount");
    if (sessionStorage.getItem("beginmatch") !== null) hideimportbutton();
  },

  watch: {
    // watch route change, to and from are both $route Obj
    $route(to, from) {
      this.active_el = to.name;
      // console.log(to.name); // test
    },
  },
  name: "SidebarComponent",
  methods: {
    // do nothing
  },
};

function hideimportbutton() {
  const storehouse = document.getElementById("storehouse");
  if (storehouse !== null) {
    storehouse.style.display = "none";
  }
  const orderlist = document.getElementById("orderlist");
  if (orderlist !== null) {
    orderlist.style.display = "none";
  }
  const stageslot = document.getElementById("stageslot");
  if (stageslot !== null) {
    stageslot.style.display = "none";
  }
}
