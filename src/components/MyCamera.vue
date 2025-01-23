<template>
    <div>
      <SimpleVueCamera ref="camera" @started="onCameraStarted" @error="onCameraError" />
      <button @click="takePhoto">Prendre une photo</button>
      <img v-if="photo" :src="photo" alt="Captured image" />
    </div>
</template>
  
<script>
  import { ref } from 'vue';
  import SimpleVueCamera from 'simple-vue-camera';
  
  export default {
    components: {
      SimpleVueCamera,
    },
    setup() {
      const camera = ref(null);
      const photo = ref(null);
  
      const onCameraStarted = () => {
        console.log('La caméra est activée.');
      };
  
      const onCameraError = (error) => {
        console.error('Erreur lors de l’activation de la caméra :', error);
      };
  
      const takePhoto = async () => {
        if (camera.value) {
          try {
            const imageSrc = await camera.value.capture();
            photo.value = imageSrc;
          } catch (error) {
            console.error('Erreur lors de la capture de la photo :', error);
          }
        }
      };
  
      return {
        camera,
        photo,
        takePhoto,
        onCameraStarted,
        onCameraError,
      };
    },
  };
</script>
  
<style scoped>
  button {
    margin-top: 10px;
  }
  img {
    margin-top: 10px;
    max-width: 100%;
  }
</style>