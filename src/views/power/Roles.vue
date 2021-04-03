<template>
  <div> 
      <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
        <el-row>
            <el-col>
                <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
            </el-col>
        </el-row>
    </el-card>
    <!-- 角色列表 -->
    <el-table :data="rolesList" border stripe >
        <!-- 展开列 -->
        <el-table-column type="expand">
            <template v-slot="scope">
                <el-row :class="['bd-bottom', i1 === 0 ? 'bdtop' : '', 'flxcter']"  v-for="(item1, i1) in scope.row.children" :key="item1.id">
                    <!-- 一级权限 -->
                    <el-col :span="5">
                        <el-tag 
                            closable @close="removeRightById(scope.row, item1.id)"
                        >{{item1.authName}}</el-tag>
                        <el-icon class="el-icon-caret-right"></el-icon>
                    </el-col>
                    <!-- 二级权限 -->
                    <el-col :span="19">
                        <el-row :class="[i2 === 0 ? '' : 'bdtop', 'flxcter' ]" v-for="(item2, i2) in item1.children" :key="item2.id">
                            <el-col :span="6">
                                <el-tag type="success"
                                    closable @close="removeRightById(scope.row, item2.id)"
                                >{{item2.authName}}</el-tag>
                                <el-icon class="el-icon-caret-right"></el-icon>
                            </el-col>
                            <!-- 三级权限 -->
                            <el-col :span="18" class="wrapCol">
                                <el-row :class="[i3 === 0 ? '' : 'bdtop' ]" v-for="(item3, i3) in item2.children" :key="item3.id">
                                    <el-tag type="warning"
                                       closable @close="removeRightById(scope.row, item3.id)"
                                    >{{item3.authName}}</el-tag>
                                </el-row>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <!-- <pre>{{scope}}</pre> -->
            </template>
        </el-table-column>
        <el-table-column type="index" label="序列"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
            <template v-slot="scope">
                <el-button size="mini" type="primary" 
                    icon="el-icon-edit" @click="showEditDialog(scope.row.id)"
                >编辑</el-button>
                <el-button size="mini" type="danger" 
                    icon="el-icon-delete" @click="removeEditDialog(scope.row.id)"
                >删除</el-button>
                <el-button size="mini" type="warning" 
                    icon="el-icon-setting" @click="showSetRightDialog(scope.row)"
                >分配权限</el-button>
            </template>
        </el-table-column>
    </el-table>

    <!-- 添加角色的对话框 -->
    <el-dialog
       title="添加角色"
       :visible.sync="addDialogVisible"
       width="50%"
       @close="addDialogClosed"
    >
      <el-form :model="addForm" 
          :rules="addFormRules" ref="addFormRef" 
          label-width="100px"
          status-icon
       >
          <el-form-item label="角色" prop="roleName">
             <el-input v-model="addForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
             <el-input v-model="addForm.roleDesc"></el-input>
          </el-form-item>
       </el-form>
       <template #footer>
          <span class="dialog-footer">
             <el-button @click="addDialogVisible = false">取 消</el-button>
             <el-button type="primary" @click="addConfrim">确 定</el-button>
          </span>
       </template>
    </el-dialog>

    <!-- 分配权限的对话框 -->
    <el-dialog
       title="编辑权限"
       :visible.sync="setRightDialogVisible"
       width="50%"
       @close="setRightDialogColsed"
    >
        <el-tree :data="rightsList" ref="treeRef"
            :props="treeProps" show-checkbox
            node-key="id" :default-expand-all="true"
            :default-checked-keys="defaultKeys"
        ></el-tree>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="setRightDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="allotRights">确 定</el-button>
            </span>
        </template>
    </el-dialog>

    <!-- 修改权限的对话框 -->
    <el-dialog
       title="编辑权限"
       :visible.sync="editDialogVisible"
       width="50%"
       @close="editDialogClosed"
    >
      <el-form :model="editForm" 
          :rules="editFormRules" ref="editFormRef" 
          label-width="100px"
          status-icon
       >
          <el-form-item label="角色" prop="roleName">
             <el-input v-model="editForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
             <el-input v-model="editForm.roleDesc"></el-input>
          </el-form-item>
       </el-form>
       <template #footer>
          <span class="dialog-footer">
             <el-button @click="editDialogVisible = false">取 消</el-button>
             <el-button type="primary" @click="editConfrim">确 定</el-button>
          </span>
       </template>
    </el-dialog>
  </div>
</template>
 
