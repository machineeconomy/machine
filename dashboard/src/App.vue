<template>
  <div id="app">
    <Dashboard />
  </div>
</template>

<script>
import Dashboard from "./components/Dashboard.vue";

export default {
  name: "app",
  components: {
    Dashboard
  }
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Open+Sans|Oswald:700&display=swap");

:root {
  --black: #171717;
  --dark: #15272e;
  --primary: #00b0f0;
  --light: #efefef;
  --white: #ffffff;
}

body {
  margin: 0;
  padding: 0;
}

#app {
  background-color: var(--black);
  height: 100vh;
  width: 100%;
  overflow: hidden;
  * {
    color: var(--white);
  }
}

h1,
h2,
h3,
h4 {
  margin: 0;
  font-weight: 700;
  font-family: "Oswald", sans-serif;
}

h1 {
  font-size: 46px;
}

p,
span {
  font-size: 16px;
  font-family: "Open Sans", sans-serif;
}
</style>
