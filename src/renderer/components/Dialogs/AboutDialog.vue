<template>
  <el-dialog
    v-drag
    :title="'关于 - ' + name"
    @close="close"
    :close-on-press-escape="true"
    :destroy-on-close="true"
    :close-on-click-modal="false"
    :visible.sync="dialogVisable"
    width="50%"
  >
    <div class="items">
      <div class="item">
        <div class="name">名称:</div>
        <div class="value">{{ name }}</div>
      </div>
      <div class="item">
        <div class="name">版本:</div>
        <div class="value">{{ version }}</div>
      </div>
      <div class="item">
        <div class="name">Vue.js:</div>
        <div class="value">{{ vue }}</div>
      </div>

      <div class="item">
        <div class="name">Electron:</div>
        <div class="value">{{ electron }}</div>
      </div>
      <div class="item">
        <div class="name">Node:</div>
        <div class="value">{{ node }}</div>
      </div>
      <div class="item">
        <div class="name">Platform:</div>
        <div class="value">{{ platform }}</div>
      </div>
      <div class="item">
        <div class="name">Author:</div>
        <div class="value">{{ author }}</div>
      </div>
      <div class="item">
        <div class="name">Mail:</div>
        <div class="value">
          <a :href="'mailto://' + mail">{{ mail }}</a>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    dialogVisable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      electron: process.versions.electron,
      name: process.env.npm_package_build_productName,
      version: process.env.npm_package_version,
      node: process.versions.node,
      path: this.$route.path,
      platform: require("os").platform(),
      vue: require("vue/package.json").version,
      mail: process.env.npm_package_author_email,
      author: process.env.npm_package_author_name
    };
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

<style scoped>
.items {
  margin-top: 4px;
}

.item {
  display: flex;
  margin-bottom: 3px;
}

.item .name {
  color: #6a6a6a;
  margin-right: 3px;
  width: 100px;
  text-align: right;
}

.item .value {
  color: #35495e;
  font-weight: bold;
  margin-left: 10px;
}
</style>
