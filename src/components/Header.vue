<template>
  <el-menu :default-active="activeIndex"
           class="el-menu-demo"
           mode="horizontal"
           style="width: 100%; display: flex; justify-content: space-between; align-items: center;border-bottom: none">
    <div style="display: flex; align-items: center; margin-left: -100px;">
      <el-menu-item  style="color: black">
        {{ welcomeMessage }}
        <router-link v-if="!isLoggedIn" to="/user/register" title="免费注册" style="margin-left: 20px; text-decoration: none;color: black">免费注册</router-link>
        <router-link v-if="!isLoggedIn" to="/user/login" title="登录" style="margin-left: 20px; text-decoration: none;color: black">登录</router-link>
      </el-menu-item>
    </div>
    <div style="display: flex; align-items: center;">
      <el-submenu index="" v-if="isLoggedIn"  style="margin-left: 300px;width: 170px">
        <template slot="title">{{ '你好，' + user.userno }}</template>
        <el-menu-item @click.native="gocenter"><i class="el-icon-user"></i>个人中心</el-menu-item>
        <el-menu-item @click.native="goshoppingcart"><i class="el-icon-shopping-cart-2"></i>购物车</el-menu-item>
        <el-menu-item @click.native=""><i class="el-icon-star-off"></i>我的收藏</el-menu-item>
        <el-menu-item @click.native="toOrder"><i class="el-icon-tickets"></i>订单管理</el-menu-item>
        <el-menu-item @click.native="logout"><i class="el-icon-delete"></i>退出登录</el-menu-item>
      </el-submenu>
    </div>
  </el-menu>


</template>

<script>
 export default {
   name: "Header",
   data() {
     return {
       activeIndex: '1',
       isLoggedIn:false,
       user:{},
     };
   },
   computed:{
     welcomeMessage(){
       if (this.isLoggedIn) {
         return `欢迎来到网上药店! ${this.user.name || this.user.userno}`;
       }
       return '欢迎来到网上药店!';
     },
   },
   methods: {
     init(){
       this.user = JSON.parse(sessionStorage.getItem('CurUser'));
       if(this.user){
         this.isLoggedIn = true;
       }
     },
     logout(){
       this.$confirm('您确定要退出登录？',{
         confirmButtonText:'确定',
         type:'warning',
         center:true
       }).then(()=>{
         this.$message({
           type:'success',
           message:'退出登录成功',
         })
         sessionStorage.clear();
         this.$router.push("/").then(() => {
           window.location.reload(); // 刷新一次页面
         });
       }).catch(()=>{
         this.$message({
           type:'info',
           message:'取消退出登录'
         })
       })
     },
     gocenter(){
       this.$router.push("/user/usercenter").then(()=>{
         window.location.reload();
       })
     },
     goshoppingcart(){
       this.$router.push("/shoppingcart").then(()=>{
         window.location.reload();
       })
     },
     toOrder(){
       this.$router.push("/orders/orderinfo").then(()=>{
         window.location.reload();
       })
     },
   },
   created() {
     this.init()
   }
 }
</script>

<style>
.el-menu.el-menu-demo{
  background-color: lightgray;
}
</style>