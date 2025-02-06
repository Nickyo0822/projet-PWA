<template>
  <MyCamera/>
  <MyCalls/>
</template>

<script>
  import MyCalls from './components/MyCalls.vue';
  import MyCamera from './components/MyCamera.vue';

  export default {
    name: 'App',
    components: {
      MyCamera,
      MyCalls
    }
  }
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
