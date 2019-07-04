<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加分类按钮 -->
    <el-button type="success" plain @click="addCategoryDialog">添加分类</el-button>
    <!-- 分类列表 -->
    <el-table :data="categoryList" stripe style="width: 100%">
      <el-table-tree-column
        folder-icon="el-icon-folder"
        tree-key="cat_id"
        level-key="cat_level"
        :indent-size="20"
        parentKey="cat_pid"
        prop="cat_name"
        label="分类名称"
      ></el-table-tree-column>

      <el-table-column label="是否有效" width="180">{{categoryList.cat_deleted ? '否':'是'}}</el-table-column>
      <el-table-column prop="cat_level" label="层级"></el-table-column>

      <el-table-column label="操作">
        <el-button type="primary" icon="el-icon-edit" size="mini" plain></el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini" plain></el-button>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :current-page="currentpage"
      @current-change="changecurrent"
    ></el-pagination>

    <!-- 添加分类对话框 -->
    <el-dialog title="收货地址" :visible.sync="showAddCategoryDialog">
      <el-form :model="addCategoryForm" res="addCategoryForm" label-width="100px">
        <el-form-item label="分类名称">
          <el-input v-model="addCategoryForm.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="父级名称">
          <el-cascader
            v-model="addCategoryForm.cat_pid"
            :options="addCategory"
            :props="defaultProps"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showAddCategoryDialog = false">取 消</el-button>
        <el-button type="primary" @click="updateCatgory">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import ElTreeGrid from "element-tree-grid";
export default {
  components: {
    [ElTreeGrid.name]: ElTreeGrid
  },
  data() {
    return {
      categoryList: [],
      total: 0,
      currentpage: 1,
      pagesize: 5,
      showAddCategoryDialog: false,
      addCategoryForm: {
        cat_name: "",
        cat_pid: []
      },
      addCategory: [],
      defaultProps: {
        value: "cat_id",
        label: "cat_name",
        checkStrictly: true
      }
    };
  },
  created() {
    this.getCategoryList();
  },
  methods: {
    async getCategoryList() {
      let res = await this.$http({
        url: "categories",
        params: {
          type: 3,
          pagenum: this.currentpage,
          pagesize: this.pagesize
        }
      });
      this.total = res.data.data.total;
      this.categoryList = res.data.data.result;
    },
    changecurrent(value) {
      this.currentpage = value;
      this.getCategoryList();
    },
    async addCategoryDialog() {
      this.showAddCategoryDialog = true;
      let res = await this.$http({
        url: "categories",
        params: {
          type: 2
        }
      });
      this.addCategory = res.data.data;
    },
    async updateCatgory() {
      this.showAddCategoryDialog = false;
      // console.log(this.addCategoryForm);
      const cat_level = this.addCategoryForm.cat_pid.length;
      const cat_pid = this.addCategoryForm.cat_pid.pop();
      const res = await this.$http({
        url: "categories",
        method: "post",
        data: {
          cat_pid,
          cat_level,
          cat_name: this.addCategoryForm.cat_name
        }
      });
      console.log(res);
      if (res.data.meta.status !== 201) {
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
      this.$refs.addCategoryForm.resetFields();
      this.getCategoryList();
    }
  }
};
</script>

<style scoped>
.el-breadcrumb {
  margin-bottom: 15px;
}
</style>
