<template>
  <el-container style="display: flow;flex-direction: column;">
      <el-header style="padding: 0;margin: 0;height: 56px">
        <Header></Header>
      </el-header>

      <el-main style="padding: 0;">
            <Search></Search>
            <Main></Main>
        <div style="background-color: #409EFF;height: 30px;width: 100%;margin-top: 50px"></div>
            <Footer></Footer>
      </el-main>
  </el-container>

</template>

<script>
import Header from '@/components/Header.vue'
import Main from "@/components/Main.vue";
import Search from '@/components/Search.vue'
import Footer from '@/components/Footer.vue'
export default {
  name: "Home",
  components:{Main, Header,Search,Footer},
}
</script>

<style>
.el-header{
  background-color: lightgray;
}

</style>