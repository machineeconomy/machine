<template>
  
</template>

<script>

export default {
props: ["url"],
  components: { PulseLoader },
  data() {
    return {
      status: "",
      balance: "",
      connected: false,
      mutableName: this.name
    };
  }
}
</script>

<style>

</style>