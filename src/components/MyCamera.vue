<template>
  <div>
    <video ref="video" autoplay></video>

    <!-- Bouton centré -->
    <div class="button-container">
      <button @click="takePhoto">📸 Prendre une photo</button>
    </div>

    <canvas ref="canvas" style="display: none"></canvas>

    <p v-if="location">📍 {{ location }}</p>
    <p v-else>📍 Lieu inconnu</p>

    <!-- 🖼️ Galerie des photos enregistrées -->
    <div v-if="gallery.length" class="gallery">
      <h3>🖼️ Galerie</h3>
      <div class="gallery-container">
        <div v-for="(img, index) in gallery" :key="index" class="gallery-item">
          <img :src="img" alt="Gallery Image" />
        </div>
      </div>
      <button @click="clearGallery" class="delete-btn">🗑️ Vider la galerie</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";

export default {
  setup() {
    const video = ref(null);
    const canvas = ref(null);
    const photo = ref(null);
    const location = ref("Lieu inconnu");
    const gallery = ref([]);

    onMounted(() => {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (video.value) {
            video.value.srcObject = stream;
          }
        })
        .catch((error) => console.error("Erreur d'accès à la caméra :", error));

      getLocation();
      loadGallery(); // 🔄 Charger les photos enregistrées
    });

    const takePhoto = () => {
      if (video.value && canvas.value) {
        const context = canvas.value.getContext("2d");
        canvas.value.width = video.value.videoWidth;
        canvas.value.height = video.value.videoHeight;
        context.drawImage(video.value, 0, 0, canvas.value.width, canvas.value.height);
        photo.value = canvas.value.toDataURL("image/png");

        saveToLocalStorage(photo.value);
        navigator.vibrate(200);
        sendNotification(); // 🔔 Envoi de la notification
      }
    };

    const saveToLocalStorage = (image) => {
      const savedImages = JSON.parse(localStorage.getItem("photoGallery")) || [];
      savedImages.push(image);
      localStorage.setItem("photoGallery", JSON.stringify(savedImages));
      loadGallery(); // 🔄 Mettre à jour la galerie
    };

    const loadGallery = () => {
      gallery.value = JSON.parse(localStorage.getItem("photoGallery")) || [];
    };

    const clearGallery = () => {
      localStorage.removeItem("photoGallery");
      gallery.value = [];
    };

    const sendNotification = () => {
      if (!("Notification" in window)) {
        console.warn("Les notifications ne sont pas supportées.");
        return;
      }

      if (Notification.permission === "granted") {
        new Notification("📸 Photo enregistrée !", {
          body: `📍 ${location.value}`,
          icon: photo.value,
        });
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            new Notification("📸 Photo enregistrée !", {
              body: `📍 ${location.value}`,
              icon: photo.value,
            });
          }
        });
      }
    };

    const getLocation = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
              );
              const data = await response.json();
              location.value = data.address.city || data.address.town || "Lieu inconnu";
            } catch (error) {
              console.error("Erreur lors de la récupération de la ville :", error);
            }
          },
          () => {
            console.warn("⚠️ Permission de localisation refusée.");
          }
        );
      } else {
        console.warn("⚠️ La géolocalisation n'est pas supportée.");
      }
    };

    return { video, canvas, photo, takePhoto, location, gallery, clearGallery };
  },
};
</script>

<style scoped>
video {
  width: 100%;
  max-width: 400px;
  border: 2px solid #42b983;
  border-radius: 5px;
  display: block;
  margin: 0 auto;
}

/* Centrage du bouton */
.button-container {
  display: flex;
  justify-content: center;
  margin-top: 15px;
}

button {
  padding: 14px 24px;
  font-size: 18px;
  background-color: #42b983;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

button:active {
  transform: scale(0.95);
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
}

/* 🖼️ Galerie */
.gallery {
  margin-top: 20px;
  text-align: center;
}

.gallery-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

.gallery-item img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 5px;
  border: 2px solid #42b983;
}

.delete-btn {
  margin-top: 10px;
  padding: 12px 20px;
  background-color: #ff4d4d;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  font-size: 16px;
}

.delete-btn:active {
  transform: scale(0.95);
}
</style>