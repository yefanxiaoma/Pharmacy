<template>
  <el-container>
    <el-header height="80px" style="background-color: #409EFF">
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
        <router-link to="/Orders" style="text-decoration: none;color: white;margin-left: 50px">返回首页</router-link>
      </div>
    </div>
    </el-header>
    <div style="display: flex;flex-direction: column;align-items: center;justify-content: center;margin-top: 10px">
      <div style="width: 1000px">
        <div v-if="addressTableData && addressTableData.length" class="address_container">
          <div v-for="item in addressTableData" :key="item.id" class="item">
            <div class="name">收货人名：{{ item.username }}</div>
            <div class="location">所在地区：{{ item.province }} {{ item.city }} {{ item.district }}</div>
            <div class="detail">详细地址：{{ item.detail }}</div>
            <div class="phone">联系手机：{{ item.mobile }}</div>
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
      </div>
    </div>
  </el-container>
</template>

<script>
export default {
  name:"OrderShow",
  data(){
    return{
      form:{},
      tableData:[],
      addressTableData:[],
      orderId:'',
      status:'',
      useraddressId:'',
      AlltotalPrice:0,
    }
  },
  mounted() {
    this.orderId = this.$route.query.orderId;
    this.status = this.$route.query.status;
    this.loadPost()
    this.AddressloadPost()
  },
  methods:{
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
  },
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