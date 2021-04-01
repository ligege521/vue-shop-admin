<template>
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header>
      <div class="header-left">
        <img class="home-logo" src="../assets/logo.png" alt="" srcset="" />
        <span class="home-title">电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 主体内容 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          default-active="1"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409Eff"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :defaultActive="activePath"
          router=""
        >
        <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/' + subItem.path"
               v-for="subItem in item.children" 
               :key="subItem.id"
               @click="saveNavstate('/' + subItem.path)"
            >
              <i class="el-icon-menu"></i>
              <span>{{subItem.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主体内容 -->
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      menuList: [],
      iconsObj:{
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-dingdan',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-quanxian',
        '145': 'iconfont icon-shujutongji'
      },
      isCollapse: false,
      activePath: ''
    }
  },
  created () {
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem('activePath');
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取侧边栏列表
    async getMenuList () {
      let {data: res} = await this.$http.get('menus');
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.menuList = res.data;
    },
    // 切换菜单显示
    toggleCollapse () {
      this.isCollapse = !this.isCollapse;
    },
    // 保存链接激活状态
    saveNavstate (activePath) {
      window.sessionStorage.setItem('activePath', activePath);
      this.activePath = activePath;
    }
  },
}
</script>
<style lang="less" scoped>
.home-container {
  width: 100%;
  height: 100%;
}
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
  background-color: #373d41;
  .header-left {
    display: flex;
    align-items: center;
    font-size: 20px;
    color: #eaedf1;
    .home-logo {
      display: inline-block;
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu{
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.toggle-button{
  background-color: #4a5064;
  font-size: 10px;
  height: 24px;
  line-height: 24px;
  color: #fff;
  text-align: center;
}
.iconfont{
  margin-right: 10px;
}
</style>
