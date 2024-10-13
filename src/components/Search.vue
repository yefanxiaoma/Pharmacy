<template>
  <div style="display: flex; justify-content: center;align-items: center;height: 150px;width: 100%">
    <div>
      <el-image
          style="width: 310px; height: 90px;"
          :src="require('@/image/jianke_logo.jpg')"
          fit="cover"
      ></el-image>
    </div>
    <!-- 搜索框-->
    <div>
      <el-input v-model="name" placeholder="请输入药品名字"
                suffix-icon="el-icon-search" type="text"
                style="width: 400px;margin-left: 15px;
                border: 2px solid deepskyblue;"></el-input>
      <el-button type="primary" style="width: 100px;height: 45px;border:0;border-radius:0;
      background-color: deepskyblue !important;"
      @click="search">搜索</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Search",
  data() {
    return {
      name: '',
    }
  },
  methods: {
    search() {
      // 检查输入框是否为空
      if (!this.name.trim()) {
        // 设置默认值
        this.name = '感冒灵颗粒';
        // 跳转到 SearchAll.vue，并传递输入的内容
        this.$router.push({ name: 'SearchAll', query: { name: this.name } });
      }else {
        // 跳转到 SearchAll.vue，并传递输入的内容
        this.$router.push({ name: 'SearchAll', query: { name: this.name } });
      }
    },
  }
}
</script>

<style scoped>

</style>