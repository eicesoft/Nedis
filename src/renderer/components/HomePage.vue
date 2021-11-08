<template>
  <el-container>
    <el-aside :width="asideWidth + 'px'">
      <div :style="{ height: height + 'px' }" class="key-list">
        <el-tree
          :check-on-click-node="true"
          :highlight-current="true"
          :data="keys"
          @node-click="nodeClick"
          :props="props"
        >
          <div class="custom-tree-node" slot-scope="{ node, data }">
            <i class="el-icon-collection-tag"></i>
            <el-tooltip
              class="item"
              effect="dark"
              :content="node.label"
              placement="right-end"
            >
              <span :width="asideWidth - 60 + 'px'" class="tree-label">
                {{ node.label }}
              </span>
            </el-tooltip>
          </div>
        </el-tree>
      </div>
    </el-aside>
    <el-container>
      <el-main>
        <el-tabs
          :closable="true"
          size="mini"
          v-model="nowKey"
          @edit="handleTabsEdit"
        >
          <el-tab-pane
            v-for="(item, index) in editableKeys"
            :key="index"
            :label="index"
            :name="index"
          ></el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import SystemInformation from "./LandingPage/SystemInformation";
import redis from "redis";

export default {
  name: "landing-page",
  components: { SystemInformation },
  data() {
    return {
      asideWidth: 320,
      editableKeys: {},
      client: null,
      props: {
        children: "children",
        label: "label"
      },
      keys: [],
      key: null,
      nowKey: "",
      height: 0
    };
  },
  created() {
    let that = this;
    window.addEventListener("resize", function () {
      that.height = that.getClientHeight() - 20;
      console.log(that.height);
    });
    this.client = redis.createClient({
      connect_timeout: 1000,
      retry_max_delay: 2,
      host: "shop.hongbung.com",
      port: 6379
    });
    // console.log(this.client);
    this.client.on("connect", this.load);
    that.height = that.getClientHeight() - 20;
  },
  methods: {
    handleTabsEdit() {},
    getClientHeight() {
      return document.documentElement.clientHeight;
    },
    async load() {
      let resp = await new Promise(resolve => {
        this.client.keys("*", function (err, data) {
          resolve(data);
        });
      });
      let keys = [];
      for (let key of resp) {
        keys.push({
          label: key
        });
      }
      this.keys.push({
        children: keys,
        isRoot: true,
        label: "Server"
      });
    },
    nodeClick(data, node, comp) {
      console.log(data);
      if (!data.isRoot) {
        this.openKey(data.label);
      }
    },
    async openKey(key) {
      //   title: 'Tab 1',
      //   name: '1',
      //   content: 'Tab 1 content'
      // }
      let key_info = {
        title: key,
        name: key,
        type: "",
        ttl: -1,
        value: null
      };
      let type_resp = await new Promise(resolve => {
        this.client.type(key, function (err, data) {
          resolve(data);
        });
      });
      key_info.type = type_resp;

      let ttl_resp = await new Promise(resolve => {
        this.client.ttl(key, function (err, data) {
          resolve(data);
        });
      });
      key_info.ttl = ttl_resp;

      let val_resp;
      switch (type_resp) {
        case "string":
          val_resp = await new Promise(resolve => {
            this.client.get(key, function (err, data) {
              resolve(data);
            });
          });
          break;
        case "hash":
          val_resp = await new Promise(resolve => {
            this.client.hgetall(key, function (err, data) {
              resolve(data);
            });
          });
          break;
      }
      key_info.value = val_resp;
      console.log(key_info);
      this.key = key_info;
      this.nowKey = key;
      this.editableKeys[key] = key_info;
      console.log(this.nowKey);
    },
    open(link) {
      this.$electron.shell.openExternal(link);
    }
  }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Source+Sans+Pro");

body {
  font-family: "Source Sans Pro", sans-serif;
}
.key-list {
  height: 100%;
  overflow-y: auto;
}
.tree-label {
  overflow: hidden;
}
</style>
