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

export default {
  name: "Dashboard",
  components: {
    Header,
    Main,
    Footer
  },
  data() {
    return {
      collapsed: false
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
