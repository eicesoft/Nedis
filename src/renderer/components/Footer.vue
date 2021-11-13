<template>
  <el-footer class="footer" style="height: 29px; line-height: 29px">
    <div class="footer-flex">
      <div style="display: flex" v-if="server_infos != null">
        <div :title="server_infos['Server']['redis_version']">
          Redis Ver: {{ server_infos["Server"]["redis_version"] }}
        </div>
        <div :title="server_infos['Server']['arch_bits']">
          Arch: {{ server_infos["Server"]["arch_bits"] }}
        </div>
        <div :title="server_infos['Server']['redis_mode']">
          运行模式: {{ server_infos["Server"]["redis_mode"] }}
        </div>
        <div :title="server_infos['Server']['os']">
          运行时间: {{ server_infos["Server"]["uptime_in_days"] }} day
        </div>
        <div :title="server_infos['Server']['os']">
          OS: {{ server_infos["Server"]["os"] }}
        </div>
        <div :title="server_infos['Memory']['used_memory_human']">
          Memory: {{ server_infos["Memory"]["used_memory_human"] }}
        </div>
      </div>

      <div style="display: flex" v-else>
        <div>未连接</div>
      </div>
      <div class="status-info">
        <i
          @click="openServerStatus"
          title="点击查看服务器状态"
          class="el-icon-info status-ico"
        ></i>
      </div>
    </div>
    <el-dialog
      top="3vh"
      title="服务器状态"
      :close-on-click-modal="false"
      :visible.sync="serverStatusDialog"
      width="80%"
    >
      <div class="dialog-body">
        <el-tabs v-model="defaultTab">
          <el-tab-pane
            v-for="(server_info, index) in server_infos"
            :key="index"
            :label="index"
            :name="index"
          >
            <div class="tab-view">
              <table style="width: 100%">
                <thead>
                  <tr>
                    <th width="40%">Key</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tr :key="key" v-for="(value, key) in server_info">
                  <th style="text-align: left">
                    {{ key }}
                  </th>
                  <td>
                    <span v-copy="value">{{ value }}</span>
                  </td>
                </tr>
              </table>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          size="mini"
          round
          @click="serverStatusDialog = false"
        >
          关闭
        </el-button>
      </span>
    </el-dialog>
  </el-footer>
</template>

<script>
export default {
  props: {
    server_infos: {
      type: Object
    }
  },
  data() {
    return {
      defaultTab: "",
      serverStatusDialog: false
    };
  },
  mounted() {
    // console.log("server_info", this.server_infos);
    if (this.server_infos != undefined) {
      let server_info_keys = Object.keys(this.server_infos);
      if (server_info_keys.length > 0) {
        this.defaultTab = server_info_keys[0];
      }
    }
  },
  methods: {
    openServerStatus() {
      console.log(this.server_infos);
      let server_info_keys = Object.keys(this.server_infos);
      if (server_info_keys.length > 0) {
        this.defaultTab = server_info_keys[0];
      }
      this.serverStatusDialog = true;
    }
  }
};
</script>

<style scoped>
.footer {
  cursor: default;
  border-top: 1px solid #cccccc;
  background-color: #f3f3f3;
  user-select: none;
}

.footer-flex {
  display: flex;
  justify-content: space-between;
}
.footer-flex div {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-left: 1px solid #dcdcdc;
  padding: 0 10px;
  margin-right: 10px;
}
.footer-flex div:first-child {
  border-left: 0px;
}
.footer-flex div:last-child {
  padding: 0 5px;
  margin-right: 0;
}
.status-info {
  width: 24px;
  text-align: right;
  font-size: 18px;
  height: 29px;
  line-height: 29px;
  overflow: hidden;
  text-overflow: inherit !important;
  white-space: nowrap;
}
.status-ico {
  vertical-align: middle !important;
  line-height: 29px !important;
}
.status-ico:hover {
  color: #409eff;
  cursor: pointer;
}
.dialog-body {
  margin: 0px;
}
.tab-view {
  height: 400px;
  overflow-y: auto;
}
</style>
