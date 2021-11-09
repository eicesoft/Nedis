<template>
  <el-container>
    <el-header class="header" style="height: 32px; line-height: 32px">
      连接

      <el-button
        @click="addConnect"
        circle
        icon="el-icon-plus"
        size="mini"
      ></el-button>
    </el-header>
    <el-container>
      <el-aside class="side" :width="asideWidth + 'px'">
        <div :style="{ height: height + 'px' }" class="key-list">
          <KeyTrees @click="nodeClick" :keys="keys" :width="asideWidth" />
        </div>
      </el-aside>
      <el-container>
        <el-main style="padding: 5px">
          <el-tabs
            @tab-click="changeKey"
            size="mini"
            v-model="nowKey"
            @edit="handleTabsEdit"
          >
            <el-tab-pane
              v-for="(item, index) in editableKeys"
              @contextmenu.prevent="onContextmenu"
              :key="index"
              :label="index"
              :name="index"
            ></el-tab-pane>
          </el-tabs>

          <KeyView :height="height" :info="key"></KeyView>
        </el-main>
      </el-container>
    </el-container>

    <el-footer class="footer" style="height: 29px; line-height: 29px">
      <div class="footer-flex" @contextmenu.prevent="onContextmenu">
        <div class="footer-flex-info">
          Redis Ver: {{ server_infos["Server"]["redis_version"] }}
        </div>
        <div class="footer-flex-info">
          Arch: {{ server_infos["Server"]["arch_bits"] }}
        </div>
        <div class="footer-flex-info">
          运行模式: {{ server_infos["Server"]["redis_mode"] }}
        </div>
        <div class="footer-flex-info">
          运行时间: {{ server_infos["Server"]["uptime_in_days"] }} day
        </div>
        <div class="footer-flex-info">
          OS: {{ server_infos["Server"]["os"] }}
        </div>
        <div class="footer-flex-info">
          Memory: {{ server_infos["Memory"]["used_memory_human"] }}
        </div>
      </div>
    </el-footer>

    <el-dialog
      title="添加服务器"
      :close-on-click-modal="false"
      :visible.sync="addConnectDialog"
      width="50%"
    >
      <el-form size="mini" ref="form" :model="connectInfo" label-width="auto">
        <el-form-item label="连接名称:">
          <el-input v-model="connectInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="服务器地址:">
          <el-input v-model="connectInfo.host"></el-input>
        </el-form-item>
        <el-form-item label="服务器端口:">
          <el-input type="number" v-model="connectInfo.port"></el-input>
        </el-form-item>
        <el-form-item label="服务器密码:">
          <el-input v-model="connectInfo.auth"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" round @click="addConnectDialog = false">
          取 消
        </el-button>
        <el-button
          size="mini"
          round
          type="primary"
          @click="addConnectDialog = false"
        >
          确 定
        </el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import KeyTrees from "../components/KeyTrees";
import KeyView from "../components/KeyView";

import redis from "redis";

export default {
  name: "home-page",
  components: { KeyTrees, KeyView },
  data() {
    return {
      server_infos: {},
      connectInfo: {
        host: "",
        port: 6379,
        auth: "",
        user: "",
        name: ""
      },
      addConnectDialog: false,
      asideWidth: 320,
      editableKeys: {},
      client: null,

      keys: [],
      key: null,
      nowKey: "",
      height: 0
    };
  },
  created() {
    let that = this;
    window.addEventListener("resize", function () {
      that.height = that.getClientHeight() - 62;
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
    that.height = that.getClientHeight() - 62;
  },
  methods: {
    handleTabsEdit() {},
    getClientHeight() {
      return document.documentElement.clientHeight;
    },
    async load() {
      let info_resp = await new Promise(resolve => {
        this.client.info(function (err, data) {
          resolve(data);
        });
      });

      let infos = info_resp.split("\n");
      let group = "";

      let server_infos = {};
      for (let info of infos) {
        if (info.substring(0, 1) == "#") {
          group = info.substring(1).trim();
          server_infos[group] = {};
        } else {
          if (info.indexOf(":") !== -1) {
            let infos = info.split(":");
            server_infos[group][infos[0]] = infos[1];
          }
        }
      }
      this.server_infos = server_infos;
      console.log(server_infos);

      let resp = await new Promise(resolve => {
        this.client.keys("*", function (err, data) {
          resolve(data);
        });
      });
      resp = resp.sort();
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
    nodeClick(data) {
      console.log(data);
      if (!data.isRoot) {
        this.openKey(data.label);
      }
    },
    changeKey(tab, event) {
      this.openKey(tab.label);
    },
    closeKey(tab) {
      console.log(tab);
    },
    async openKey(key) {
      this.nowKey = key;
      let key_info = {
        title: key,
        name: key,
        type: "",
        ttl: -1,
        size: 0,
        isJson: false,
        value: null
      };
      if (this.editableKeys.hasOwnProperty(key)) {
        key_info = this.editableKeys[key];
      } else {
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
            try {
              key_info.json = JSON.parse(val_resp);

              if (typeof key_info.json == "object" && key_info.json) {
                key_info.isJson = true;
              } else {
                key_info.isJson = false;
              }
            } catch (e) {
              key_info.isJson = false;
            }
            key_info.size = val_resp.length;
            break;
          case "hash":
            val_resp = await new Promise(resolve => {
              this.client.hgetall(key, function (err, data) {
                resolve(data);
              });
            });
            key_info.size = Object.keys(val_resp).length;
            break;
          case "list":
            val_resp = await new Promise(resolve => {
              this.client.lrange(key, 0, -1, function (err, data) {
                resolve(data);
              });
            });
            key_info.size = val_resp.length;
            break;
        }
        key_info.value = val_resp;
        this.editableKeys[key] = key_info;
      }
      // console.log(key_info);
      this.key = key_info;
      console.log(this.key);
    },
    open(link) {
      this.$electron.shell.openExternal(link);
    },
    addConnect() {
      this.addConnectDialog = true;
    },
    onContextmenu(event) {
      this.$contextmenu({
        items: [
          {
            label: "返回(B)",
            onClick: () => {
              this.message = "返回(B)";
              console.log("返回(B)");
            }
          }
        ],
        event,
        zIndex: 30,
        minWidth: 100
      });
    }
  }
};
</script>

<style>
.el-tabs__item {
  user-select: none;
  padding: 0 10px !important;
  height: 24px !important;
  line-height: 24px !important;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 140px !important;
  width: 120px !important;
  font-size: 11px !important;
  text-align: center;
}
.el-tabs__nav-next,
.el-tabs__nav-prev {
  line-height: 24px !important;
}
body {
  font-family: Menlo, Monaco, Consolas, "Andale Mono", "lucida console",
    "Courier New", monospace;
  font-size: 13px;
}
.key-list {
  height: 100%;
  overflow-y: auto;
}
.tree-label {
  overflow: hidden;
}
.side {
  border-right: 1px solid #ececec;
  -webkit-box-shadow: inset 0 0 30px rgba(167, 161, 161, 0.5);
}
.header {
  border-bottom: 1px solid #ececec;
  background-color: #f3f3f3;
}
.footer {
  border-top: 1px solid #cccccc;
  background-color: #f3f3f3;
}

.footer-flex {
  display: flex;
}
.footer-flex div {
  border-left: 1px solid #ececec;
  padding: 0 10px;
  margin-right: 10px;
}
.footer-flex div:first-child {
  border-left: 0px solid #ececec;
}
</style>
