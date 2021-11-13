<template>
  <div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="date" label="日期" width="180"></el-table-column>
      <el-table-column prop="name" label="姓名" width="180"></el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
    </el-table>
    <!-- <el-table :data="table_data">
      <el-table-column prop="xxx" label="Key" width="120"></el-table-column>
      <el-table-column prop="yyy" label="数据值" width="120"></el-table-column>
    </el-table> -->
    <div class="hash-item" v-for="(item, index) in info.value">
      <div class="hash-item-label">{{ index }}</div>
      <div class="hash-item-value">{{ item }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "hash-view",
  props: {
    info: {
      type: Object
    }
  },
  data() {
    return {
      currentRow: null,
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        }
      ]
    };
  },
  computed: {
    // table_data() {
    //   let data = [];
    //   if (this.info != undefined) {
    //     let i = 1;
    //     for (let key in this.info.value) {
    //       data.push({
    //         index: i++,
    //         key: key,
    //         value: this.info.value[key]
    //       });
    //     }
    //   }
    //   console.log(data);
    //   return data;
    // }
  },
  methods: {
    handleCurrentChange(val) {
      this.currentRow = val;
    }
  }
};
</script>

<style scoped>
.hash-item {
  display: flex;
  width: 100%;
}
.hash-item-label {
  width: 20%;
  padding: 0 10px;
  line-height: 20px;
}
.hash-item-value {
  width: 80%;
  overflow: hidden;
  word-wrap: break-word;
}
</style>
