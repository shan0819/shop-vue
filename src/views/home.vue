<template>
  <el-container>
    <el-header>
      <el-row type="flex" class="row-bg" justify="space-between" align="middle">
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <div class="block">
              <el-image :src="src"></el-image>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple-light tac">
            <h1>电商后台管理系统</h1>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple home-header-rignt">
            欢迎上海前端39期星曜会员
            <template>
              <el-button type="text" @click="logout" class="logout">退出</el-button>
            </template>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu
          :unique-opened="true"
          :default-active="$route.path"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          :router="true"
        >
          <el-submenu v-for="item in menus" :key="item.id" :index="item.path">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item :index="item.path" v-for="v in item.children" :key="v.id">
              <i class="el-icon-menu"></i>
              <span>{{v.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      src: "http://www.itheima.com/images/logo.png",
      menus: []
    };
  },
  created() {
    axios({
      url: "http://localhost:8888/api/private/v1/menus",
      method: "get",
      headers: { Authorization: localStorage.getItem("token") }
    }).then(({ data: { data, meta } }) => {
      console.log(data);
      if (meta.status === 200) {
        this.menus = data;
      }
    });
  },
  methods: {
    logout() {
      this.$confirm("您是否确定要退出?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "退出成功!"
          });
          localStorage.removeItem("token");
          this.$router.push("/login");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消退出"
          });
        });
    }
  }
};
</script>

<style lang="less">
.el-container {
  height: 100%;
  background-color: #eaeef1;
  .el-header {
    background-color: #b3c1cd;
    padding-left: 0;
    img {
      width: 200px;
    }
    .el-row {
      background-color: #b3c1cd;
    }
    .el-col.el-col-12 {
      text-align: center;
      color: #fff;
      h1 {
        margin: 0;
      }
    }
    .home-header-rignt {
      min-width: 300px;
      .logout {
        padding: 0;
        color: #daa520;
        font-size: 20px;
        font-weight: 700;
        text-decoration: none;
      }
    }
  }
}
.el-menu {
  height: 100%;
}
</style>

