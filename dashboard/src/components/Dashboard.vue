<template>
  <div
    class="dashboard"
    :style="{'background-image': `url(${require('../assets/bg.jpg')})`}"
  >
    <Header :collapsed="collapsed" />
    <Main :collapsed="collapsed" />
    <Footer :collapsed="collapsed" />
    <button class="btn btn-primary btn-collapsed" @click="click">{{collapsed}}</button>
  </div>
</template>

<script>
import Header from "./Header.vue";
import Main from "./Main.vue";
import Footer from "./Footer.vue";

import io from "socket.io-client";

export default {
  name: "Dashboard",
  components: {
    Header,
    Main,
    Footer
  },
  data() {
    return {
      collapsed: false,

      status: "",
      balance: "",
      connected: false,
      name: "",
      messages: []
    }
  },
  created() {
    var socket = io("http://localhost:3001", { path: "/socket", secure: true });
    if (socket) {
      var self = this;
      socket.on("init", function(msg) {
        console.log(msg)
        self.name = msg.name;
        self.status = msg.status;
        self.connected = true;
        self.$store.commit('SetName', msg.name);
        self.$store.commit('AddActivity', {
          message: `Machine '${msg.name}': ${msg.message}`,
          timestamp: Date.now()
        })
        
      });

      socket.on("status", function(msg) {
        console.log("ws: tx_confirmed", msg);
        self.status = msg.status;
        self.$store.commit('AddActivity', {
          message: `Machine '${self.name}': ${msg.message}`,
          timestamp: Date.now()
        })
      });

      socket.on("new_balance", function(msg) {
        console.log("ws: new_balance", msg);
        self.balance = msg.balance.toString();
      });
    }
  },
  methods: {
    click() {
      console.log("object")
      this.collapsed = !this.collapsed
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.btn-collapsed {
  position: fixed;
  top: 150px;
  left: 50px;
  z-index: 1000;
}
.dashboard {
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
}
</style>
