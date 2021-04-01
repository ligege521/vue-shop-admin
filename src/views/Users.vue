<template>
   <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
    <!-- 卡片视图 -->
        <el-card class="box-card">
           <!-- 搜索框 -->
           <el-row :gutter="10">
              <el-col :span="7">
                  <el-input
                     placeholder="请输入内容"
                     class="input-with-select"
                     clearable
                     v-model="queryInfo.query"
                     @clear="getUserList"
                  >
                     <template #append>
                        <el-button icon="el-icon-search"
                           @click="getUserList"
                        ></el-button>
                     </template>
                  </el-input>
              </el-col>
              <el-col :span="4">
                 <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
              </el-col>
           </el-row>
           
           <!-- 表格 -->
           <el-table :data="userList" border :stripe="true">
               <el-table-column type="index" label="序列"></el-table-column>
               <el-table-column label="姓名" prop="username" ></el-table-column>
               <el-table-column label="邮箱" prop="email"></el-table-column>
               <el-table-column label="电话" prop="mobile"></el-table-column>
               <el-table-column label="角色" prop="role_name"></el-table-column>
               <el-table-column label="状态">
                  <template v-slot="scope">
                     <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
                  </template>
               </el-table-column>
               <el-table-column label="操作">
                  <!-- v-slot="scope" -->
                  <template v-slot="scope">
                     <el-button type="primary" size="mini" 
                        icon="el-icon-edit" @click="showEditDialog(scope.row.id)"
                     ></el-button>
                     <el-button type="danger"  size="mini" icon="el-icon-delete"
                        @click="removeUserById(scope.row.id)"
                     ></el-button>
                     <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                        <el-button type="warning" size="mini" icon="el-icon-setting"></el-button>
                     </el-tooltip>
                  </template>
               </el-table-column>
           </el-table>

           <!-- 分页 -->
           <el-pagination
               @size-change="handleSizeChange"
               @current-change="handleCurrentChange"
               :current-page="queryInfo.pagenum"
               :page-sizes="[1, 2, 5, 10]"
               :page-size="queryInfo.pagesize"
               layout="total, sizes, prev, pager, next, jumper"
               :total="total"
            >
            </el-pagination>

            <!-- 添加用户的对话框 -->
            <el-dialog
               title="添加用户"
               :visible.sync="addDialogVisible"
               width="50%"
               center
               @close="addDiglogClosed"
            >
               <el-form :model="addForm" 
                  :rules="addFormRules" ref="addFormRef" 
                  label-width="100px" class="demo-ruleForm"
                  status-icon
               >
                  <el-form-item label="用户名" prop="username">
                     <el-input v-model="addForm.username"></el-input>
                  </el-form-item>
                  <el-form-item label="密码" prop="password">
                     <el-input v-model="addForm.password" type="password"></el-input>
                  </el-form-item>
                  <el-form-item label="邮箱" prop="email">
                     <el-input v-model="addForm.email"></el-input>
                  </el-form-item>
                  <el-form-item label="手机号" prop="mobile">
                     <el-input v-model="addForm.mobile"></el-input>
                  </el-form-item>
               </el-form>
               <template #footer>
                  <span class="dialog-footer">
                     <el-button @click="addDialogVisible = false">取 消</el-button>
                     <el-button type="primary" @click="addUser">确 定</el-button>
                  </span>
               </template>
            </el-dialog>
            <!-- 修改用户的对话框 -->
            <el-dialog
               title="修改用户"
               :visible.sync="editDialogVisible"
               width="50%"
               @close="editDialogClosed"
            >
              <el-form :model="editForm" 
                  :rules="editFormRules" ref="editFormRef" 
                  label-width="100px" class="demo-ruleForm"
                  status-icon
               >
                  <el-form-item label="用户名">
                     <el-input v-model="editForm.username" disabled></el-input>
                  </el-form-item>
                  <el-form-item label="邮箱" prop="email">
                     <el-input v-model="editForm.email"></el-input>
                  </el-form-item>
                  <el-form-item label="手机号" prop="mobile">
                     <el-input v-model="editForm.mobile"></el-input>
                  </el-form-item>
               </el-form>
               <template #footer>
                  <span class="dialog-footer">
                     <el-button @click="editDialogVisible = false">取 消</el-button>
                     <el-button type="primary" @click="editUser">确 定</el-button>
                  </span>
               </template>
            </el-dialog>
        </el-card>
   </div>
</template>
 
