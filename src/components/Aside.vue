<template>
<el-menu background-color="white"
         text-color="black"
         active-text-color="#ffd04b"
         style="height: 100%"
         default-active="/"
         router
>
<el-menu-item index="/user/usercenter">
  <i class="el-icon-user-solid"></i>
  <span slot="title">用户中心</span>
</el-menu-item>
  <el-menu-item index="#">
    <i class="el-icon-s-tools"></i>
    <span slot="title">账号安全</span>
  </el-menu-item>
  <el-menu-item index="/orders/orderinfo">
    <i class="el-icon-s-order"></i>
    <span slot="title">我的订单</span>
  </el-menu-item>
  <el-menu-item index="#">
    <i class="el-icon-star-on"></i>
    <span slot="title">我的收藏</span>
  </el-menu-item>
  <el-menu-item index="/shoppingcart">
    <i class="el-icon-s-goods"></i>
    <span slot="title">购物车栏</span>
  </el-menu-item>
  <el-menu-item index="/user/userAddress">
    <i class="el-icon-circle-plus"></i>
    <span slot="title">收货地址</span>
  </el-menu-item>
</el-menu>
</template>

<script>
export default {
  name:"Aside",
  data(){
    return{
    }
  },
  props:{

  },
  computed:{
  },
}
</script>

<style scoped>

</style>