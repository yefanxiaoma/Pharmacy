<template>
  <el-container style="border: 1px solid #eee; flex: 1; display: flex; flex-direction: column;">
    <el-header style="padding: 0; margin: 0; height: 56px">
      <Header></Header>
    </el-header>

      <el-main style="padding: 0;">
        <div style="display: flow;">
         <ReturnHome></ReturnHome>
        <div style="margin-top: 10px;display: flex;justify-content: center;">
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
          <el-button type="primary" style="margin-left: 10px;width: 200px" @click="add">新增收货地址</el-button>
            </div>
          </div>
        </div>
        <div style="margin-top: 50px;background-color: #f9f9f9;">
          <div v-if="tableData && tableData.length" class="address_container">
            <div v-for="item in tableData" :key="item.id" class="item">
              <div class="name">{{ item.username }} 收</div>
              <div class="location">所在地区：{{ item.province }} {{ item.city }} {{ item.district }}</div>
              <div class="detail">详细地址：{{ item.detail }}</div>
              <div class="phone">联系手机：{{ item.mobile }}</div>
              <div style="margin-top: 20px">
                <el-button size="medium" type="success" @click="mod_user(item)">编辑</el-button>
                <el-popconfirm style="margin-left: 5px"
                               title="确定删除吗?"
                               @confirm="delete_Address(item.id)"
                >
                  <el-button slot="reference" size="medium" type="danger" >删除</el-button>
                </el-popconfirm>
              </div>
            </div>
          </div>
        </div>
        </div>
        <el-dialog
            title="填写收货地址"
            :visible.sync="centerDialogVisible"
            width="400px"
            center>
          <el-form ref="form" :rules="rule" :model="form" label-width="80px">
            <el-form-item label="收货人" prop="username" required>
              <el-col :span="20">
                <el-input v-model="form.username"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="所在地区"  required>
              <el-col :span="20">
                <el-cascader
                    size="large"
                    :options="provinceOptions"
                    placeholder="请选择省市区"
                    v-model="provinces"
                    @change="handleChange"
                    >
                </el-cascader>
              </el-col>
            </el-form-item>
            <el-form-item label="详细地址" prop="detail" required>
              <el-col :span="20">
                <el-input v-model="form.detail"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="联系手机" prop="mobile" required>
              <el-col :span="20">
                <el-input v-model="form.mobile"></el-input>
              </el-col>
            </el-form-item>
            <el-form-item label="默认地址">
                <el-switch v-model="isDefault"></el-switch>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="centerDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="save">确 定</el-button>
          </span>
        </el-dialog>
        <el-dialog
            title="信息已失效，请重新登录"
            :visible.sync="DialogVisible"
            width="400px"
            center>
          <span slot="footer" class="dialog-footer">
            <el-button @click="logout">取 消</el-button>
            <el-button type="primary" @click="logout">确 定</el-button>
          </span>
        </el-dialog>
      </el-main>

  </el-container>
</template>

