<template>
  <iframe
      v-show="url !== ''"
      class="iframe"
      :src="url"
      allowtransparency="true" style="background: #FFFFFF;"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen>
  </iframe>
  <div v-show="!isLoaded" class="flex h-full w-full justify-center flex-col items-center">
    <img
        alt=""
        src="../assets/another-world.png"
        class="h-[100px] w-[100px] flex justify-center"
        v-motion
        :initial="{
        opacity: 0.1,
        scale: 1,
      }"
        :enter="enter"
    />
    <p>{{ status }}</p>
  </div>
</template>

<script setup lang="ts">
import {onBeforeMount, onMounted, reactive, ref, watch} from "vue";
import psStore from "../store/modules/ps";
import router from "../router";

import { useRetry } from "vue-composable";

const enter = reactive({
  opacity: 0.3,
  scale: 1.1,
  transition: {
    repeat: Infinity,
    repeatDelay: 500,
    opacityDelay: 500,
  },
})

const maxRetries = ref(20);
const delay = ref(30000);
const url = ref("");
const status = ref("Searching for resources to start the stream...");
const isLoaded = ref(false);
const isMounted = ref(false);
const dateNow = ref(Date.now());

const { isRetrying, exec, retryCount } = useRetry({
  maxRetries: maxRetries.value,
  retryDelay: () => delay.value,
});

onBeforeMount(() => {
  console.log("PS BEFORE MOUNT")
  window.addEventListener("beforeunload", clearStreamData);
});

onMounted( () => {
  setTimeout(async () => {
    console.log("PS MOUNTED")
    const appId = psStore.appId;

    if(appId === '') {
      await router.push('/');
    } else {
      if (psStore.sessionId !== "") {
        console.log("SESSION ID:", psStore.sessionId)
      } else {
        await retryCheckAvailableStreams(appId);
        console.log("GET NEW SESSION ID:", psStore.sessionId)
      }

      await setupStreamingFrame(psStore.sessionId);

      isMounted.value = true;

      // All streams are in use. Please waiting for search resources to start the stream
      // status.value = "Starting stream session.";
    }
  }, 1)
});


// setInterval(() => (dateNow.value = Date.now()), 10);
// setInterval(() => {
//   if (nextRetry.value && isRetrying) {
//     console.log("retrying in", Math.floor(nextRetry.value - dateNow.value) + "ms")
//   }
// }, 1000)

watch(() => psStore.isAvailableFreeStreams, function() {
  console.log("retry", isRetrying.value, psStore.isAvailableFreeStreams, retryCount.value)

  if(!psStore.isAvailableFreeStreams) {
    exec(async () => {
      await retryCheckAvailableStreams(psStore.appId);
      await setupStreamingFrame(psStore.sessionId);
    });
  }
});

watch(() => retryCount.value, function() {
  console.log("retry count", retryCount.value)
  if (retryCount.value > maxRetries.value) {
    status.value = "No resources found to start the stream. Please try again later."
    enter.scale = 1;
    enter.opacity = 0.1;
    enter.transition.repeat = 0;
  }
})

async function retryCheckAvailableStreams(appId: string) {
  await psStore.requestNewSession({ appId });
  if(!psStore.isAvailableFreeStreams) {
    status.value = "All streams are in use. Please waiting for search resources to start the stream"
    return Promise.reject(new Error("not available free streams"));
  }

  return Promise.resolve();
}

async function setupStreamingFrame(sessionId: string) {
  if(sessionId !== '') {
    await psStore.requestStreamData({ sessionId });
    status.value = "Found resource to start the stream..."
    console.log("GET STREAM URL:", psStore.streamUrl)

    const iframe = document.querySelector('iframe');
    if (iframe === null || iframe.contentWindow === null) return;

    iframe.style.background = 'black';
    iframe.contentWindow.document.body.style.backgroundColor = '#000000'

    // url.value = 'http://localhost';
    url.value = psStore.streamUrl;
    iframe.onload = () => {
      console.log("LOADED")
      isLoaded.value = true;
    }

    iframe.onloadeddata = () => {
      console.log("LOADED DATA")
    }

    iframe.onloadedmetadata = () => {
      console.log("LOADED METADATA")
    }

    iframe.onerror = () => {
      console.log("ERROR")
    }

    iframe.oninvalid = () => {
      console.log("INVALID")
    }
  }
}

async function clearStreamData() {
  psStore.setAppId({ appId: '' });
  psStore.setSessionId({ sessionId: '' });
  psStore.setStreamUrl({ streamUrl: '' });
}


</script>

<style scoped>
.iframe {
  width: 100%;
  height: 100%;
}
</style>
