<template>
  <div
    class="dashboard"
    :style="{'background-image': `url(${require('../assets/bg.jpg')})`}"
  >
    <Header />
    <Main />
    <Footer />
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
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.dashboard {
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
}
</style>