<script>
   export default {
      data () {
         // 验证手机号的规则
         var checkMobile = (rule, value, cb) => {
            const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
            if (regMobile.test(value)) {
               return cb();
            }
            cb(new Error('请输入合法的手机号'));
         }
         return {
            queryInfo: {
               query: '',
               pagenum: 1,
               pagesize: 2
            },
            userList: [],
            total: 0,
            addDialogVisible: false,
            addForm: {
               username: '',
               password: '',
               email: '',
               mobile: ''
            },
            addFormRules: {
               username: [
                  { required: true, message: '请输入用户名', trigger: 'blur' },
                  { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
               ],
               password: [
                  { required: true, message: '请输入密码', trigger: 'blur' },
                  { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
               ],
               email: [
                  { required: true, message: '请输入邮箱', trigger: 'blur' },
                  { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
               ],
               mobile: [
                  { required: true, message: '请输入手机号', trigger: 'blur' },
                  { validator: checkMobile, message: '请输入正确的手机号', trigger: 'blur'}
               ],
            },
            editDialogVisible: false,
            editForm: {
               username:'',
               email: '',
               mobile: ''
            },
            editFormRules: {
                email: [
                  { required: true, message: '请输入邮箱', trigger: 'blur' },
                  { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
               ],
               mobile: [
                  { required: true, message: '请输入手机号', trigger: 'blur' },
                  { validator: checkMobile, message: '请输入正确的手机号', trigger: 'blur'}
               ],
            },
         }
      },
      created () {
         this.getUserList();
      },
      methods: {
         // 获取用户列表
         async getUserList () {
            let {data: res} = await this.$http.get('users', {
               params: this.queryInfo
            });
            if (res.meta.status !== 200) return this.$message.error('获取用户列表失败');
            this.userList = res.data.users;
            this.total = res.data.total;
         },
         // 监听 pagesize 的改变
         handleSizeChange (newSize) {
            this.queryInfo.pagesize = newSize;
            this.getUserList();
         },
         // 监听 页码值 的改变
         handleCurrentChange (newPage) {
            this.queryInfo.pagenum = newPage;
            this.getUserList();
         },
         // 用户状态的改变
         async userStateChange (userinfo) {
            let {data: res} = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`);
            if (res.meta.status !== 200) {
               userinfo.mg_state = !userinfo.mg_state;
               return this.$message.error('更新状态失败');
            }
            this.$message.success('更新状态成功');
         },
         // 点击按钮添加新用户
         addUser () {
            this.$refs.addFormRef.validate(async (valid) => {
               if (!valid) return;
               let {data: res} = await this.$http.post('users', this.addForm);
               if (res.meta.status !== 201) {
                  return this.$message.error('添加用户失败');
               }
               this.$message.success('添加用户成功');
               this.addDialogVisible = false;
               this.getUserList();
            })
         },
         // 关闭添加对话框
         addDiglogClosed () {
            this.$refs.addFormRef.resetFields();
         },
         // 显示修改对话框
         async showEditDialog (userid) {
            this.editUserId = userid;
            let {data: res} = await this.$http.get(`users/${userid}`);
            if (res.meta.status !== 200) {
               return this.$message.error('查询用户失败');
            }
            this.editForm = res.data;
            this.editDialogVisible = true;
         },
         // 关闭修改对话框
         editDialogClosed () {
            this.$refs.editFormRef.resetFields();
         },
         // 点击修改
         editUser () {
            this.$refs.editFormRef.validate(async (valid) => {
               if (!valid) return;
               let {data: res} = await this.$http.put(`users/${this.editForm.id}`, {
                  email: this.editForm.email,
                  mobile: this.editForm.mobile
               });
               if (res.meta.status !== 200) return this.$message.error('修改信息失败');
               this.$message.success('修改成功');
               this.getUserList();
               this.editDialogVisible = false
            })
         },
         // 删除用户信息
         async removeUserById (userId) {
            const confrimResult = await this.$confirm('此操作将永久该用户, 是否继续?', '提示', {
               confirmButtonText: '确定',
               cancelButtonText: '取消',
               type: 'warning'
            })
            .catch(err => err);
            if (confrimResult === 'confirm') {
               let {data: res} = await this.$http.delete(`users/${userId}`);
               console.log(res);
               if (res.meta.status !== 200)  return this.$message.error('删除失败');
               this.getUserList();
               return this.$message.success('删除成功');
            } else {
               return this.$message.info('已取消删除');
            }
         }
      }
   }
</script>
 
 
<style scoped>
   .el-table{
      margin-top: 15px;
      font-size: 12px;
   }
   .el-pagination{
      margin-top: 15px;
   }
</style>