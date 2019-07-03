<template>
  <div>
    <el-button type="success" plain>添加商品</el-button>
    <!-- 商品列表 -->
    <el-table :data="productList" stripe style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称" width="180"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格" width="180"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
      <el-table-column prop="add_time" label="创建时间"></el-table-column>
      <el-table-column label="操作">
        <template v-slot="{row}">
          <el-button type="primary" icon="el-icon-edit" size="mini" plain></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" plain></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :current-page="currentpage"
      @current-change="changecurrent"
    ></el-pagination>
  </div>
</template>
<script>
export default {
  data() {
    return {
      productList: [],
      pagenum: 1,
      currentpage: 1,
      pagesize: 5,
      total: 0
    };
  },
  created() {
    this.getProductList();
  },

  methods: {
    async getProductList() {
      let res = await this.$http({
        url: "goods",
        params: {
          pagenum: this.currentpage,
          pagesize: this.pagesize
        }
      });
      // console.log(res);

      this.total = res.data.data.total;
      this.productList = res.data.data.goods;
    },
    changecurrent(page) {
      this.currentpage = page;
      this.getProductList();
    }
  }
};
</script>

