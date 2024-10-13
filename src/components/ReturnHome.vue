<template>
  <div style="height: 80px;padding: 0 10px;display: flex;background-color: #409EFF;align-items: center;justify-content: center">
    <div style="width: 500px">
      <el-image
          style="width: 310px;height: 80px"
          :src="require('@/image/logo.png')"
          fit="cover"
      >
      </el-image>
    </div>
    <div style="text-align: center;width: 300px">
      <router-link to="/" style="text-decoration: none;color: white">首页</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name:"ReturnHome"
}
</script>

<style>

</style>