<template>
  <el-dialog
    v-drag
    @close="close"
    :close-on-press-escape="true"
    :destroy-on-close="true"
    title="软件设置"
    :close-on-click-modal="false"
    :visible.sync="dialogVisable"
    width="50%"
  >
    <el-tabs>
      <el-tab-pane label="连接设置"></el-tab-pane>
      <el-tab-pane label="显示设置"></el-tab-pane>
    </el-tabs>
    <span slot="footer" class="dialog-footer">
      <el-button size="mini" round @click="dialogVisable = false">
        关闭
      </el-button>
      <el-button size="mini" round type="primary" @click="saveSetup">
        保存
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "setup-dialog",
  props: {
    dialogVisable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  methods: {
    close() {
      this.$emit("update:dialogVisable", false);
    },
    saveSetup() {
      this.$emit("update:dialogVisable", false);
    }
  }
};
</script>

<style></style>