<script>
   export default {
       data() {
           return {
                rolesList: [],
                addDialogVisible: false,
                setRightDialogVisible: false,
                // 当前角色的id
                roleId: '',
                addForm: {
                    roleName: '',
                    roleDesc: ''
                },
                rightsList: [],
                // 树形控件的数据
                treeProps: {
                    label: 'authName',
                    children: 'children'
                },
                // 树形默认被选中的id
                defaultKeys: [],
                editDialogVisible: false,
                addFormRules: {
                    roleName: [
                        { required: true, message: '请输入角色', trigger: 'blur' },
                    ],
                    roleDesc: [
                        { required: true, message: '请输入角色描述', trigger: 'blur' }
                        ],
                },
                editForm: {
                    roleId: '',
                    roleName: '',
                    roleDesc: '',
                },
                editFormRules: {
                    roleName: [
                        { required: true, message: '请输入角色', trigger: 'blur' },
                    ],
                    roleDesc: [
                        { required: true, message: '请输入角色描述', trigger: 'blur' }
                        ],
                }
           }
       },
       created () {
           this.getRolesList();
       },
       methods: {
            // 获取列表
            async getRolesList () {
                let {data: res} = await this.$http.get('roles');
                if (res.meta.status !== 200) return this.$message.error('获取角色列表失败');
                this.rolesList = res.data;
            },
            // 添加角色对话框关闭
            addDialogClosed () {
                this.$refs.addFormRef.resetFields();
            },
            // 添加角色对话框，确定按钮
            addConfrim () {
                this.$refs.addFormRef.validate(async (valid) => {
                    if (!valid) return;
                    let {data: res} = await this.$http.post(`roles`, {
                        ...this.addForm
                    })
                    if (res.meta.status !== 201) return this.$message.error('添加角色失败');
                    this.$message.success('添加角色成功');
                    this.getRolesList();
                    this.addDialogVisible = false;
                })
            },
            // 显示修改弹框
            async showEditDialog (rolesid) {
               this.editDialogVisible = true;
               let {data: res} = await this.$http.get(`roles/${rolesid}`);
               if (res.meta.status !== 200) return this.$$message.error('获取信息失败');
               this.editForm = res.data;
           },
            // 关闭分配权限弹框
           editDialogClosed () {
               this.$refs.editForm.resetFields();
           },
            // 确定编辑修改
            editConfrim () {
                this.$refs.editFormRef.validate(async (valid) => {
                    if (!valid) return;
                    let {data: res} = await this.$http.put(`roles/${this.editForm.roleId}`, {
                        roleName: this.editForm.roleName,
                        roleDesc: this.editForm.roleDesc
                    });
                    if (res.meta.status !== 200) return this.$message.error('修改失败');
                    this.getRolesList();
                    this.$message.success('修改成功');
                    this.editDialogVisible = false;
                })
            },
            // 删除
            async removeEditDialog (rolesid) {
                const confrimResult = await this.$confirm('此操作将永久该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                    }).catch(err => err);
                    if (confrimResult !== 'confirm') {
                        return this.$message.info('已取消删除');
                    } else {
                        let {data: res} = await this.$http.delete(`roles/${rolesid}`);
                        if (res.meta.status !== 200) return this.$message.error('删除失败');
                        this.getRolesList();
                        return this.$message.success('删除成功');
                    }
            },
            // 显示分配权限弹框
            async showSetRightDialog (role) {
                this.roleId = role.id;
                let {data: res} = await this.$http.get(`rights/tree`);
                if (res.meta.status !== 200) return this.$$message.error('获取信息失败');
                this.rightsList = res.data;
                this.setRightDialogVisible = true;
                this.getLeafKeys(role, this.defaultKeys)
            },
            // 确定添加权限
            async allotRights () {
                const keys = [
                    ...this.$refs.treeRef.getCheckedKeys(),
                    ...this.$refs.treeRef.getHalfCheckedKeys()
                ]
                const idStr = keys.join(',');
                let {data: res} = await this.$http.post(`roles/${this.roleId}/rights`, {
                    rids: idStr
                })
                if (res.meta.status !== 200) this.$message.error('分配权限失败');
                this.$message.success('分配权限成功');
                this.getRolesList();
                this.setRightDialogVisible = false;
            },
            // 关闭权限分配弹框
            setRightDialogColsed () {
                this.defaultKeys = [];
            },
            // 通过递归的形式，获取角色的三级权限的id
            getLeafKeys (node, arr) {
                if (!node.children) {
                    return arr.push(node.id);
                }
                node.children.forEach(item => {
                    this.getLeafKeys(item, arr);
                });
            },

            // 点击三级标签权限的删除，弹出删除弹框
            async removeRightById (role, rightId) {
                let confirmResult = await this.$confirm('此操作将永久该用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                if (confirmResult !== 'confirm') {
                    return this.$message.info('取消了删除');
                }
                let {data: res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`);
                if (res.meta.status !== 200) return this.$message.error('删除权限失败');
                role.children = res.data;
                this.$message.success('删除成功');
            }
       },
   }
</script>
 
 
<style lang="less" scoped>
    .el-tag{
        margin: 7px;
    }
    .bdtop{
        border-top: 1px solid #eee;
    }
    .bd-bottom {
        border-bottom: 1px solid #eee;
    }
    .flxcter{
        display: flex;
        align-items: center;
    }
    .wrapCol {
        display: flex;
        max-width: 600px;
        flex-direction: row;
        flex-wrap: wrap;
    }
</style>