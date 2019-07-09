<template>
  <button @click="click">My Button</button>
</template>
<script>
  export default {
    props: ['msg'],
    methods: {
      click() {
        console.log(`My button message: ${this.msg}`)
      }
    }
  }
</script>