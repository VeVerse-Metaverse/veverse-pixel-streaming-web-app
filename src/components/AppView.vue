<template>
  <div class="flex justify-center items-center">
    <div class="border-[1px] border-gray-500 p-4 flex flex-col w-1/4 min-w-[200px]">
      <h4 class="text-xl">Another World</h4>
      <div class="bg-black my-4">
        <img src="../../src/assets/another-world.png" alt="Another World" class=""/>
      </div>
      <button @click="preview">Preview</button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import psStore from '../store/modules/ps';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const props = defineProps({
    appId: {
      type: String,
      required: true
    }
  });

  const preview = async () => {
    if(props.appId === '') {
      await router.push('/');
    } else {
      psStore.setAppId({ appId: props.appId});
      await router.push('/ps');
    }
  };
</script>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
