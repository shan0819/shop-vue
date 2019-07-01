<template>
  <el-container>
    <el-header>
      <el-row type="flex" class="row-bg" justify="space-between" align="middle">
        <el-col :span="6">
          <img src="../assets/logo.png" alt />
        </el-col>
        <el-col>
          <h1>电商后台管理系统</h1>
        </el-col>
        <el-col :span="6">
          <div class="logout">
            <span>欢迎上海前端31期星曜会员</span>
            <a href="javascript:;" @click="logout">退出</a>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu
          :default-active="$route.path"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          :unique-opened="true"
          :router="true"
        >
          <el-submenu v-for="item in menusList" :key="item.id" :index="'/'+item.path">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item.authName}}</span>
            </template>

            <el-menu-item v-for="v in item.children" :key="v.id" :index="'/'+v.path">
              <i class="el-icon-menu"></i>
              <span>{{v.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return { menusList: [] };
  },
  async created() {
    let {
      data: { data, meta }
    } = await this.$http("menus");
    if (meta.status === 200) {
      this.menusList = data;
    }
  },
  methods: {
    async logout() {
      try {
        await this.$confirm("您是否确定退出?", "温馨提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        this.$message({
          type: "success",
          message: "退出成功!",
          duration: 1000
        });
        this.$router.push("/login");
        localStorage.removeItem("token");
      } catch (e) {
        this.$message({
          type: "info",
          message: "已取消退出",
          duration: 1000
        });
      }
    }
  }
};
</script>

<style>
.el-container {
  height: 100%;
  background-color: #eaeef1;
}
.el-header,
.el-row {
  background-color: #b3c1cd;
  padding-left: 0;
}
img {
  width: 200px;
}
h1 {
  margin: 0;
  color: #fff;
  font-size: 28px;
  text-align: center;
}
.logout {
  min-width: 200px;
  font-weight: 700;
  font-size: 18px;
}
a,
a:hover {
  margin-left: 10px;
  text-decoration: none;
  font-weight: 700;
  color: orange;
}
.el-menu {
  height: 100%;
}
</style>

