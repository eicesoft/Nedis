<template>
  <div id="header">
    <div class="header-bar">
      <div>
        连接:
        <el-select size="mini" v-model="nowConnection">
          <el-option
            v-for="(connection, index) in connections"
            v-if="connection != null"
            :key="index"
            :label="
              connection.name +
              '(' +
              connection.host +
              ':' +
              connection.port +
              ')'
            "
            :value="index"
          ></el-option>
        </el-select>

        <i
          v-if="nowConnection !== null"
          @click="connectServer"
          title="连接"
          class="el-icon-connection status-ico"
        ></i>

        <i
          v-if="nowConnection !== null"
          class="el-icon-edit status-ico"
          title="编辑连接"
          @click="editConnect"
        ></i>

        <i
          v-if="nowConnection !== null"
          class="el-icon-delete status-ico"
          title="删除连接"
          @click="deleteConnect"
        ></i>

        <i
          @click="addConnect"
          title="添加连接"
          class="el-icon-plus status-ico"
        ></i>
      </div>
      <div>
        <i
          @click="openSetup"
          title="设置"
          class="el-icon-setting status-ico"
        ></i>
        <i
          @click="openAbout"
          title="关于我们"
          class="el-icon-chat-line-round status-ico"
        ></i>
      </div>
    </div>

    <AboutDialog :dialogVisable.sync="aboutDialog"></AboutDialog>
    <SetupDialog :dialogVisable.sync="setupDialog"></SetupDialog>

    <el-dialog
      v-drag
      title="添加服务器"
      :close-on-click-modal="false"
      :visible.sync="addConnectDialog"
      :destroy-on-close="true"
      width="50%"
    >
      <el-form size="mini" ref="form" :model="connectInfo" label-width="auto">
        <el-form-item label="连接名称:">
          <el-input v-model="connectInfo.name" clearable></el-input>
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
        <el-button size="mini" round type="primary" @click="saveConnect">
          确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import SetupDialog from "./Dialogs/SetupDialog";
import AboutDialog from "./Dialogs/AboutDialog";

import { mapGetters, mapActions } from "vuex";

const defaultConnect = { host: "", port: 6379, auth: "", user: "", name: "" };

export default {
  name: "r-header",
  components: { SetupDialog, AboutDialog },
  computed: {
    ...mapGetters(["connections"])
  },
  created() {
    console.log(this.connections);
  },
  data() {
    return {
      addConnectDialog: false,
      aboutDialog: false,
      setupDialog: false,
      mode: 0,
      connectInfo: {}, //连接信息
      nowConnection: null
    };
  },
  methods: {
    /**
     * 添加连接
     */
    addConnect() {
      this.mode = 1;
      this.connectInfo = defaultConnect;
      this.addConnectDialog = true;
    },
    /**
     * 打开关于
     */
    openAbout() {
      this.aboutDialog = true;
    },
    /**
     * 打开设置
     */
    openSetup() {
      this.setupDialog = true;
    },
    /**
     * 保存连接
     */
    saveConnect() {
      if (this.mode === 1) {
        this.$store.dispatch("addConnection", this.connectInfo);
      } else if (this.mode === 2) {
        this.$store.dispatch(
          "editConnection",
          this.connectInfo,
          this.nowConnection
        );
      }
      this.addConnectDialog = false;
    },
    /**
     * 修改连接
     */
    editConnect() {
      this.mode = 2;
      if (this.nowConnection !== null && this.nowConnection !== undefined) {
        this.connectInfo = this.connections[this.nowConnection];
        this.addConnectDialog = true;
      }
    },
    deleteConnect() {
      this.$store.dispatch("deleteConnection", this.nowConnection);
      this.nowConnection = null;
      this.$emit("close-server");
    },
    /**
     * 连接服务器
     */
    connectServer() {
      if (this.nowConnection != null) {
        const conn = this.connections[this.nowConnection];
        this.$emit("connect", conn);
      }
    }
  }
};
</script>

<style scoped>
.title {
  color: #888;
  font-size: 18px;
  font-weight: initial;
  letter-spacing: 0.25px;
  margin-top: 10px;
}

.header-bar {
  display: flex;
  justify-content: space-between;
  margin: 0 10px;
}
.status-ico {
  margin-left: 5px;
  vertical-align: middle !important;
  line-height: 29px !important;
  font-size: 20px;
}
.status-ico:hover {
  color: #409eff;
  cursor: pointer;
}
</style>
