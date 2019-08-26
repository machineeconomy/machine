<template>
  <div class="activities">
    <div class="panel--title">
      <span>Activities</span>
    </div>
    <div class="panel--list">
      <div class="list-item" v-for="(activity, index) in $store.getters.activities" :key="index">
        <span class="prefix">{{activity.timestamp | formatTimestampToTime }}</span>
        <span class="separator">|</span>
        <span class="message">{{activity.message}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Activities",
  components: {},
  data() {
    return {};
  }
};
</script>

<style>
</style>