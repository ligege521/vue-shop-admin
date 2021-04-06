<template>
  <div> 
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
         <el-card class="box-card">
             <!-- 提示区域 -->
              <el-alert title="注意:只允许为第三级分类设置相关参数" 
                :closable="false" type="warning"
                show-icon
            ></el-alert>

            <!-- 选择商品区域 -->
            <el-row class="cat_opt">
                <el-col>
                    <span>选择商品分类：</span>
                    <el-cascader
                        v-model="selectedCateKeys"
                        :options="cateList"
                        :props="props"
                        placeholder="下拉进行选择"
                        props.multiple = "false"
                        @change="handleChange"
                    ></el-cascader>
                </el-col>
            </el-row>

            <!-- tab 选择区域  -->
            <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="动态参数" name="many">
                <el-button type="primary" :disabled="isBtnDistabled" @click="addDialogVisible = true">添加参数</el-button>
                <!-- 动态参数的表格 -->
                <el-table :data="manyTableData" border stripe>
                    <el-table-column type="expand">
                        <template v-slot="scope">
                            <el-tag v-for="(item, index) in scope.row.attr_vals" 
                                :key="index" closable   @close="handleClose(index, scope.row)"
                            >
                                {{item}}
                            </el-tag>
                             <el-input
                                class="input-new-tag"
                                v-if="scope.row.inputVisible"
                                v-model="scope.row.inputValue"
                                ref="saveTagInput"
                                size="small"
                                @blur="handleInputConfirm(scope.row)"
                                @keyup.enter.native="$event.target.blur"
                            >
                            </el-input>
                            <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column type="index" label="序列"></el-table-column>
                    <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                    <el-table-column label="操作">
                        <template v-slot="scope">
                            <el-button type="primary" icon="el-icon-edit" size="mini" @click="shoEditDialog(scope.row.attr_id)">编辑</el-button>
                            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeAttr(scope.row.attr_id)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="静态属性" name="only">
                <el-button type="primary" :disabled="isBtnDistabled" @click="addDialogVisible = true">添加属性</el-button>
                <!-- 静态属性的表格 -->
                <el-table :data="onlyTableData" border stripe>
                    <el-table-column type="expand">
                        <template v-slot="scope">
                            <el-tag v-for="(item, index) in scope.row.attr_vals" 
                                :key="index" closable @close="handleClose(index, scope.row)"
                            >
                                {{item}}
                            </el-tag>
                            <el-input
                                class="input-new-tag"
                                v-if="scope.row.inputVisible"
                                v-model="scope.row.inputValue"
                                ref="saveTagInput"
                                size="small"
                                @blur="handleInputConfirm(scope.row)"
                                @keyup.enter.native="$event.target.blur"
                            >
                            </el-input>
                            <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column type="index" label="序列"></el-table-column>
                    <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                    <el-table-column label="操作">
                        <template v-slot="scope">
                            <el-button type="primary" icon="el-icon-edit" size="mini" @click="shoEditDialog(scope.row.attr_id)">编辑</el-button>
                            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeAttr(scope.row.attr_id)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            </el-tabs>
         </el-card>

         <!-- 添加的对话框 -->
        <el-dialog
        :title="'添加' + titleText"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogClosed"
        >
            <el-form :model="addForm" 
                ref="addFormRef"  :rules="addFormRules"
                label-width="100px"
                status-icon
            >
                <el-form-item :label="titleText + '名称'" prop="attr_name">
                    <el-input v-model="addForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="addDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addParams">确 定</el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 修改的对话框 -->
        <el-dialog
        :title="'修改' + titleText"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClosed"
        >
            <el-form :model="editForm" 
                ref="editFormRef"  :rules="editFormRules"
                label-width="100px"
                status-icon
            >
                <el-form-item :label="titleText + '名称'" prop="attr_name">
                    <el-input v-model="editForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="editParams">确 定</el-button>
                </span>
            </template>
        </el-dialog>
  </div>
</template>
 
