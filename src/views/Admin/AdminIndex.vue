<template>
  <el-container style="height: 100%; ">
    <el-aside :width="aside_witdh" :style="{ height: asideHeight, backgroundColor: 'rgb(238, 241, 246)', marginLeft: '-1px' }">
      <Aside :isCollapse="isCollapse"></Aside>
    </el-aside>

    <el-container style="height: 100%">
      <el-header style="text-align: right; font-size: 12px;border-bottom: rgba(168,168,168,0.3) 2px solid;">
        <Header @doCollapse="doCollapse" :icon="icon"></Header>
      </el-header>

      <el-main style="height: 100%;padding: 20px 0 20px" >
        <router-view/>
      </el-main>
    </el-container>

  </el-container>
</template>

<script>
import Aside from "@/components/AdminAside.vue";
import Header from "@/components/AdminHeader.vue";

export default {
  name: "index",
  components: {Aside, Header},
  data() {
    return {
      isCollapse: false,
      aside_witdh: '200px',
      icon:'el-icon-s-fold',
      asideHeight:'130vh'
    }
  },
  methods: {
    doCollapse() {
      this.isCollapse = !this.isCollapse
      if (!this.isCollapse) {//菜单展开 图标向左
        this.aside_witdh='200px'
        this.icon='el-icon-s-fold'
      } else {//菜单收起 图标向右
        this.aside_witdh='64px'
        this.icon='el-icon-s-unfold'
      }
    },
  }
}
</script>
<style scoped>

</style>