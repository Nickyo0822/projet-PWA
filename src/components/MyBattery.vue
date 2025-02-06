<template>
    <div class="battery-wrapper">
        <p :class="batteryClass">🔋 {{ batteryLevel }}% <span v-if="charging">🔌</span><span v-else>⚡</span></p>
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
  .battery-wrapper {
    position: fixed;
    top: 10px;
    right: 10px;
    font-size: 14px;
    font-weight: bold;
    display: flex;
    align-items: center;
  }
  
  .battery-green {
    color: #2ecc71;
  }
  
  .battery-orange {
    color: #f39c12;
  }
  
  .battery-red {
    color: #e74c3c;
  }
</style>