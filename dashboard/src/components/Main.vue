<template>
  <main class="main">
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
          <span class="value">12.120.301</span>
          <span class="label">IOTA</span>
      </div>
    </div>
  </main>
</template>

<script>
export default {};
</script>

<style lang="scss">
.main {
  flex: 1;
  margin: 70px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  .circle {
    position: relative;
    height: 536px;
    width: 536px;
    background-color: var(--primary);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    &--inner {
        margin: 40px;
        height: calc(100% - 80px);
        width: 100%;
        border-radius: 50%;
        background-color: var(--black);
    }
    &--outer {
    }
    &--status-box {
        position: absolute;
        bottom: -15px;
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
            opacity: .5;
        }

    }
  }
}
</style>