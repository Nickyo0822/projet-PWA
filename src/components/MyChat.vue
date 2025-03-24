<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const serverUrl = "ws://mohammedelmehdi.makhlouk.angers.mds-project.fr:40220"; 
const socket = ref(null);
const messages = ref([]);
const newMessage = ref("");

// ID de l'utilisateur (à récupérer dynamiquement selon ton app)
const userId = "user_123";
const serverId = "server_001";

// Connexion WebSocket
onMounted(() => {
  socket.value = new WebSocket(serverUrl);

  socket.value.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data);
      messages.value.push(message);
    } catch (error) {
      console.error("Erreur lors de la réception du message :", error);
    }
  };

  socket.value.onopen = () => console.log("Connecté au serveur WebSocket");
  socket.value.onclose = () => console.log("Déconnecté du serveur WebSocket");
});

onUnmounted(() => {
  if (socket.value) socket.value.close();
});

// Fonction d'envoi de message
const sendMessage = () => {
  if (!newMessage.value.trim()) return;

  const message = {
    content: newMessage.value,
    dateEmis: new Date().toISOString(),
    autorId: userId,
    serverId: serverId,
  };

  socket.value.send(JSON.stringify(message));
  messages.value.push(message);
  newMessage.value = "";
};
</script>

<template>
  <div class="chat-container">
    <div class="messages">
      <div v-for="msg in messages" :key="msg.dateEmis" class="message">
        <strong>{{ msg.autorId }}:</strong> {{ msg.content }}
        <small>{{ new Date(msg.dateEmis).toLocaleTimeString() }}</small>
      </div>
    </div>
    
    <div class="input-area">
      <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Écrire un message..." />
      <button @click="sendMessage">Envoyer</button>
    </div>
  </div>
</template>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 400px;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 5px;
  background: #f9f9f9;
}

.messages {
  flex-grow: 1;
  overflow-y: auto;
  margin-bottom: 10px;
}

.message {
  padding: 5px;
  border-bottom: 1px solid #eee;
}

.input-area {
  display: flex;
  gap: 10px;
}

input {
  flex-grow: 1;
  padding: 5px;
}

button {
  padding: 5px 10px;
}
</style>
