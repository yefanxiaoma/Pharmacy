<template>
  <el-container>
    <div style="align-items: center;justify-content: center">
    <el-header style="height: 130px;background-color: white;display:flex;align-items: center;justify-content: center">
      <div class="header">
        <div class="logo">
          <el-image :src="require('@/image/jianke_logo.jpg')" style="width: 256px;height: 90px"></el-image>
        </div>
        <div class="register_link">
          <span style="margin-right: 5px">还没有账号?</span>
          <router-link to="/user/register" style="text-decoration: none">立即注册</router-link>
          <span style="margin-right: 5px;margin-left: 20px">不想登录?</span>
          <router-link to="/" style="text-decoration: none">返回首页</router-link>
        </div>
      </div>
    </el-header>
    </div>

    <el-main style="background-color: dodgerblue;height:550px ">
      <div class="login-content">
        <div class="login-header">
      <span
          :class="{ active: currentTab === 'user' }"
          @click="currentTab = 'user'"
      >
        用户登录
      </span>
          <span
              :class="{ active: currentTab === 'admin' }"
              @click="currentTab = 'admin'"
          >
        管理员登录
      </span>
        </div>
        <div class="login-form">
          <el-form
              v-if="currentTab === 'user'"
              :model="loginForm"
              :rules="rules"
              ref="loginForm"
          >
            <el-form-item  prop="userno">
              <el-input
                  style="width: 100%;height: 50px;margin-top: 10px"
                  type="text"
                  v-model="loginForm.userno"
                  autocomplete="off"
                  placeholder="请输入您的账号"
              ></el-input>
            </el-form-item>
            <el-form-item  prop="password">
              <el-input
                  style="width: 100%;height: 50px;margin-top: 10px"
                  type="password"
                  v-model="loginForm.password"
                  show-password
                  autocomplete="off"
                  @keyup.enter.native="confirm"
                  placeholder="请输入您的密码"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                  style="width: 100%;height:50px;margin-top: 10px"
                  type="primary"
                  @click="confirm"
                  :disabled="confirm_disabled"
              >
                立即登录
              </el-button>
            </el-form-item>
          </el-form>

          <el-form
              v-if="currentTab === 'admin'"
              :model="loginFormAdmin"
              :rules="rulesAdmin"
              ref="loginFormAdmin"
          >
            <el-form-item  prop="adminNo">
              <el-input
                  style="width: 100%;height: 50px;margin-top: 10px"
                  type="text"
                  v-model="loginFormAdmin.adminNo"
                  autocomplete="off"
                  placeholder="请输入管理员的账号"
              ></el-input>
            </el-form-item>
            <el-form-item  prop="adminPassword">
              <el-input
                  style="width: 100%;height: 50px;margin-top: 10px"
                  type="password"
                  v-model="loginFormAdmin.adminPassword"
                  show-password
                  autocomplete="off"
                  @keyup.enter.native="confirmAdmin"
                  placeholder="请输入管理员的密码"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                  style="width: 100%;height: 50px;margin-top: 10px"
                  type="primary"
                  @click="confirmAdmin"
                  :disabled="confirm_disabled_admin"
              >
                立即登录
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-main>
    <el-footer>
      <Footer></Footer>
    </el-footer>
  </el-container>
</template>

<script>
import Footer from '@/components/Footer.vue'
export default {
  name: "Login",
  components:{Footer},
  data(){
    return{
      currentTab: 'user', // 默认显示用户登录表单
      loginForm: {
        userno: '',
        password: ''
      },
      loginFormAdmin: {
        adminNo: '',
        adminPassword: ''
      },
      rules:{
        userno:[
          {required:true,message:'请输入账号',trigger: 'blur'}
        ],
        password:[
          {required:true,message:'请输入密码',trigger: 'blur'}
        ]
      },
      rulesAdmin:{
        adminNo:[
          {required:true,message:'请输入管理员账号',trigger: 'blur'}
        ],
        adminPassword:[
          {required:true,message:'请输入密码',trigger: 'blur'}
        ]
      },
      confirm_disabled: false, // 用户登录按钮的禁用状态
      confirm_disabled_admin: false // 管理员登录按钮的禁用状态
    };
  },
  methods:{
    confirm(){
      this.confirm_disabled=true;
      this.$refs.loginForm.validate((valid)=>{
        if(valid){
          /*
          * 去后台验证账号密码
          * */
          this.$axios.post(this.$HttpUrl+"/user/login",this.loginForm).then(res=>res.data).then(res=> {
            if (res.code === 200) {
              //存储
              sessionStorage.setItem("CurUser", JSON.stringify(res.data.user))
              //跳转到个人中心
              this.$router.replace('/user/usercenter');
            } else {
              this.confirm_disabled = false;
              alert('输入的账号或者密码错误');
              return false;
            }
          });
        }else {
          this.confirm_disabled=false;
          return false;
        }
      });
    },
    confirmAdmin(){
      this.confirm_disabled_admin=true;
      this.$refs.loginFormAdmin.validate((valid)=>{
        if(valid){
          /*
          * 去后台验证账号密码
          * */
          this.$axios.post(this.$HttpUrl+"/user/adminlogin",this.loginFormAdmin).then(res=>res.data).then(res=> {
            if (res.code === 200) {
              //存储
              sessionStorage.setItem("AdminCurUser", JSON.stringify(res.data.admin))
              this.$store.commit("setMenu",res.data.menu)
              //跳转到admin主页
              this.$router.replace("/admin/index");
            } else {
              this.confirm_disabled_admin = false
              alert('输入的账号或者密码错误');
              return false;
            }
          });
        }else {
          this.confirm_disabled_admin=false;
          return false;
        }
      });
    }
  }
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
  width: 400px;
}
.login-content{
  background-color: white;

  height: 350px;
  border-radius: 4px;
  position: relative;
}
.login-content {
  width: 300px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.login-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.login-header span {
  cursor: pointer;
  font-size: 16px;
  font-weight: 700;
  color: #333;
  padding: 10px;
}

.login-header .active {
  color: #409EFF;
  border-bottom: 2px solid #409EFF;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.el-form-item {
  margin-bottom: 15px;
}
</style>