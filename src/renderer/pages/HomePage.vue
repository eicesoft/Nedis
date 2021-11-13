<template>
  <el-container>
    <el-header class="header" style="height: 36px; line-height: 36px">
      <RHeader @close-server="closeServer" @connect="connectServer"></RHeader>
    </el-header>
    <el-container>
      <el-aside class="side" :width="asideWidth + 'px'">
        <div :style="{ height: height + 'px' }" class="key-list">
          <KeyTrees
            @refresh="refreshDB"
            @click="nodeClick"
            :keys="keys"
            :width="asideWidth"
          />
        </div>
      </el-aside>
      <el-container>
        <el-main style="padding: 2px">
          <el-tabs
            @tab-click="changeKey"
            @tab-remove="closeKey"
            size="mini"
            v-model="nowKey"
            :closable="true"
          >
            <el-tab-pane
              v-for="(item, index) in editableKeys"
              :key="index"
              :label="index"
              :name="index"
            >
              <span :title="index" class="tab-item" slot="label">
                {{ index }}
              </span>
            </el-tab-pane>
          </el-tabs>

          <KeyView v-if="key !== null" :height="height" :info="key"></KeyView>
        </el-main>
      </el-container>
    </el-container>

    <Footer :server_infos="server_infos"></Footer>
  </el-container>
</template>

<script>
import KeyTrees from "../components/KeyTrees";
import KeyView from "../components/KeyView";
import RHeader from "../components/RHeader";
import Footer from "../components/Footer";
import Redis from "../util/redis.js";
import { mapGetters } from "vuex";
import clone from "../util/index.js";

const otherHeight = 66;
export default {
  name: "home-page",
  components: { KeyTrees, KeyView, Footer, RHeader },
  computed: { ...mapGetters(["connections"]) },
  data() {
    return {
      server_infos: null,
      connectInfo: null,
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
    that.height = that.getClientHeight() - otherHeight;

    window.addEventListener("resize", function () {
      that.height = that.getClientHeight() - otherHeight;
      console.log(that.height);
    });
    // this.client = new Redis("shop.hongbung.com", 6379, "", "", this.load);
  },
  methods: {
    getClientHeight() {
      return document.documentElement.clientHeight;
    },
    getDbInfo() {
      let dbInfos = {};
      let keySpaces = this.server_infos.Keyspace;
      // console.log(keySpaces);
      for (let dbName in keySpaces) {
        let keySpace = keySpaces[dbName];
        let info = keySpace.split(",");
        let dbInfo = {};
        for (let value of info) {
          let kv = value.split("=");
          if (kv.length == 2) {
            dbInfo[kv[0]] = kv[1];
          }
        }

        dbInfos[dbName] = dbInfo;
      }
      return dbInfos;
    },
    async load() {
      console.log(this.connectInfo);
      this.keys = [];
      this.server_infos = await this.client.info();
      let dbInfos = this.getDbInfo();
      let dbChildren = [];
      for (let i = 0; i < 16; i++) {
        let dbName = "db" + i;
        if (dbInfos.hasOwnProperty(dbName)) {
          let dbInfo = dbInfos[dbName];

          dbChildren.push({
            children: [],
            type: 1,
            load: false,
            name: dbName,
            dbIndex: i,
            label: `${dbName}(${dbInfo.keys})`
          });
        } else {
          dbChildren.push({
            children: [],
            type: 1,
            load: false,
            name: dbName,
            dbIndex: i,
            label: `${dbName}(0)`
          });
        }
      }
      // let keys_resp = await this.client.keys();
      // keys_resp = keys_resp.sort();
      let keys = [];
      // for (let key of keys_resp) {
      //   keys.push({
      //     type: 2,
      //     label: key
      //   });
      // }

      this.keys.push({
        children: dbChildren,
        type: 0,
        isRoot: true,
        label: `${this.connectInfo.name}(${dbChildren.length})`
      });
    },
    async nodeClick(data) {
      if (data.type == 2) {
        this.openKey(data.label);
      } else if (data.type == 1) {
        //open db
        await this.client.select(data.dbIndex);

        if (!data.load) {
          let keys_resp = await this.client.keys();
          keys_resp = keys_resp.sort();
          console.log(keys_resp);
          let keys = [];
          for (let key of keys_resp) {
            keys.push({
              type: 2,
              label: key
            });
          }
          this.keys[0]["children"][data.dbIndex]["load"] = true;
          this.keys[0]["children"][data.dbIndex]["children"] = keys;
        }
      }
    },
    changeKey(tab) {
      this.openKey(tab.label);
    },
    closeKey(tab) {
      delete this.editableKeys[tab];
      let keys = Object.keys(this.editableKeys);
      if (keys.length == 0) {
        //没有打开的Key了
        this.key = null;
        this.nowKey = "";
      } else {
        this.openKey(keys[0]);
      }

      this.$forceUpdate();
    },
    async openKey(key) {
      this.nowKey = key;
      let key_info;
      if (this.editableKeys.hasOwnProperty(key)) {
        key_info = this.editableKeys[key];
      } else {
        key_info = await this.client.getKeyInfo(key);
        this.editableKeys[key] = key_info;
      }
      // console.log(key_info);
      this.key = key_info;
    },
    async closeServer() {
      console.log("Close server");
      this.editableKeys = {};
      this.key = null;
      this.nowKey = "";
      if (this.client !== null) {
        await this.client.close();
      }
      this.connectInfo = {};
    },
    async connectServer(conn) {
      this.closeServer();
      this.connectInfo = conn;
      console.log(this.connectInfo);
      this.client = new Redis(
        this.connectInfo.host,
        this.connectInfo.port,
        this.connectInfo.user,
        this.connectInfo.pass,
        this.load
      );
    },
    refreshDB(data) {
      console.log(data);
    },
    open(link) {
      this.$electron.shell.openExternal(link);
    }
  }
};
</script>

<style scoped>
/deep/.el-tabs__item {
  user-select: none;
  padding: 0 10px !important;
  height: 26px !important;
  line-height: 26px !important;

  /* max-width: 140px !important;
  width: 120px !important; */
  font-size: 12px !important;
  text-align: center;
}
/deep/.el-tabs__nav-next,
/deep/.el-tabs__nav-prev {
  line-height: 26px !important;
}
.tab-item {
  display: inline-flex;
  text-align: center;
  max-width: 140px !important;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
  /* -webkit-box-shadow: inset 0 0 30px rgba(167, 161, 161, 0.5); */
}

.header {
  border-bottom: 1px solid #dcdcdc;
  background-color: #f3f3f3;
  padding: 0 5px !important;
}
</style>
