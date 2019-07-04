<template>
  <div>
    <!-- 步骤条 -->
    <el-steps :active="active" finish-status="success">
      <el-step title="步骤 1" description="基本信息"></el-step>
      <el-step title="步骤 2" description="商品图片"></el-step>
      <el-step title="步骤 3" description="商品内容"></el-step>
    </el-steps>

    <!-- tab栏 -->
    <el-tabs tab-position="left" style="margin-top: 20px;" @tab-click="tabClick" :value="name">
      <el-tab-pane label="用户管理" name="first">
        <el-form ref="addGoodsForm" :model="addGoodsForm" label-width="80px">
          <el-form-item label="商品名称">
            <el-input v-model="addGoodsForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="addGoodsForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="addGoodsForm.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="addGoodsForm.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader
              v-model="addGoodsForm.goods_cat"
              :options="categoryList"
              :props="defaultProps"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="是否促销">
            <el-radio v-model="addGoodsForm.radio" label="0">是</el-radio>
            <el-radio v-model="addGoodsForm.radio" label="1">否</el-radio>
          </el-form-item>
        </el-form>
        <el-button @click="next(1,'second')">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="配置管理" name="second">
        <el-upload
          class="upload-demo"
          :headers="headers"
          action="http://localhost:8888/api/private/v1/upload"
          list-type="picture-card"
          :on-success="uploadPic"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
        <el-button @click="next(2,'third')">下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="角色管理" name="third">
        <div>
          <quill-editor v-model="addGoodsForm.goods_introduce" ref="myQuillEditor"></quill-editor>
        </div>
        <el-button @click="makeSure">确定</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";
export default {
  components: {
    quillEditor
  },
  data() {
    return {
      active: 0,
      name: "first",
      addGoodsForm: {
        goods_name: "",
        goods_cat: [],
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        goods_introduce: "",
        pics: {
          tmp_path: ""
        },
        radio: "1"
      },

      categoryList: [],
      defaultProps: {
        value: "cat_pid",
        label: "cat_name"
      },

      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjUwMCwicmlkIjowLCJpYXQiOjE1NjIyMzA3NDMsImV4cCI6MTU2MjMxNzE0M30.DwKp-8QzOxXQTODoHg7hFhaXziXGemEU-XPm7-dT7xg"
      }
    };
  },
  async created() {
    let res = await this.$http({
      url: "categories",
      params: {
        type: 3
      }
    });
    this.categoryList = res.data.data;
  },
  methods: {
    tabClick(value) {
      // console.log(value);
      this.active = +value.index;
    },
    next(value, name) {
      this.active = value;
      this.name = name;
    },
    // 上传图片
    uploadPic(res) {
      this.addGoodsForm.pics.tmp_path = res.data.tmp_path;
    },
    async makeSure() {
      this.addGoodsForm.goods_cat = this.addGoodsForm.goods_cat.join();
      let res = await this.$http({
        url: "goods",
        method: "post",
        data: this.addGoodsForm
      });
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
      this.$router.push("/goods");
    }
  }
};
</script>
<style>
.quill-editor {
  height: 300px;
}
.ql-container.ql-snow {
  height: 200px;
}
</style>
