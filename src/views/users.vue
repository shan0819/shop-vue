<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row :gutter="20">
      <el-col :span="8">
        <!-- 搜索框 -->
        <el-input
          v-model="query"
          placeholder="请输入内容"
          class="input-with-select"
          @keyup.enter.native="getUserList"
        >
          <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
        </el-input>
      </el-col>
      <el-col :span="6">
        <el-button type="success" plain @click="addUserFormDialog = true">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 用户列表 -->
    <el-table :data="userList" stripe style="width: 100%">
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="用户状态">
        <template v-slot="{row}">
          <el-switch
            active-color="#13ce66"
            inactive-color="#ff4949"
            v-model="row.mg_state"
            @change="changstate(row.mg_state,row.id)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="{row}">
          <el-button type="primary" icon="el-icon-edit" size="mini" plain @click="editUser(row.id)"></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            plain
            @click="deleteUser(row.id)"
          ></el-button>
          <el-button
            type="success"
            icon="el-icon-check"
            size="mini"
            plain
            @click="assignRole(row)"
          >分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <!-- page-size:显示条数 -->
    <!-- current-page:当前页 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pagesize"
      :current-page="currentpage"
      @current-change="changpage"
    ></el-pagination>

    <!-- 添加用户对话框  -->
    <el-dialog title="添加用户" :visible.sync="addUserFormDialog" @close="close">
      <el-form
        :model="addUserForm"
        :rules="rules"
        ref="addUserForm"
        class="demo-ruleForm"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addUserForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addUserFormDialog = false">取消</el-button>
        <el-button type="primary" @click="addUser(addUserForm)">确定</el-button>
      </div>
    </el-dialog>

    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户" :visible.sync="editformdialog">
      <el-form :model="editform" :rules="rules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-tag type="info" v-text="editform.username"></el-tag>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editform.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editform.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editformdialog = false">取 消</el-button>
        <el-button type="primary" @click="updateUser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="assignRoledialog">
      <el-form :model="assignRoleForm" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-tag type="info" v-text="assignRoleForm.username"></el-tag>
        </el-form-item>
        <el-select v-model="assignRoleForm.rid" placeholder="请选择">
          <el-option
            v-for="item in roleList"
            :key="item.id"
            :value="item.id"
            :label="item.roleName"
          ></el-option>
        </el-select>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="assignRoledialog = false">取 消</el-button>
        <el-button type="primary" @click="updaterole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      userList: [],
      total: 1,
      pagesize: 3,
      currentpage: 1,
      query: "",
      addUserForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      addUserFormDialog: false,
      editform: {
        id: "",
        username: "",
        email: "",
        mobile: ""
      },
      editformdialog: false,
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 5,
            max: 12,
            message: "用户名长度必须在 5 到 12 个字符",
            trigger: "change"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 18,
            message: "密码长度必须在 5 到 12 个字符",
            trigger: "change"
          }
        ],
        email: [
          {
            pattern: /^([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/,
            message: "邮箱格式不正确",
            trigger: "change"
          }
        ],
        mobile: [
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: "电话格式不正确",
            trigger: "change"
          }
        ]
      },
      assignRoleForm: {
        username: "",
        rid: "",
        id: ""
      },
      roleList: {},
      assignRoledialog: false
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    // 获取用户列表
    async getUserList() {
      let {
        data: { data, meta }
      } = await this.$http({
        url: "users",
        params: {
          query: this.query,
          pagenum: this.currentpage,
          pagesize: this.pagesize
        }
      });
      if (meta.status === 200) {
        this.total = data.total;
        this.userList = data.users;
      }
    },
    // 分页
    changpage(page) {
      this.currentpage = page;
      this.getUserList();
    },
    // 添加用户
    async addUser() {
      // 先验证表单
      await this.$refs.addUserForm.validate();
      this.$http({
        url: "users",
        method: "post",
        data: this.addUserForm
      }).then(res => {
        if (res.data.meta.status === 201) {
          // 关闭对话框
          this.addUserFormDialog = false;
          // 提示
          this.$message({
            type: "success",
            message: res.data.meta.msg,
            duration: 1000
          });
          // 重新渲染
          this.getUserList();
        } else {
          this.$message({
            type: "error",
            message: res.data.meta.msg,
            duration: 1000
          });
        }
      });
    },
    // 关闭添加用户对话框
    close() {
      this.$refs.addUserForm.resetFields();
    },
    // 设置用户状态
    async changstate(state, id) {
      try {
        let res = await this.$http({
          url: `users/${id}/state/${state}`,
          method: "put"
        });
        if (res.data.meta.status === 200) {
          this.$message({
            message: res.data.meta.msg,
            type: "success",
            duration: 1000
          });
          this.getUserList();
        }
      } catch (error) {
        this.$message({
          message: "用户状态设置失败，请重新设置",
          type: "error",
          duration: 1000
        });
      }
    },
    // 删除用户
    async deleteUser(id) {
      try {
        await this.$confirm("您是否确定删除此用户?", "温馨提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        let res = await this.$http({
          url: `users/${id}`,
          method: "delete"
        });
        if (res.data.meta.status === 200) {
          this.$message({
            type: "success",
            message: res.data.meta.msg,
            duration: 1000
          });
          this.currentpage = 1;
          this.getUserList();
        }
      } catch (e) {
        this.$message({
          type: "error",
          message: "失败",
          duration: 1000
        });
      }
    },
    // 修改用户信息
    async editUser(id) {
      this.editformdialog = true;
      let {
        data: { data, meta }
      } = await this.$http({
        url: `users/${id}`,
        method: "get"
      });
      if (meta.status === 200) {
        this.editform.id = data.id;
        this.editform.username = data.username;
        this.editform.email = data.email;
        this.editform.mobile = data.mobile;
      }
    },

    async updateUser() {
      this.editformdialog = false;
      try {
        let res = await this.$http({
          url: `users/${this.editform.id}`,
          method: "put",
          data: {
            email: this.editform.email,
            mobile: this.editform.mobile
          }
        });
        if (res.data.meta.status === 200) {
          this.$message({
            message: res.data.meta.msg,
            type: "success",
            duration: 1000
          });
          this.getUserList();
        }
      } catch (error) {
        this.$message({
          message: "操作失败",
          type: "error",
          duration: 1000
        });
      }
    },
    // 分配角色
    async assignRole(row) {
      this.assignRoledialog = true;

      let res = await this.$http({
        url: "roles"
      });
      this.roleList = res.data.data;
      const role = this.roleList.find(item => item.roleName === row.role_name);
      const rid = role ? role.id : "";
      this.assignRoleForm.username = row.username;
      this.assignRoleForm.id = row.id;
      this.assignRoleForm.rid = rid;
    },
    // async changerid(value) {
    //   this.assignRoleForm.rid = value;

    // },
    async updaterole() {
      this.assignRoledialog = false;
      await this.$http({
        url: `users/${this.assignRoleForm.id}/role`,
        method: "put",
        data: {
          rid: this.assignRoleForm.rid
        }
      });
      this.getUserList();
    }
  }
};
</script>

<style>
.el-breadcrumb {
  height: 50px;
  line-height: 50px;
  background-color: #d4dae0;
  padding-left: 15px;
  font-size: 16px;
}
.el-row {
  background-color: transparent;
}
</style>
