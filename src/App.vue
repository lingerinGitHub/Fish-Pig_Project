<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import mitt from './utils/mitt'
import { ElNotification } from 'element-plus'

onMounted(() => {
  mitt.on('ElNotification', (message: any) => {

    if (message.type === 'success' || message.type === 'error' || message.type === 'warning' || message.type === 'info') {
      ElNotification({
        title: message.title,
        message: message.message,
        type: message.type,
        duration: 3000,
        offset: 50,
        zIndex: 9999
      })
    }
  })

});

// 卸载前移除监听事件
onBeforeUnmount(() => {
  mitt.off('ElNotification', () => { });
});

</script>

<style scoped></style>
