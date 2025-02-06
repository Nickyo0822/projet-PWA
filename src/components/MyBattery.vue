<template>
    <div class="battery-container">
      <h2>🔋 Niveau de Batterie</h2>
      <p :class="batteryClass">{{ batteryLevel }}%</p>
      <p v-if="charging">🔌 En charge...</p>
      <p v-else>🔋 Non branché</p>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from "vue";
  
  export default {
    setup() {
      const batteryLevel = ref(null);
      const charging = ref(false);
  
      const updateBatteryStatus = (battery) => {
        batteryLevel.value = Math.round(battery.level * 100);
        charging.value = battery.charging;
      };
  
      const batteryClass = computed(() => {
        if (batteryLevel.value > 50) return "battery-green";
        if (batteryLevel.value > 20) return "battery-orange";
        return "battery-red";
      });
  
      onMounted(async () => {
        if ("getBattery" in navigator) {
          try {
            const battery = await navigator.getBattery();
            updateBatteryStatus(battery);
  
            battery.addEventListener("levelchange", () => updateBatteryStatus(battery));
            battery.addEventListener("chargingchange", () => updateBatteryStatus(battery));
          } catch (error) {
            console.error("⚠️ Erreur lors de l'accès à la batterie :", error);
          }
        } else {
          console.warn("⚠️ L'API Battery Status n'est pas supportée sur cet appareil.");
        }
      });
  
      return { batteryLevel, charging, batteryClass };
    },
  };
  </script>
  
  <style scoped>
  .battery-container {
    text-align: center;
    padding: 20px;
    background: #f4f4f4;
    border-radius: 10px;
    width: 200px;
    margin: auto;
  }
  
  h2 {
    color: #42b983;
  }
  
  p {
    font-size: 20px;
    font-weight: bold;
  }
  
  /* 🎨 Couleurs dynamiques */
  .battery-green {
    color: #2ecc71; /* Vert */
  }
  
  .battery-orange {
    color: #f39c12; /* Orange */
  }
  
  .battery-red {
    color: #e74c3c; /* Rouge */
  }
  </style>
  