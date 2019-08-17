<template>
  <header class="header">
    <img class="header--logo" src="@/assets/akita_logo.png" alt="Akita Logo" />
    <div
      class="header--machine-name"
      :style="{'background-image': `url(${require('../assets/machine-name-box.svg')})`}"
    >
      <h1>robot_1</h1>
    </div>
    <div class="header--menu">
      <button class="btn btn-primary">
        <img src="@/assets/icons/settings.svg" alt="Settings Icon" />
        <span>Settings</span>
      </button>
    </div>
  </header>
</template>

<script>
export default {};
</script>

<style lang="scss">
.header {
  height: 100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: var(--border);
  box-sizing: border-box;
  &--logo {
    height: 50px;
    margin-left: 15px;
  }
  &--machine-name {
    width: 600px;
    height: 100px;
    background-size: contain;
    background-repeat: no-repeat;
    position: relative;
    top: -8px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &--menu {
    padding-right: 25px;
  }
}

.btn {
  background-color: transparent;
  border-left: 5px solid var(--primary);
  border-right: 5px solid var(--primary);
  border: none;
  position: relative;
  background-color: var(--primary);
  display: flex;
  align-items: center;
  padding: 5px 15px;
  img {
      margin-right: 8px;
  }
  span {
      font-family: "Oswald", sans-serif;
      color: var(--white);
  }
  &:before,
  &:after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 100%;
    border-bottom: 5px solid var(--primary);
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
  }
  &:after {
    bottom: auto;
    top: 100%;
    border-bottom: none;
    border-top: 5px solid var(--primary);
  }
  &-primary {
  }
}
</style>