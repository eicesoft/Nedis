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
@import url("https://fonts.googleapis.com/css2?family=Merriweather+Sans&display=swap");

body {
  margin: auto;
  padding: auto;

  font-family: "Merriweather Sans", sans-serif;
  font-size: 13px;
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
  width: 2px;
}
.el-dialog__header {
  padding: 5px 10px 5px !important;
  font-size: 16px !important;
  font-weight: 800;
}
.el-dialog__body {
  padding: 10px 20px !important;
}
.el-message {
  padding: 8px !important;
}
.el-message__content {
  font-size: 12px !important;
}
</style>
