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
body {
  margin: auto;
  padding: auto;
}
/* CSS */
::-webkit-scrollbar {
  width: 6px;
}
/* 滚动槽 */
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(189, 189, 189, 0.3);
  border-radius: 10px;
}
/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: rgb(216, 216, 216);
  -webkit-box-shadow: inset 0 0 3px rgba(167, 161, 161, 0.5);
}
::-webkit-scrollbar-thumb:window-inactive {
  background: rgba(197, 197, 197, 0.4);
}
</style>
