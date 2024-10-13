<template>
  <div style="display: flex; line-height: 60px;">
    <div style="margin-top: 8px;cursor: pointer;width: 20px">
      <!-- Header点击图标--》提交--》父组件--》改变--》aside子组件(collapse)-->
      <i :class="icon" style="font-size: 20px" @click="collapse"></i>
    </div>
    <div style="flex: 1;text-align: center;font-size: 30px;" >
      <h2>方舟药品管理系统</h2>
    </div>
    <el-dropdown>
      <span>{{ user.userno }}</span><i class="el-icon-arrow-down" style="margin-left: 10px;"></i>
      <el-dropdown-menu>
        <el-dropdown-item @click.native="toUser">个人中心</el-dropdown-item>
        <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  name:"AdminHeader",
  data(){
    return {
      user:JSON.parse(sessionStorage.getItem('AdminCurUser'))
    }
  },
  props:{
    icon:String
  },
  created(){
    this.$router.push("/admin/AdminHome")
  },
  methods:{
    toUser(){
      this.$router.push("/admin/AdminHome")
    },
    logout(){
      this.$confirm('退出登录',{
        confirmButtonText:'确定',
        type:'warning',
        center:true
      }).then(()=>{
        this.$message({
          type:'success',
          message:'退出登录成功'
        })
        this.$router.push("/user/login")
        sessionStorage.clear()
        this.$store.commit("clearMenu");
      }).catch(()=>{
        this.$message({
          type:'info',
          message:'取消退出登录'
        })
      })

    },
    collapse(){
      this.$emit('doCollapse')
    },

  }
}
</script>

<style scoped>

</style>