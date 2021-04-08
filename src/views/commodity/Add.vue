<template>
  <div> 
        <!-- 面包屑导航 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <el-row>
                <el-alert
                    title="添加商品信息" type="info"
                    center show-icon
                    :closable="false"
                    >
                </el-alert>
            </el-row>

            <!-- 步骤条区域 -->
            <el-steps :active="activeIndex * 1" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>

            <!-- tab栏区域 -->
            <el-form :model="addForm" 
                :rules="addFormRules" ref="addFormRef" 
                label-width="200px" label-position="left"
            >
                <el-tabs v-model="activeIndex" tab-position="left" 
                    :before-leave="beforeTabLeave" @tab-click="tabClick"
                >
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name" class="fileImport">
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price" class="fileImport">
                            <el-input v-model="addForm.goods_price" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight" class="fileImport">
                            <el-input v-model="addForm.goods_weight" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number" class="fileImport">
                            <el-input v-model="addForm.goods_number" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="goods_cat" class="fileImport">
                             <el-cascader
                                v-model="addForm.goods_cat"
                                :options="cateList" :props="cateProps"
                                expand-trigger="hover"
                                @change="handleChange"
                            ></el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">
                        <el-form-item :label="item.attr_name"
                            prop="goods_number" v-for="item in manyTableData" :key="item.attr_id"
                        >
                             <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox :label="item" border 
                                    v-for="(item, index) in item.attr_vals" :key="index"
                                ></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item :label="item.attr_name"  class="fileImport"
                            prop="goods_number" v-for="item in onlyTableData" :key="item.attr_id"
                        >
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <!-- 上传图片 -->
                        <el-upload
                            :action="upLoadUrl"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            list-type="picture"
                            :headers="headerObj"
                            :on-success="handleSuccess"
                        >
                            <el-button size="small" type="primary">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                        <!-- 富文本编辑器 -->
                        <quill-editor v-model="addForm.goods_introduce">

                        </quill-editor>
                        <!-- 添加商品按钮 -->
                        <el-button type="primary" 
                            style="margin-top: 15px" @click="add"
                        >添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>

        <!-- 图片预览弹框 -->
        <!-- <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
            <img :src="previewPath" alt="" class="preViewImg">
        </el-dialog> -->
  </div>
</template>
 
<script>
   export default {
       data() {
           return {
               // 步骤 id   
               activeIndex: '0',
               // 表单信息
               addForm: {
                    goods_name: '',
                    goods_price: 0,
                    goods_weight: 0,
                    goods_number: 0,
                    goods_cat: [],
                    pics: [],
                    goods_introduce: '',
               },
               addFormRules: {
                   goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
                   goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
                   goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
                   goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
                   goods_cat: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],

               },
               // 商品分类列表
               cateList: [],
               cateProps: {
                   label: 'cat_name',
                   value: 'cat_id',
                   children: 'children'
               },
               manyTableData: [],
               onlyTableData: [],
               // 上传图片地址
               upLoadUrl: 'http://www.ysqorz.top:8888/api/private/v1/upload',
               // 图片上传，请求头对象
               headerObj: {
                   Authorization: window.sessionStorage.getItem('token')
               },
               // 预览图片路径
               previewPath: '',
               previewVisible: false
           }
       },
       created () {
           this.getCateList();
       },
       computed: {
           cateId () {
               if (this.addForm.goods_cat.length === 3) {
                   return this.addForm.goods_cat[2];
               }
               return null
           }
       },
       methods: {
           // 获取商品列表
           async getCateList () {
               let {data: res} = await this.$http.get(`categories`);
               if (res.meta.status !== 200) return this.$message.error('获取商品分类数据失败');
               this.cateList = res.data;
           },
           // 级联选择器变化
           handleChange () {
               console.log(this.addForm.goods_cat)
               if (this.addForm.goods_cat.length !== 3) {
                   this.addForm.goods_cat = [];
               }
           },
           // tab点击 守卫
           beforeTabLeave (activeName, oldActiveName) {
               console.log(activeName, oldActiveName)
               if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
                   this.$message.error('请先选择商品分类')
                   return false;
               }
           },
           // tabs 切换
           async tabClick () {
               if (this.activeIndex === '1') {
                    let {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`, {
                        params: {
                            sel: 'many'
                        }
                    });
                    if (res.meta.status !== 200) return this.$message.error(`${res.meta.msg}`)
                    res.data.forEach(item => {
                        item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
                    });
                    this.manyTableData = res.data; 
               } else if (this.activeIndex === '2') {
                   let {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`, {
                        params: {
                            sel: 'only'
                        }
                    });
                    if (res.meta.status !== 200) return this.$message.error(`${res.meta.msg}`)
                    this.onlyTableData = res.data; 
               }
           },
           // 图片预览
           handlePreview () {
            //    let path = file.response.data.url;
            //    let replacePath = path.replace('127.0.0.1', 'www.ysqorz.top:8888/api/private/v1/');
            //    this.previewPath = replacePath
            //    this.previewVisible = true;
           },
           // 图片上传成 
           handleSuccess (response) {
               const picInfo = {pic: response.data.tmp_path}
               this.addForm.pics.push(picInfo);
           },
           // 移除图片
           handleRemove (file) {
               const filePath = file.response.data.tmp_path;
               const i = this.addForm.pics.findIndex(x => {
                   x.pic === filePath
               })
               this.addForm.pics.splice(i, 1);
           },

           // 添加商品
           async add () {
               this.$refs.addFormRef.validate(async valid => {
                   if (!valid) return this.$message.error('请填写必填项');
                   // 通过表单验证后，进行添加
               })
               // 数据深拷贝
               let colneData = this.deepClone(this.addForm)
               colneData.goods_cat = colneData.goods_cat.join(',')
               // 动态参数
               this.addForm.attrs = [];
               this.manyTableData.forEach(item => {
                   const newInfo = {
                       attr_id: item.attr_id,
                       attr_value: item.attr_vals.join(',')
                   }
                   this.addForm.attrs.push(newInfo)
               })
               // 静态处理
               this.onlyTableData.forEach(item => {
                   const newInfo = {
                       attr_id: item.attr_id,
                       attr_value: item.attr_vals
                   }
                   this.addForm.attrs.push(newInfo)
               })
               colneData.attrs = this.addForm.attrs;
               //发起添加请求
               let {data: res} = await this.$http.post('goods', colneData);
               if (res.meta.status !== 201) return this.$message.error('添加商品失败');
               this.$message.success('添加成功')
               this.$router.push('/goods')
           },

           // 深拷贝
           deepClone (target) {
               if (typeof target !== 'object') return target;
               let result = null;
               if (target instanceof Object) result = {};
               if (target instanceof Array) result = [];
               for (let item in target) {
                   result[item] = this.deepClone(target[item])
               }
               return result;
           }
       }
   }
</script>
 
 
<style lang="less" scoped>
    .el-steps{
        padding: 15px 0;
    }
    .el-step__title{
        font-size: 14px !important;
    }
    .el-checkbox{
        margin: 0 20px 0 0 !important;
    }
    .el-form-item__content {
        margin: 0  !important;
    }
    .preViewImg{
        width: 100%;
    }
</style>
<style lang="less">
    .fileImport .el-form-item__content {
        margin: 0  !important;
    }
</style>