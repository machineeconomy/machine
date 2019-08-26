<template>
  <footer class="footer" v-bind:class="{ collapsed: collapsed }">
    <div class="panel">
      <Activities />
    </div>
    <div
      class="info-wrapper"
      :style="{'background-image': `url(${require('../assets/info-box.svg')})`}"
    >
      <div class="panel">
        <div class="panel--title">
          <span>Machine Info</span>
        </div>
        <div class="panel--list">
          <div class="list-item">
            <span class="prefix">Name:</span>
            <span class="message">{{$store.getters.name}}</span>
          </div>
          <div class="list-item">
            <span class="prefix">Version:</span>
            <span class="message">0.0.1</span>
          </div>
        </div>
      </div>
    </div>

    <div class="panel">
      <div class="panel--title">
        <span>Log Title</span>
      </div>
      <div class="panel--list">
        <div class="list-item">
          <span class="prefix">2019-08-17 19:52:37</span>
          <span class="separator">|</span>
          <span class="message">Database loaded. Current index: 35</span>
        </div>
        <div class="list-item">
          <span class="prefix">2019-08-17 19:52:37</span>
          <span class="separator">|</span>
          <span class="message">Database loaded. Current index: 35</span>
        </div>
        <div class="list-item">
          <span class="prefix">2019-08-17 19:52:37</span>
          <span class="separator">|</span>
          <span class="message">Database loaded. Current index: 35</span>
        </div>
        <div class="list-item">
          <span class="prefix">2019-08-17 19:52:37</span>
          <span class="separator">|</span>
          <span class="message">Database loaded. Current index: 35</span>
        </div>
        <div class="list-item">
          <span class="prefix">2019-08-17 19:52:37</span>
          <span class="separator">|</span>
          <span class="message">Database loaded. Current index: 35</span>
        </div>
        <div class="list-item">
          <span class="prefix">2019-08-17 19:52:37</span>
          <span class="separator">|</span>
          <span class="message">Database loaded. Current index: 35</span>
        </div>
        <div class="list-item">
          <span class="prefix">2019-08-17 19:52:37</span>
          <span class="separator">|</span>
          <span class="message">Database loaded. Current index: 35</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import Activities from "./Activities.vue";
export default {
  props: ["collapsed"],
  components: { Activities }
};
</script>

<style lang="scss">
.footer {
  height: 240px;
  border-top: var(--border);
  display: flex;
  justify-content: space-between;
  position: fixed;
  width: 100%;
  bottom: 0;
  background-color: var(--dark);
  z-index: 3;
  transition: var(--transition-cubic);
  &.collapsed {
    height: 500px;
  }
  .info-wrapper {
    display: flex;
    min-width: 600px;
    background-size: cover;
    background-repeat: no-repeat;
    position: relative;
    bottom: 60px;
    height: 305px;
  }
}
.panel {
  margin: 15px;
  width: 100%;
  padding: 15px;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  span {
    font-size: 14px;
    color: var(--white);
  }
  &--title {
    background-color: rgba(0, 0, 0, 0.5);
    padding: 5px 10px;
    span {
      font-family: "Oswald", sans-serif;
      font-size: 12px;
      font-weight: bold;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
  }
  &--list {
    background-color: rgba(0, 0, 0, 0.25);
    flex: 1;
    width: 100%;
    padding: 15px;
    box-sizing: border-box;
    overflow-y: auto;
    ::-webkit-scrollbar {
      width: 10px;
    }

    .list-item {
      .prefix {
        font-weight: bold;
        color: var(--primary);
      }
      .separator {
        opacity: 0.5;
      }
      .message {
      }
    }
  }
}
</style>