<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "redis-ui"
};
</script>

<style>
/* CSS */
.app {
}
::-webkit-scrollbar {
  width: 6px;
}
/* 滚动槽 */
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(139, 139, 139, 0.3);
  border-radius: 10px;
}
/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: #bbb;
  -webkit-box-shadow: inset 0 0 6px rgba(92, 88, 88, 0.5);
}
::-webkit-scrollbar-thumb:window-inactive {
  background: rgba(236, 236, 236, 0.4);
}
</style>
