<template>
  <el-container>
    <el-header style="height: 56px">
      <Header></Header>
    </el-header>
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
        <router-link to="/orders/orderinfo" style="text-decoration: none;color: white">返回订单</router-link>
        <router-link to="/" style="text-decoration: none;color: white;margin-left: 50px">首页</router-link>
      </div>
    </div>

  <div style="display: flex;flex-direction: column;align-items: center;justify-content: center;margin-top: 10px">
    <div style="width: 1000px">
      <div v-if="addressTableData && addressTableData.length" class="address_container">
        <div v-for="item in addressTableData" :key="item.id" class="item">
          <div class="name">收货人名：{{ item.username }}</div>
          <div class="location">所在地区：{{ item.province }} {{ item.city }} {{ item.district }}</div>
          <div class="detail">详细地址：{{ item.detail }}</div>
          <div class="phone">联系手机：{{ item.mobile }}</div>
          <el-button type="text" @click="selectedAddress" :disabled="ifShow">修改地址</el-button>
        </div>
      </div>
    </div>
  <div style="width: 1000px;">
    <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        >
      <el-table-column
          label="商品信息"
          width="400px"
      >
        <template #default="scope">
          <div style="display: flex; align-items: center;">
            <el-image
                :src="require(`@/image/${scope.row.image}`)"
                style="width: 80px; height: 80px; margin-right: 10px;">
            </el-image>
            <span>{{ scope.row.name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
          prop="price"
          label="单价（元）"
          width="100">
      </el-table-column>
      <el-table-column
          prop="quantity"
          label="数量">
      </el-table-column>
      <el-table-column
          prop="totalPrice"
          label="小计（元）">
      </el-table-column>
    </el-table>
    <div style="margin-top: 20px;margin-left: auto">
      <el-button
          v-if="this.status === '待付款'"
          style="width: 100px;"
          type="primary"
          @click="handlePayment"
      >付款</el-button>
      <el-button
          v-else-if="this.status === '待收货'"
          style="width: 100px;"
          type="primary"
          @click="confirmReceipt"
      >确定收货</el-button>

      <span v-else-if="this.status === '待发货'">等待商家发货</span>
      <span v-else>感谢您的支持</span>
    </div>
  </div>
  </div>
    <el-dialog
        style="margin-top: 100px"
        title="选择支付方式"
        :visible.sync="centerDialogVisible"
        width="700px"
        center>
      <el-form ref="form" :model="form" label-width="80px">
        <div class="payment-options">
          <el-image
              v-for="(option, index) in paymentOptions"
              :key="index"
              :src="option.imageUrl"
              :alt="option.name"
              :style="{ cursor: 'pointer', border: selectedPayment === option.name ? '2px solid #409EFF' : 'none' }"
              @click="selectPayment(option.name)"
          ></el-image>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button @click="centerDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </span>
    </el-dialog>
    <el-dialog
        style="margin-top: 100px"
        title="确定收货"
        :visible.sync="DialogVisible"
        width="700px"
        center>
      <div style="text-align: center">
        <h2>已收到商品，是否确定收货？</h2>
      </div>
       <span slot="footer" class="dialog-footer">
      <el-button @click="DialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="confirmed">确 定</el-button>
    </span>
    </el-dialog>
    <el-dialog
        title="选择收货地址"
        :visible.sync="AddDialogVisible"
        width="850px"
        center>
      <el-table
          :data="address"
          style="width: 100%">
        <el-table-column
            prop="username"
            label="姓名"
            width="120">
        </el-table-column>
        <el-table-column
            prop="mobile"
            label="手机号码"
            width="150">
        </el-table-column>
        <el-table-column
            prop="province"
            label="省份"
            width="120">
        </el-table-column>
        <el-table-column
            prop="city"
            label="城市"
            width="120">
        </el-table-column>
        <el-table-column
            prop="district"
            label="区/县"
            width="120">
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button
                @click="selectAddress(scope.row.id)"
                type="primary"
                size="small">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="AddDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
        title="你确定要修改地址吗？"
        :visible.sync="Visible"
        width="400px"
        center>
      您还可以修改的次数为:{{this.number}}
      <span slot="footer" class="dialog-footer">
        <el-button @click="Visible = false">取 消</el-button>
        <el-button @click="changeAddress" type="primary">确定</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import Header from "@/components/Header.vue";

export default {
  name:"OrderDetail",
  components: {Header},
  data(){
    return{
      form:{},
      numberData:[],
      tableData:[],
      addressTableData:[],
      address:[],
      orderId:'',
      status:'',
      number:0,
      useraddressId:'',
      AlltotalPrice:0,
      AddDialogVisible:false,
      centerDialogVisible: false,
      DialogVisible:false,
      Visible:false,
      AddressSelected:null,
      selectedPayment: '', // 记录选择的支付方式
      paymentOptions: [
        { name: '支付宝', imageUrl: require('@/image/支付宝支付.png') },
        { name: '微信支付', imageUrl: require('@/image/微信支付.jpg') },
      ],
    }
  },
  mounted() {
    this.user = JSON.parse(sessionStorage.getItem('CurUser'));
    this.loadPost()
    this.AddressloadPost()
    this.loadPostNumber()
  },
    computed: {
      ifShow() {
        // 计算属性，根据状态和 number 返回布尔值
        return this.status === '待收货' || this.status === '待评价';
      }
  },
  methods:{
    loadPostNumber(){
      this.$axios.post(this.$HttpUrl+"/orders/listnumber",{ orderId: this.orderId }).then(res=>res.data)
          .then(res=>{
            /* 如果有数据就存到tableData*/
            if(res.code === 200){
              this.numberData = res.data;
              this.number = this.numberData[0].number
            }
          }).catch(error=>{
        console.error('数据获取失败',error)
      })
    },
    loadPost(){
      this.$axios.post(this.$HttpUrl+"/orderItems/list",{orderId:this.orderId}).then(res=>res.data).then(res=>{
        if(res.code === 200){
          this.tableData = res.data
        }
      }).catch(error=>{
        console.log('获取数据失败',error)
      })
    },
    AddressloadPost(){
      this.$axios.post(this.$HttpUrl+"/orders/listAddress",{orderId:this.orderId}).then(res=>res.data).then(res=>{
        if(res.code === 200){
          this.addressTableData = res.data
        }
      }).catch(error=>{
        console.log('获取数据失败',error)
      })
    },
    handlePayment() {
      this.centerDialogVisible = true
    },
    confirmReceipt(){
      this.DialogVisible = true
    },
    selectPayment(paymentName) {
      this.selectedPayment = paymentName;
    },
    save(){
      this.$axios.post(this.$HttpUrl + "/orders/update?id="+this.orderId,
      ).then(res=>res.data).then(res=>{
        if (res.code === 200){
          this.$message.success('支付成功')
          this.centerDialogVisible = false
          this.$router.push('/orders/orderinfo');
        }
      }).catch(error=> {
        this.$message.error('付款失败')
      })
    },
    confirmed(){
      this.$axios.post(this.$HttpUrl + "/orders/updates?id="+this.orderId,
      ).then(res=>res.data).then(res=>{
        if (res.code === 200){
          this.$message.success('收货成功')
          this.DialogVisible = false
          this.$router.push('/orders/orderinfo');
        }
      }).catch(error=> {
        this.$message.error('收货失败')
      })
    },
    selectedAddress(){
      if(this.number>0) {
        this.$axios.post(this.$HttpUrl + "/userAddress/list", {id: this.user.id}).then(res => res.data)
            .then(res => {
              /* 如果有数据就存到tableData*/
              if (res.code === 200) {
                this.address = res.data;
                this.AddDialogVisible = true
              }
            }).catch(error => {
          console.error('数据获取失败', error)
        })
      }else {
        this.$message.error('您已经无修改地址次数')
      }
    },
    selectAddress(addressId) {
      this.Visible = true;
      this.AddressSelected = addressId
    },
    changeAddress(){
      this.number = this.number-1;
      this.$axios.post(this.$HttpUrl+"/orders/changeAddress",{orderId:this.orderId,useraddressId:this.AddressSelected,number:this.number})
          .then(res=>res.data).then(res=>{
           this.$message.success('修改地址成功')
           this.Visible = false
           this.AddDialogVisible = false
           window.location.reload()
      }).catch(error=>{
        this.$message.error('修改失败')
      })
    }
  },
  created() {
    this.orderId = this.$route.query.orderId;
    this.status = this.$route.query.status;
  }
}
</script>

<style scoped>
.payment-options {
  display: flex;
  justify-content: space-between; /* 横向排列 */
  margin-bottom: 20px;
}
.el-image {
  width: 300px; /* 设置图片宽度 */
  height: 200px; /* 设置图片高度 */
}
.address_container {
  padding: 20px;
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  height: auto; /* 根据内容自动调整高度 */
  display: flex;
  flex-direction: column; /* 垂直排列 */
  align-items: flex-start; /* 左对齐 */
  margin: 0 auto; /* 居中容器 */
  max-width: 600px; /* 最大宽度限制 */
}

.item {
  padding: 15px;
  border: 1px solid #e0e0e0; /* 为每个地址项增加边框 */
  border-radius: 5px;
  margin-bottom: 15px; /* 项之间的间距 */
  width: 100%; /* 宽度占满父容器 */
  background-color: #ffffff; /* 背景色 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 添加阴影 */
}

.name, .location, .detail, .phone {
  margin-bottom: 5px; /* 文本项之间的间距 */
  font-size: 14px; /* 文本大小 */
  color: #333; /* 文本颜色 */
}

</style>