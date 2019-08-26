<template>
  <main class="main" v-bind:class="{ collapsed: collapsed }">
    <div class="circle">
      <div class="circle--inner"></div>
      <div class="circle--outer"></div>
      <div
        class="circle--status-box"
        :style="{'background-image': `url(${require('../assets/status-box.svg')})`}"
      >
        <span class="status-text">Working</span>
      </div>
      <div class="circle--info-box">
        <span class="label">Balance</span>
        <span class="value">{{balance}}</span>
        <span class="label">IOTA</span>
      </div>
      <div class="wrap">
        <div class="c" v-for="i in 100" :key="i"></div>
      </div>
    </div>
  </main>
</template>

<script>
const axios = require("axios");
export default {
  props: ["collapsed"],
  data() {
    return {
      balance: null,
      polling: null
    };
  },
  created() {
    this.fetchBalance();
  },
  beforeDestroy() {
    clearInterval(this.polling);
  },
  methods: {
    fetchBalance() {
      let self = this;
      this.polling = setInterval(function run() {
        console.log("Pull Data.");
        axios
          .get("http://localhost:3001/get_account_data")
          .then(function(response) {
            console.log(response);
            self.balance = response.data.balance;
          })
          .catch(function(error) {
            console.log(error);
            self.balance = "error";
          });
      }(), 10000 );
    }
  }
};
</script>

<style lang="scss">
.main {
  margin: 70px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 535px);
  transition: var(--transition-cubic);
  margin-top: 160px;
  &.collapsed {
    height: 0;
    .circle {
      transform: scale(0);
      opacity: 0;
    }
  }
  .circle {
    position: relative;
    height: 536px;
    width: 536px;
    border: 50px solid var(--primary);
    border-radius: 50%;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    transform: scale(0.75);
    transition: var(--transition-cubic_bounce);
    opacity: 1;
    &--inner {
      margin: 40px;
      height: calc(100% - 80px);
      width: 100%;
      border-radius: 50%;
      background-color: transparent;
    }
    &--outer {
    }
    &--status-box {
      position: absolute;
      bottom: -65px;
      z-index: 3;
      height: 94px;
      width: 243px;
      background-repeat: no-repeat;
      background-size: cover;
      display: flex;
      justify-content: center;
      align-items: center;
      .status-text {
        font-family: "Oswald", sans-serif;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        font-size: 20px;
        margin-bottom: 5px;
      }
    }
    &--info-box {
      position: absolute;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      span {
        font-family: "Oswald", sans-serif;
      }
      .value {
        font-size: 46px;
      }
      .label {
        text-transform: uppercase;
        letter-spacing: 0.05em;
        opacity: 0.5;
      }
    }
  }

  // best in chrome
  $total: 100; // total particles
  $orb-size: 200px;
  $particle-size: 2px;
  $time: 50s;
  $base-hue: 180; // change for diff colors (180 is nice)

  .wrap {
    position: absolute;
    width: 0;
    height: 0;
    transform-style: preserve-3d;
    perspective: 1000px;
    animation: rotate $time infinite linear; // rotate orb
  }

  @keyframes rotate {
    100% {
      transform: rotateY(360deg) rotateX(360deg);
    }
  }

  .c {
    position: absolute;
    width: $particle-size;
    height: $particle-size;
    border-radius: 50%;
    opacity: 0;
  }

  @for $i from 1 through $total {
    $z: (random(360) * 1deg); // random angle to rotateZ
    $y: (random(360) * 1deg); // random to rotateX
    $hue: ((40 / $total * $i) + $base-hue); // set hue

    .c:nth-child(#{$i}) {
      // grab the nth particle
      animation: orbit#{$i} $time infinite;
      animation-delay: ($i * 0.01s);
      background-color: hsla($hue, 100%, 50%, 1);
    }

    @keyframes orbit#{$i} {
      20% {
        opacity: 1; // fade in
      }
      30% {
        transform: rotateZ(-$z) rotateY($y) translateX($orb-size) rotateZ($z); // form orb
      }
      80% {
        transform: rotateZ(-$z) rotateY($y) translateX($orb-size) rotateZ($z); // hold orb state 30-80
        opacity: 1; // hold opacity 20-80
      }
      100% {
        transform: rotateZ(-$z) rotateY($y) translateX(($orb-size * 3))
          rotateZ($z); // translateX * 3
      }
    }
  }

  $color: #00b0f0;

  .circle--inner {
    background-color: transparent;
    min-width: 536px;
    min-height: 536px;
    border-radius: 50%;
    animation: ripple 1.7s linear infinite;
  }

  @keyframes ripple {
    0% {
      box-shadow: 0 0 0 0 rgba($color, 0.1), 0 0 0 1em rgba($color, 0.1),
        0 0 0 3em rgba($color, 0.1), 0 0 0 5em rgba($color, 0.1);
    }
    100% {
      box-shadow: 0 0 0 1em rgba($color, 0.1), 0 0 0 3em rgba($color, 0.1),
        0 0 0 5em rgba($color, 0.1), 0 0 0 8em rgba($color, 0);
    }
  }
}
</style>