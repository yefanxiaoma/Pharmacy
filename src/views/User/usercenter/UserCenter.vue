<template>
  <el-container style="border: 1px solid #eee; flex: 1; display: flex; flex-direction: column;">
    <el-header style="padding: 0; margin: 0; height: 56px">
      <Header></Header>
    </el-header>
      <el-main style="padding: 0;">
        <div style="display: flow;">
         <ReturnHome></ReturnHome>
        <div style="margin-top: 10px;display: flex;justify-content: center;">
          <div style="width: 200px;height: 500px">
            <Aside></Aside>
          </div>
          <div style="width: 800px;">
        <el-form :model="usercenterform" status-icon :rules="rules" ref="usercenterform" label-width="100px">
          <el-form-item label="昵称: " prop="username">
            <el-input type="text" v-model="usercenterform.name"></el-input>
          </el-form-item>
          <el-form-item label="手机号码: " prop="phone">
              <el-input v-model="usercenterform.phone"></el-input>
          </el-form-item>
          <el-form-item label="性别: " prop="sex" >
            <el-radio-group v-model="usercenterform.sex" ref="radio">
              <el-radio label="1">男</el-radio>
              <el-radio label="0">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="年龄: " prop="age">
              <el-input type="text"  v-model="usercenterform.age"></el-input>
          </el-form-item>
        </el-form>
            <div style="margin-left: 90px;width: 800px">
          <el-button type="primary" style="margin-left: 10px;width: 200px" @click="update">确定</el-button>
          <el-button type="success" style="margin-left: 10px;width: 200px" @click="resetParam">重置</el-button>
            </div>
          </div>
        </div>
          <Footer></Footer>
        </div>
      </el-main>
  </el-container>
</template>

<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";

import ReturnHome from "@/components/ReturnHome.vue";
import Aside from "@/components/Aside.vue";
export default {
  name: "UserCenter",
  components: {Aside, ReturnHome, Header,Footer},
  data() {
    return {
      id:'',
      usercenterform:{
          id: '',
          name: '',
          phone: '',
          sex: '',
          age: ''
      },
      rules: {
        name: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入手机号码', trigger: 'blur' },
          { pattern:/^1\d{10}$/,message: '请输入11位正确的手机号码',trigger: "blur" },
          {validator:this.checkPhone}
        ],
        sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
        age: [{ required: true, message: '请输入您的年龄', trigger: 'blur' }],
      },
    };
  },
  mounted() {
  },
  methods: {
    checkPhone(rule,value,callback) {
      if (!this.user.id){
        this.$axios.get(this.$HttpUrl + "/userAddress/findByPhone?phone=" + value).then(res => {
          if (res.data.code !== 200) {
            callback();
          } else {
            callback(new Error('该手机号已绑定'));
          }
        });
    }else {
        callback();
      }
    },
    init() {
      this.user = JSON.parse(sessionStorage.getItem('CurUser'));
    },
    update() {
      this.$refs.usercenterform.validate((valid) => {
        if (valid) {
          // 保存逻辑
          this.$axios.post(this.$HttpUrl + "/user/update", this.usercenterform).then(res => res.data)
              .then(res => {
                if (res.code === 200) {
                  this.$message.success('保存成功');
                  this.DialogVisible= true
                }
              });
        } else {
          return false;
        }
      });
    },
    resetParam() {
      this.usercenterform.name = ''
      this.usercenterform.phone = ''
      this.usercenterform.sex = ''
      this.usercenterform.age = ''
    },
  },
  created() {
    this.init()
    this.usercenterform.id = this.user.id;
    this.usercenterform.name = this.user.name;
    this.usercenterform.phone = this.user.phone;
    this.usercenterform.age = this.user.age;
    this.usercenterform.sex = String(this.user.sex);
  },
}
</script>

<style scoped>

</style>
