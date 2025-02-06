<template>
  <div class="container">
    <h2>📞 Passer un appel</h2>
    <input v-model="phoneNumber" type="tel" placeholder="Entrer un numéro" />
    <button @click="makeCall">📲 Appeler</button>

    <p v-if="lastCalled">Dernier numéro composé : {{ lastCalled }}</p>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    const phoneNumber = ref("");
    const lastCalled = ref(localStorage.getItem("lastCalled") || "");

    const makeCall = () => {
      if (phoneNumber.value.trim()) {
        window.location.href = `tel:${phoneNumber.value}`;
        lastCalled.value = phoneNumber.value;
        localStorage.setItem("lastCalled", phoneNumber.value); // 🔄 Sauvegarde du dernier numéro
      } else {
        alert("📵 Veuillez entrer un numéro valide !");
      }
    };

    return { phoneNumber, makeCall, lastCalled };
  },
};
</script>

<style scoped>
.container {
  text-align: center;
  margin-top: 20px;
}

input {
  padding: 10px;
  width: 80%;
  margin-bottom: 10px;
  border: 1px solid #42b983;
  border-radius: 5px;
  text-align: center;
}

button {
  padding: 10px;
  background-color: #42b983;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

p {
  margin-top: 10px;
  color: #333;
}
</style>