<script>
import Header from "@/components/Header.vue";
// 注意版本，新版本不稳定，需要5.0.2
import { regionData, CodeToText } from "element-china-area-data";
import ReturnHome from "@/components/ReturnHome.vue";
export default {
  name: "UserCenter",
  components: {ReturnHome, Header },
  data() {
    return {
      id:'',
      tableData:[],
      address:{},
      provinceOptions: regionData,
      centerDialogVisible: false,
      DialogVisible: false,
      provinces:[],
      isDefault: false, // 这个用于控制默认地址开关的状态
      usercenterform:{
          id: '',
          name: '',
          phone: '',
          sex: '',
          age: ''
      },
      form: {
        id:'',
        username: '',
        province:'',
        city:'',
        district:'',
        detail: '',
        mobile: '',
        userId:''
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
      rule: {
        username: [{ required: true, message: '收货人不能为空', trigger: 'blur' }],
        detail: [{ required: true, message: '详细地址不能为空', trigger: 'blur' }],
        mobile: [{ required: true, message: '手机号码不能为空', trigger: 'blur' },
          { pattern:/^1\d{10}$/,message: '请输入11位正确的手机号码',trigger: "blur" }],
      }
    };
  },
  watch: {
    // 观察 form.id 的变化，自动更新 isDefault
    'form.id': function(newId) {
      // 检查 address.id 是否存在
      if (this.address.id) {
        this.isDefault = (this.address.id === newId);
      } else {
        this.isDefault = false;
      }
    }
  },
  mounted() {
    this.$refs.radio.$children.forEach((item)=>{
      item.$refs.radio.removeAttribute("aria-hidden")
    })
    this.loadPost()
    this.address = JSON.parse(sessionStorage.getItem('Address')) || {};

    if(this.address.id){
    this.isDefault = (this.address.id === this.form.id);
    }else {
      this.isDefault = false
    }
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
    logout(){
        sessionStorage.clear();
        this.$router.push("/user/login").then(() => {
          window.location.reload(); // 刷新一次页面
        });
    },
    loadPost(){
     this.$axios.post(this.$HttpUrl+"/userAddress/list",{ id: this.user.id }).then(res=>res.data)
         .then(res=>{
         /* 如果有数据就存到tableData*/
           if(res.code === 200){
              this.tableData = res.data;
           }
         }).catch(error=>{
           console.error('数据获取失败',error)
     })
    },
    init() {
      this.user = JSON.parse(sessionStorage.getItem('CurUser'));
    },
    resetForm() {
      this.$refs.form.resetFields();
    },
    add() {
      this.centerDialogVisible = true;
      this.$nextTick(() => {
        this.resetForm() // 重置填写的信息
        this.form.id=''
      })
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
    doSave(){
      this.$refs.form.validate((valid)=>{
        if(valid){
          this.$axios.post(this.$HttpUrl+"/userAddress/saveAddress",this.form).then(res=>res.data)
              .then(res=>{
                if (res.code === 200){
                  this.centerDialogVisible = false;
                  this.loadPost();
                  this.$message.success("保存成功")
                }
              });
        }else {
          this.$message.error('保存失败');
          return false;
        }
      })
    },
    doMod(){
      this.$axios.post(this.$HttpUrl+"/userAddress/updateAddress", this.form).then(res => res.data)
          .then(res => {
            if (res.code === 200) {
              this.$message({message: "操作成功!", type: 'success'})
              this.centerDialogVisible = false
              this.loadPost()
            } else {
              this.$message({message: "操作失败!", type: 'error'})
            }
          })
    },
    save() {
      this.$refs.form.validate((valid)=> {
        if (valid) {
          if (this.form.id) {
            this.doMod();
          } else {
            this.doSave();
          }
          if (this.isDefault) {
            const currentAddress = JSON.stringify(this.form);
            sessionStorage.setItem("Address", currentAddress);
          } else {
            // 取消默认地址时直接清空 Address
            sessionStorage.removeItem("Address");
          }
          window.location.reload()
        } else {
          return false;
        }
      })
    },
    //修改
    mod_user(item) {
      this.centerDialogVisible = true
      this.$nextTick(() => {
        //赋值到表单
        this.form.id=item.id
        this.form.username=item.username
        this.form.province=item.province
        this.form.city=item.city
        this.form.district=item.district
        this.form.detail=item.detail
        this.form.mobile=item.mobile
      })
    },
    delete_Address(id){
      this.$axios.get(this.$HttpUrl+"/userAddress/deleteAddress?id="+id).then(res=>res.data).then(res=>{
        if (res.code === 200) {
          this.$message({message: "操作成功!", type: 'success'})
          this.loadPost()
        } else {
          this.$message({message: "操作失败!", type: 'error'})
        }
      })
    },
    resetParam() {
      this.usercenterform.username = ''
      this.usercenterform.phone = ''
      this.usercenterform.sex = ''
      this.usercenterform.age = ''
    },
    handleChange(value) {
      //运用了CodeToText把编码转成了中文
      this.form.province = CodeToText[value[0]]
      this.form.city = CodeToText[value[1]]
      this.form.district = CodeToText[value[2]]
    },
  },
  created() {
    this.init()
    this.usercenterform.id = this.user.id;
    this.usercenterform.name = this.user.name;
    this.usercenterform.phone = this.user.phone;
    this.usercenterform.age = this.user.age;
    this.usercenterform.sex = String(this.user.sex);
    this.form.userId = this.user.id;
  },
}
</script>

<style scoped>
.address_container {
  padding: 20px;
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  height: 100%;
  display: flex;
  flex-wrap: wrap; /*允许换行*/
}

.item {
  margin-bottom: 15px;
  padding: 15px;
  background-color: #ffffff;
  border: 1px solid #dcdcdc;
  border-radius: 5px;
  width: calc(25% - 10px); /* 每个 item 宽度为 25% 减去 margin */
  height: 200px;
  margin-left: 10px;
}

.name {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.location, .detail, .phone {
  font-size: 14px;
  color: #666;
  margin-top: 5px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}

</style>
