<template>
  <div>
    <el-tree
      :check-on-click-node="true"
      :highlight-current="true"
      :data="keys"
      @node-click="nodeClick"
      :props="props"
    >
      <div class="custom-tree-node" slot-scope="{ node, data }">
        <i class="el-icon-collection-tag"></i>
        <span :width="width - 60 + 'px'" class="tree-label">
          {{ node.label }}
        </span>
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
    }
  }
};
</script>

<style></style>
