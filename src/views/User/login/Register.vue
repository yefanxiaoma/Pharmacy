<template>
  <el-container>
    <div style="align-items: center;justify-content: center">
      <el-header style="height: 130px;background-color: white;display:flex;align-items: center;justify-content: center">
        <div class="header">
          <div class="logo">
            <el-image :src="require('@/image/jianke_logo.jpg')" style="width: 256px;height: 90px"></el-image>
          </div>
          <div class="register_link">
            <span style="margin-right: 5px">注册完成，点击此处</span>
            <router-link to="/user/login" style="text-decoration: none">登录</router-link>
          </div>
        </div>
      </el-header>
    </div>
    <el-main style="height: 700px; background-color: aquamarine; display: flex; align-items: center; justify-content: center;">
      <div style="width: 700px;height: 400px; padding: 20px; border: 1px solid #dcdfe6; border-radius: 5px; background-color: white; text-align: center;">
        <div v-if="!registrationSuccess" style="color: #409EFF; font-size: 20px; margin-bottom: 20px;">新用户注册</div>

        <hr style="border: 1px solid #409EFF; margin-bottom: 20px;" v-if="!registrationSuccess" />

        <el-form v-if="!registrationSuccess" :model="registerform" :rules="rules" ref="registerform" style="text-align: center;">
          <el-form-item  prop="userno" style="text-align: center;">
            <span class="label">账号</span>
            <el-input  v-model="registerform.userno" placeholder="请输入账号" style="width: 300px;"></el-input>
          </el-form-item>

          <el-form-item  prop="password" style="text-align: center;">
            <span class="label">密码</span>
            <el-input type="password" v-model="registerform.password" placeholder="请输入密码" style="width: 300px;"></el-input>
          </el-form-item>

          <el-form-item  prop="confirmPassword" style="text-align: center;">
            <span class="label">确认密码</span>
            <el-input type="password" v-model="registerform.confirmPassword" placeholder="请确认密码" style="width: 300px;"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button style="width: 300px;margin-left: 80px"
                       type="primary"
                       @click="save"
                       :disabled="confirmed"
            >
              注册
            </el-button>
          </el-form-item>
        </el-form>
        <div v-else>
          <h2 style="margin-top: 20px">注册成功，请去登录</h2>
          <el-button style="margin-top: 60px" type="primary" @click="resetForm">返回</el-button>
        </div>
      </div>
    </el-main>
    <el-footer>
      <Footer></Footer>
    </el-footer>
  </el-container>
</template>

<script>
import Footer from '@/components/Footer.vue';
export default {
  name:"Register",
  components:{Footer},
  data(){
    return{
      registerform:{
        userno:'',
        password:"",
        confirmPassword:"",
        roleId:2
      },
      rules:{
      userno:[
        {required:true,message:'请输入账号',trigger: "blur"},
        {
          pattern: /^[A-Za-z0-9]+$/, // 正则表达式：仅允许英文字符和数字
          message: '名字只能包含英文字符和数字',
          trigger: 'blur'
        },
        {validator:this.checkDuplicate,trigger: "blur"}
      ],
      password:[
        {required:true,message:'请输入密码',trigger: "blur"}
      ],
      confirmPassword:[
        {required: true,message:'请再次输入密码',trigger:"blur"},
        {validator: this.checkPassword}
      ]
      },
      confirmed:false,
      registrationSuccess:false
    }
  },
  methods:{
    checkDuplicate(rule, value, callback) {
      this.$axios.get(this.$HttpUrl+"/user/findByNo?no="+this.registerform.userno).then(res=>res.data).then(res=>{
        if (res.code !== 200) {
          callback();
        } else {
          callback(new Error('账号已存在'));
        }
      });
    },
    checkPassword(rule, value, callback) {
      if (value !== this.registerform.password) {
        callback(new Error('两次输入的密码不一致'));
      } else {
        callback();
      }
    },
    save() {
      this.confirmed = true;
      this.$refs.registerform.validate(valid => {
        if (valid) {
          // 提交表单
          this.$axios.post(this.$HttpUrl + "/user/save", this.registerform).then(res => res.data)
              .then(res => {
                if (res.code === 200) {
                  this.registrationSuccess = true;
                  this.$message({message: "操作成功!", type: 'success'});
                  this.confirmed = false;
                }
              });
        } else {
          this.$message({message: "操作失败!", type: 'error'})
        }
      });
    },
    resetForm() {
      this.registrationSuccess = false;
      this.registerform.userNo = "";
      this.registerform.password = "";
      this.registerform.confirmPassword = "";
    }
    },
}
</script>

<style scoped>
.header{
  margin: 0;
  align-items: center;
  justify-content: center;
  display: flex;
  width: 1400px;
  padding: 20px 20px 20px;
}
.logo{
  margin-left: 100px;
  height: 90px;
}
.register_link{
  font-size: 14px;
  margin-left: 400px;
}
.label{
  display: inline-block;
  line-height: 45px;
  font-size: 15px;
  width: 60px;
  text-align: right;
  vertical-align: top;
  margin-right: 20px;
}
/*
深度作用选择器，但仅作用css
可以修改自带的el组件样式
*/
.el-form-item >>> .el-form-item__error{
  position: relative;
  font-size: 15px;
}
</style>