<template>
  <div style="text-align: center;background-color: #f1f1f3;height: 100%;padding: 0;margin: 0;">
    <h3 style="font-size: 30px;">{{'管理员: '+user.name}}</h3>
    <el-descriptions  title="个人中心" :column="2" size="medium" border>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-s-custom"></i>
          账号
        </template>
        {{user.userno}}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-mobile-phone"></i>
          电话
        </template>
        {{user.phone}}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-location-outline"></i>
          性别
        </template>
        <el-tag
            :type="user.sex === '1' ? 'primary' : 'success'"
            disable-transitions><i :class="user.sex===1?'el-icon-male':'el-icon-female'"></i>{{ user.sex === 1 ? "男" : "女" }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-tickets"></i>
          角色
        </template>
        <el-tag :type="user.roleId ===0 ? 'danger' :'primary'" disable-transitions>
          {{ user.roleId === 0 ? "超级管理员" : "管理员" }}
        </el-tag>
      </el-descriptions-item>
    </el-descriptions>
    <div style="margin-top: 400px">
    <DateUtils></DateUtils>
    </div>
  </div>
</template>

<script>
import DateUtils from "@/components/DateUtils.vue";
export default {
  name: "AdminHome",
  components: {DateUtils},
  data() {
    return {
      user:{}
    }
  },
  computed:{

  },
  methods:{
    init(){
      this.user = JSON.parse(sessionStorage.getItem('AdminCurUser'))
    }
  },
  created(){
    this.init()
  }
}
</script>


<style scoped>

</style>