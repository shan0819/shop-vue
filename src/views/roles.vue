<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 角色列表 -->
    <el-table :data="rolesList" style="width: 100%">
      <!-- <template v-slot="{row}"> -->
      <el-table-column type="expand" prop="authName">
        <template v-slot="{row}">
          <!-- <el-tag v-for="tag in row.children" :key="tag.authName" closable type>{{tag.authName}}</el-tag> -->
          <el-table :data="row.children" style="width: 100%" :lazy="true" :show-header="false">
            <!--
            row-key="authName" :tree-props="{children: 'children', hasChildren: 'hasChildren'}"-->
            <el-table-column prop="authName" label="123" width="180"></el-table-column>
            <el-table-column prop="authName" label="345" width="180"></el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <!-- </template> -->
      <el-table-column type="index"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作">
        <template v-slot="{row}">
          <el-button type="primary" icon="el-icon-edit" size="mini" plain></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" plain></el-button>
          <el-button type="success" icon="el-icon-check" size="mini" plain>分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: []
    };
  },
  created() {
    this.$http.get("roles").then(res => {
      // console.log(res);
      this.rolesList = res.data.data;
      console.log(this.rolesList);
    });
  },
  methods: {
    formatter({ row, column, cellValue, index }) {
      console.log(row);
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      console.log(row, column, rowIndex, columnIndex);

      // if (rowIndex % 2 === 0) {
      //   if (columnIndex === 0) {
      //     return [1, 2];
      //   } else if (columnIndex === 1) {
      //     return [0, 0];
      //   }
      // }
    },

    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // console.log(row);
      // if (columnIndex === 0) {
      //   if (rowIndex % 2 === 0) {
      //     return {
      //       rowspan: 2,
      //       colspan: 1
      //     };
      //   } else {
      //     return {
      //       rowspan: 0,
      //       colspan: 0
      //     };
      //   }
      // }
    }
  }
};
</script>

<style>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
