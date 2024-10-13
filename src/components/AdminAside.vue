<template>
  <el-menu background-color="#545c64"
           text-color="#fff"
           active-text-color="#ffd04b"
           style="height: 100%"
           default-active="/Home"
           :collapse="isCollapse"
           :collapse-transition="false"
           router
  >
    <el-menu-item index="/admin/AdminHome">
      <i class="el-icon-s-home"></i>
      <span slot="title">首页</span>
    </el-menu-item>
    <el-menu-item :index="'/'+item.menuClick" v-for="(item,i) in menu" :key="i">
      <i :class="item.menuIcon"></i>
      <span slot="title">{{item.menuName}}</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name:"AdminAside",
  data(){
    return{
    }
  },
  props:{
    isCollapse:Boolean
  },
  computed:{
    menu(){
      return this.$store.state.menu
    }
  },
}
</script>

<style scoped>

</style>