<script>
   export default {
       data() {
           return {
                cateList: [],
                // 级联选择框双向绑定的数组
                selectedCateKeys: [],
                props: {
                        value: 'cat_id',
                        label: 'cat_name',
                        children: 'children',
                        expandTrigger: 'hover',
                },
                //   tabs 的 选中id
                activeName: 'many',
                // 动态参数的数据
                manyTableData: [],
                // 静态属性的数据
                onlyTableData: [],
                // 添加框的显示
                addDialogVisible: false,
                // 添加参数对象
                addForm: {
                    attr_name: ''
                },
                addFormRules: {
                    attr_name: [{ required: true, message: '请输入参数', trigger: 'blur' }],
                },
                // 修改弹框的显示
                editDialogVisible: false,
                editForm: {
                    attr_name: ''
                },
                editFormRules: {
                    attr_name: [{ required: true, message: '请输入参数', trigger: 'blur' }],
                },
           }
       },
       created () {
           this.getCateList();
       },
       computed: {
           // 选中是否为三级选择
           isBtnDistabled () {
                if (this.selectedCateKeys.length !== 3) {
                    return true;
                }
                return false;
           },
           cateId () {
               if (this.selectedCateKeys.length === 3) {
                    return this.selectedCateKeys[2];
                }
                return null;
           },
           //弹出框的标题
           titleText () {
               if (this.activeName === 'many') {
                    return '参数'
                } else {
                     return '属性'
                }
           }
       },
       methods: {
           // 获取商品列表
            async getCateList () {
                let {data: res} = await this.$http.get('categories');
                if (res.meta.status !== 200) return this.$message.error('获取列表失败');
                this.cateList = res.data;
            },
            // 级联选择框变化
            async handleChange () {
                if (this.selectedCateKeys.length !== 3) {
                    this.selectedCateKeys = [];
                    this.manyTableData = [];
                    this.onlyTableData = [];
                    return;
                }
                this.getParams();
            },

            // 根据选取id获列表
            async getParams() {
                let {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`, {
                    params: {sel: this.activeName}
                });
                if (res.meta.status !== 200) return this.$message.error('获取参数失败');
                res.data.forEach(item => {
                    let attrVals = item.attr_vals ? item.attr_vals.split(' ') : [];
                    item.attr_vals = attrVals;
                    item.inputVisible = false;
                    item.inputValue = '';
                })
                
                if (this.activeName === 'many') {
                    this.manyTableData = res.data
                } else {
                    this.onlyTableData = res.data
                }
            },  
            // tabs 变化触发
            handleClick () {
                this.getParams();
            },
            // 表单关闭
            addDialogClosed () {
                this.$refs.addFormRef.resetFields();
            },
            // 添加参数
            addParams () {
                this.$refs.addFormRef.validate(async (valid) => {
                    if (!valid) return
                    let {data: res} = await this.$http.post(`categories/${this.cateId}/attributes`, {
                        attr_name: this.addForm.attr_name,
                        attr_sel: this.activeName,
                    })
                    if (res.meta.status !== 201) return this.$message.error('添加失败');
                    this.$message.success('添加成功');
                    this.getParams();
                    this.addDialogVisible = false;
                })
            },

            // 显示修改
            async shoEditDialog (attr_id) {
                this.editDialogVisible = true;
                let {data: res} = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`, {
                    params: {
                        attr_sel: this.activeName
                    }
                })
                if (res.meta.status !== 200) return this.$message.error('获取参数信息失败')
                this.editForm = res.data
            },
            // 确定修改
            editParams () {
                this.$refs.editFormRef.validate(async valid => {
                    if (!valid) return;
                    let {data: res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
                        attr_name: this.editForm.attr_name,
                        attr_sel: this.activeName
                    });
                    console.log(res)
                    if (res.meta.status !== 200) return this.$message.error('修改参数信息失败')
                    this.$message.success('修改参数信息成功');
                    this.getParams();
                    this.editDialogVisible = false;
                })
            },
            // 关闭修改弹框
            editDialogClosed () {
                this.$refs.editFormRef.resetFields();
            },

            // 删除
            async removeAttr(attr_id) {
                let confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err);
                if (confirmResult !== 'confirm') return this.$message.info('您取消了删除')
                let {data: res} = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
                if (res.meta.status !== 200) return this.$message.error('删除失败');
                this.$message.success('删除成功');
                this.getParams();
            },
            // 标签输入框事件
            async handleInputConfirm (row, $event) {
                console.log($event)
                row.inputVisible = false;
                if (row.inputValue.trim().length === 0) {
                    row.inputValue = '';
                    return;
                }
                row.attr_vals.push(row.inputValue.trim());
                this.saveAttrVals(row);
            },
            // 保存标签的修改，发送请求
            async saveAttrVals (row) {
                // 发起请求，数据同步
                let {data: res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
                    attr_name: row.attr_name,
                    attr_sel: this.activeName,
                    attr_vals: row.attr_vals.join(' ')
                });
                if (res.meta.status !== 200) return this.$message.error(`${res.meta.msg}`);
                this.$message.success('修改参数成功');
                row.inputValue = '';
            },
            // 显示标签输入框
            showInput (row) {
                row.inputVisible = true;
                this.$nextTick(() => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },
            // 删除标签
            handleClose (index, row) {
                row.attr_vals.splice(index, 1);
                this.saveAttrVals(row);
            }
       },
       
   }
</script>
 
 
<style lang="less" scoped>
    .cat_opt{
        margin-top: 15px;
        margin-left: 15px;
    }
    .el-table{
        margin-top: 15px;
    }
    .el-tag{
        margin-right: 15px;
    }
    .input-new-tag {
        width: 150px;
    }
</style>