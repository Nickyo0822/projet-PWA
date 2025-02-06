<template>
  <div>
    <video ref="video" autoplay></video>
    <button @click="takePhoto">📸 Prendre une photo</button>
    <canvas ref="canvas" style="display: none"></canvas>
    <img v-if="photo" :src="photo" alt="Captured image" />

    <p v-if="location">📍 {{ location }}</p>
    <p v-else>📍 Lieu inconnu</p>

    <!-- 📌 POPUP -->
    <div v-if="showPopup" class="popup">
      <div class="popup-content">
        <h3>📸 Photo enregistrée !</h3>
        <img :src="photo" alt="Captured photo" />
        <p>📍 {{ location }}</p>
        <button @click="closePopup">OK</button>
      </div>
    </div>

    <!-- 🖼️ GALERIE DES PHOTOS ENREGISTRÉES -->
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
    const showPopup = ref(false);
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

        showPopup.value = true;
      }
    };

    const closePopup = () => {
      showPopup.value = false;
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

    return { video, canvas, photo, takePhoto, showPopup, closePopup, location, gallery, clearGallery };
  },
};
</script>

<style scoped>
video {
  width: 100%;
  max-width: 400px;
  border: 2px solid #42b983;
  border-radius: 5px;
}

button {
  margin-top: 10px;
  padding: 10px;
  background-color: #42b983;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}

.popup-content img {
  max-width: 100%;
  margin-top: 10px;
  border-radius: 5px;
}

.popup-content button {
  margin-top: 10px;
  padding: 10px;
  background-color: #42b983;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
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
  padding: 10px;
  background-color: #ff4d4d;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}
</style>
