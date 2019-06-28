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
        <el-row class="tac">
          <el-col :span="24">
            <el-menu
              default-active="2"
              @open="handleOpen"
              @close="handleClose"
              background-color="#545c64"
              text-color="#fff"
              active-text-color="#ffd04b"
            >
              <el-submenu index="1">
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>导航一</span>
                </template>
                <el-menu-item index="1-1">
                  <i class="el-icon-menu"></i>
                  选项1
                </el-menu-item>
              </el-submenu>
            </el-menu>
          </el-col>
        </el-row>
      </el-aside>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>
<script>
import Axios from "axios";
export default {
  data() {
    return {
      src: "http://www.itheima.com/images/logo.png",
      menus: []
    };
  },
  created() {
    this.getMenus();
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
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
    },
    getMenus() {
      this.$http.get("http://localhost:8888/api/private/v1/menus").then(
        res => {
          console.log(res);
        }
        // response => {
        //   // error callback
        // }
      );
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

.el-col.el-col-24 {
  height: 100%;
  .el-menu {
    height: 100%;
  }
}
</style>

