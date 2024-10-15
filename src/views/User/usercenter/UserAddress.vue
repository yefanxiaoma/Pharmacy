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
  <div style="background-color: #f9f9f9;">
    <el-button type="primary" @click="add" style="margin-top: 10px;margin-bottom: 10px"><i class="el-icon-plus" style="margin-right: 5px"></i>新增收货地址</el-button>
    <div v-if="tableData && tableData.length" class="address_container">
      <div v-for="item in tableData" :key="item.id" class="item">
        <div class="name">{{ item.username }} 收</div>
        <div class="location">所在地区：{{ item.province }} {{ item.city }} {{ item.district }}</div>
        <div class="detail">详细地址：{{ item.detail }}</div>
        <div class="phone">联系手机：{{ item.mobile }}</div>
        <div style="margin-top: 20px">
          <el-button style="width: 150px;height: 40px" type="success" @click="mod_user(item)">编辑</el-button>
          <el-popconfirm style="margin-left: 5px"
                         title="确定删除吗?"
                         @confirm="delete_Address(item.id)"
          >
            <el-button slot="reference" style="width: 150px;height: 40px" type="danger" >删除</el-button>
          </el-popconfirm>
            </div>
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
    </el-main>
  </el-container>
</template>

<script>
import { regionData, CodeToText } from "element-china-area-data";
import ReturnHome from "@/components/ReturnHome.vue";
import Header from "@/components/Header.vue";
import Aside from "@/components/Aside.vue";
import Footer from "@/components/Footer.vue";
export default {
  name:"UserAddress",
  components: {Footer, Aside, Header, ReturnHome},
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
    this.loadPost()
  },
  methods: {
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
    handleChange(value) {
      //运用了CodeToText把编码转成了中文
      this.form.province = CodeToText[value[0]]
      this.form.city = CodeToText[value[1]]
      this.form.district = CodeToText[value[2]]
    },
  },
  created() {
    this.init()
    this.form.userId = this.user.id;
  },
}
</script>

<style scoped>
.address_container {
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  width: 800px;
  height: 800px;
  display: flex;
  flex-direction: column; /* 设置为垂直方向排列 */
}
.item {
  margin-bottom: 15px;
  padding: 15px;
  background-color: #ffffff;
  border: 1px solid #dcdcdc;
  border-radius: 5px;
  width: 100%; /* 宽度设置为100%以适应父容器 */
  height: auto; /* 高度自动适应内容 */
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