<template>
  <div class="orders">
    <div class="panel--title">
      <span>Orders</span>
    </div>
    <div class="panel--list">
      <div class="list-item" v-for="(order, index) in orders" :key="index">
        <span class="prefix">{{order.created }}</span>
        <span class="separator">|</span>
        <span class="message">{{order.uuid}}</span>
        <span>({{order.status}})</span>
      </div>
    </div>
  </div>
</template>

<script>
const axios = require("axios");

export default {
  name: "Orders",
  data() {
    return {
      orders: [],
      polling: null
    };
  },
  created() {
    this.fetchOrders();
  },
  beforeDestroy() {
    clearInterval(this.polling);
  },
  methods: {
    fetchOrders() {
      let self = this;
      this.polling = setInterval(function run() {
        console.log("Pull orders.");
        axios
          .get("http://localhost:3001/orders")
          .then(function(response) {
            console.log(response);
            self.orders = response.data;
          })
          .catch(function(error) {
            console.log(error);
          });
      }(), 10000 );
    }
  }
};
</script>

<style>
</style>