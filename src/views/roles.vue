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
      <el-table-column type="expand" prop="authName">
        <template v-slot="{row}">
          <el-row v-for="level1 in row.children" :key="level1.id">
            <el-col :span="4">
              <el-tag closable>{{level1.authName}}</el-tag>
            </el-col>
            <el-col :span="20">
              <el-row v-for="level2 in level1.children" :key="level2.id">
                <el-col :span="4">
                  <el-tag closable type="success">{{level2.authName}}</el-tag>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    closable
                    type="warning"
                    v-for="level3 in level2.children"
                    :key="level3.id"
                  >{{level3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作">
        <template v-slot="{row}">
          <el-button type="primary" icon="el-icon-edit" size="mini" plain></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            plain
            @click="delRoles(row.id)"
          ></el-button>
          <el-button
            type="success"
            icon="el-icon-check"
            size="mini"
            plain
            @click="getAssignRolesList(row,row.id)"
          >分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="isAssignRolesList">
      <el-tree
        :data="assignRolesList"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="checkedRights"
        :props="defaultProps"
        ref="tree"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isAssignRolesList = false">取 消</el-button>
        <el-button type="primary" @click="assignRoles">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
      isAssignRolesList: false,
      assignRolesList: [],
      defaultProps: {
        children: "children",
        label: "authName"
      },
      checkedRights: [],
      curRoleId: -1,
      rids: []
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    getRolesList() {
      this.$http.get("roles").then(res => {
        this.rolesList = res.data.data;
      });
    },

    async getAssignRolesList(row, id) {
      this.isAssignRolesList = true;
      let res = await this.$http({
        url: "rights/tree"
      });
      this.assignRolesList = res.data.data;
      this.curRoleId = id;
      // let level1 = [];
      // let level2 = [];
      // let level3 = [];
      row.children.forEach(item1 => {
        // level1.push(item1.id);
        item1.children.forEach(item2 => {
          // level2.push(item2.id);
          item2.children.forEach(item3 => {
            this.checkedRights.push(item3.id);
          });
        });
      });
      // this.checkedRights = [...level1, ...level2, ...level3];
    },
    async assignRoles() {
      // console.log(this.$refs.tree.getHalfCheckedKeys());
      // console.log(this.$refs.tree.getCheckedKeys());
      this.rids = [
        ...this.$refs.tree.getCheckedKeys(),
        ...this.$refs.tree.getHalfCheckedKeys()
      ].join();
      let res = await this.$http({
        url: `roles/${this.curRoleId}/rights`,
        method: "post",
        data: {
          rids: this.rids
        }
      });
      this.isAssignRolesList = false;
      this.getRolesList();

      this.$message({
        type: "success",
        message: res.data.meta.msg,
        duration: 1000
      });
    },
    async delRoles(id) {
      try {
        await this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });

        let res = await this.$http({
          url: `roles/${id}`,
          method: "delete"
        });
        if (res.data.meta !== 200) {
          this.$message({
            type: "error",
            message: res.data.meta.msg,
            duration: 1000
          });
        }
        this.$message({
          type: "success",
          message: res.data.meta.msg,
          duration: 1000
        });
        this.getRolesList();
      } catch (error) {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      }
    }
  }
};
</script>

<style>
.el-tag {
  margin: 5px 15px;
}
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
