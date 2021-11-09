<template>
  <div>
    <div class="info">
      <div>
        Key:
        <el-tag size="mini">{{ info.name }}</el-tag>
      </div>
      <div>
        类型:
        <el-tag size="mini">{{ info.type }}</el-tag>
      </div>
      <div>
        TTL:
        <el-tag size="mini">{{ info.ttl }}</el-tag>
      </div>
      <div>
        Size:
        <el-tag size="mini">{{ info.size | formatSize }}</el-tag>
      </div>
      <div>
        <i class="el-icon-refresh-right icon" title="刷新"></i>
        <i class="el-icon-edit icon" title="编辑"></i>
        <i class="el-icon-delete icon" title="删除"></i>
      </div>
    </div>
    <div class="value" :style="{ maxHeight: height - 105 + 'px' }">
      <template v-if="info.type == 'string'">
        <template v-if="info.isJson">
          <JsonViewer
            class="json-view"
            :value="info.json"
            :expand-depth="5"
            copyable
          ></JsonViewer>
        </template>
        <template v-else>
          {{ info.value }}
        </template>
      </template>

      <template v-else-if="info.type == 'hash'">
        <div class="hash-item" v-for="(item, key) in info.value">
          <div class="hash-item-label">{{ key }}:</div>
          <div class="hash-item-value">{{ item }}</div>
        </div>
      </template>

      <template v-else-if="info.type == 'list'">
        <div class="hash-item" v-for="(item, index) in info.value">
          <div class="hash-item-label">{{ index }}</div>
          <div class="hash-item-value">{{ item }}</div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import JsonViewer from "vue-json-viewer";

export default {
  name: "key-view",
  components: { JsonViewer },
  props: {
    height: {
      type: Number
    },
    info: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  filters: {
    formatSize(size) {
      if (size > 1024) {
        return (size / 1024).toFixed(2) + "K";
      } else {
        return size;
      }
    }
  }
};
</script>

<style>
.icon {
  font-size: 20px;
  cursor: pointer;
}
.icon:hover {
  color: #409eff;
}
.info {
  display: flex;
}
.hash-item {
  display: flex;
}
.info div {
  margin: 0 20px;
}
.value {
  margin: 10px 10px 0 10px;
  padding: 10px;
  border: 1px solid #ececec;
  word-wrap: break-word;
  overflow-y: auto;
}

.json-view {
  height: 100%;
}
</style>
