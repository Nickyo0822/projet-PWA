<template>
  <div id="app">
    <MyBattery/>
    <component :is="currentComponent" />
    
    <footer class="footer">
      <button 
        @click="currentComponent = 'MyCamera'" 
        :class="{ active: currentComponent === 'MyCamera' }"
      >
        Caméra
      </button>
      <button 
        @click="currentComponent = 'MyCalls'" 
        :class="{ active: currentComponent === 'MyCalls' }"
      >
        Appels
      </button>

      <button 
        @click="currentComponent = 'MyChat'" 
        :class="{ active: currentComponent === 'MyChat' }"
      >
        Chat
      </button>
    </footer>
  </div>
</template>

<script>
import MyBattery from './components/MyBattery.vue';
import MyCalls from './components/MyCalls.vue';
import MyCamera from './components/MyCamera.vue';
import MyChat from './components/MyChat.vue';

export default {
  name: 'App',
  components: {
    MyCamera,
    MyCalls,
    MyBattery,
    MyChat
  },
  data() {
    return {
      currentComponent: 'MyCamera' // Composant affiché par défaut
    };
  }
};
</script>

<style>
body {
  margin: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.footer {
  display: flex;
  justify-content: space-around;
  position: fixed;
  bottom: 0;
  width: 100%;
  background: #2c3e50;
  padding: 20px 0;
}

.footer button {
  background: none;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
  padding: 10px 20px;
  border-radius: 5px;
  transition: background 0.3s, color 0.3s;
}

.footer button.active {
  background: #42b983;
  color: white;
}

.footer button:hover {
  color: #42b983;
}
</style>
