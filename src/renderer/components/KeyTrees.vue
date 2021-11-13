<template>
  <div>
    <el-tree
      :check-on-click-node="true"
      :highlight-current="true"
      :data="keys"
      @node-click="nodeClick"
      :props="props"
    >
      <div class="tree-node" slot-scope="{ node, data }">
        <div>
          <i v-if="data.type == 0" class="el-icon-s-home"></i>
          <i v-if="data.type == 1" class="el-icon-collection"></i>
          <i v-if="data.type == 2" class="el-icon-collection-tag"></i>
          <span :width="width - 60 + 'px'" class="tree-label">
            {{ node.label }}
          </span>
        </div>
        <div>
          <i
            @click.stop="refresh(data)"
            title="刷新"
            v-if="data.type == 1"
            class="el-icon-refresh-right toolbar"
          ></i>
        </div>
      </div>
    </el-tree>
  </div>
</template>

<script>
export default {
  props: {
    keys: {
      type: Array,
      default() {
        return [];
      }
    },
    width: {
      type: Number,
      default: 300
    }
  },
  data() {
    return {
      props: {
        children: "children",
        label: "label"
      }
    };
  },
  methods: {
    nodeClick(data, node, component) {
      this.$emit("click", data);
    },
    refresh(data) {
      this.$emit("refresh", data);
    }
  }
};
</script>

<style scoped>
.tree-node {
  display: flex;
  justify-content: space-between;
  width: 90%;
  cursor: grab !important;
}
.toolbar {
  cursor: pointer !important;
  font-size: 14px;
}
.toolbar:hover {
  color: rgb(71, 0, 0);
}
</style>
