<template>
  <div class="login_container"> 
        <div class="login_box abcter">
            <!-- logo -->
            <div class="avatar_box abcter">
                <img src="../assets/logo.png" alt="logo" srcset="">
            </div>
            <!-- 表单 -->
            <el-form class="login_form" 
            :model='loginForm' :rules='loginFormRules'
            ref="loginFormRef"
            >
                <!-- 用户名 -->
                <el-form-item prop='username'>
                    <el-input v-model='loginForm.username'  prefix-icon='iconfont icon-wulumuqishigongandashujuguanlipingtai-ico-'></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop='password'>
                    <el-input v-model="loginForm.password" type='password' prefix-icon='iconfont icon-mima'></el-input>
                </el-form-item>
                <!-- 按钮 -->
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>
                
            </el-form>
        </div>
  </div>
</template>
 
<script>
   export default {
       data() {
           return {
               loginForm: {
                   username: 'admin',
                   password: '123456'
               },
               loginFormRules:{
                //    验证信息
                   username: [
                        { required: true, message: '请输入用户名称', trigger: 'blur' },
                        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                   ],
                   password: [
                        { required: true, message: '请输入用户密码', trigger: 'blur' },
                        { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                   ]
               }
           }
       },
       methods: {
           resetLoginForm () {
               this.$refs.loginFormRef.resetFields
           },
           login () {
               this.$refs.loginFormRef.validate(async (valid) => {
                    if (!valid) return;
                    const {data: res} = await this.$http.post('login', this.loginForm);
                    if (res.meta.status === 200) {
                        this.$message.success('登录成功');
                        this.storageToken(res.data.token);
                        this.$router.push('/home');
                    }else {
                        this.$message.error('登录失败')
                    }
               })
           },
           storageToken (data) {
               window.sessionStorage.setItem('token', data);
           }
       },
   }
</script>
 
 
<style lang='less' scoped>
 .login_container{
     background-color: #1c315b;
     width: 100%;
     height: 100%;
 }
 .login_box {
     width: 450px;
     height: 300px;
     background-color: #fff;
     border-radius: 3px;

     .avatar_box{
         width: 130px;
         height: 130px;
         border: 1px solid #eee;
         padding: 10px;
         border-radius: 50%;
         margin-top: -150px;
         background-color: #fff;
         img{
             width: 100%;
             height: 100%;
             border-radius: 50%;
             background-color: #eee;
            }
     }
    .login_form{
        margin-top: 100px;
        padding: 10px;
        box-sizing: border-box;
        .btns{
            text-align: center;
        }
    }
 }
</style>