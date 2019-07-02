<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 角色列表 -->
    <el-table :data="rightsList" style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="权限名称" prop="authName"></el-table-column>
      <el-table-column label="路径" prop="path"></el-table-column>
      <el-table-column label="层级" prop="level" :formatter="formatter"></el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      rightsList: []
    };
  },
  async created() {
    let res = await this.$http.get("rights/list");
    // console.log(res.data.data);

    this.rightsList = res.data.data;
  },
  methods: {
    formatter(row) {
      // console.log(row);
      return row.level == 0 ? "一级" : row.level == 1 ? "二级" : "三级";
    }
  }
};
</script>
