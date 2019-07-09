<template>
  <span class="badge badge-pill" :class="getStatusColor(status)">{{readableStatus}}</span>
</template>
<script>
import io from "socket.io-client";

export default {
  props: ["url"],
  data() {
    return {
      status: undefined,
    }
  },
  created() {
    var socket = io(this.url, { path: "/socket", secure: true });
    if (socket) {
      var self = this;
      socket.on("init", function(msg) {
          self.status = msg.status
      });

      socket.on("status", function(msg) {
        self.status = msg.status;
      });
    }
  },
  computed: {
    readableStatus() {
      if(this.status) {
        return this.status.replace(/_/g, " ");
      }
    }
  },
  methods: {
    getStatusColor(status) {
      switch (status) {
        case "not_connected":
          return "badge-danger";
          break;
        case "waiting_for_order":
          return "badge-info";
          break;
        case "waiting_for_tx":
        case "waiting_for_tx_confirm":
          return "badge-primary";
          break;
        case "payout_provider":
          return "badge-warning";
          break;
        case "working":
          return "badge-success";
          break;
        default:
          return "badge-default";
          break;
      }
    }
  }
};
</script>