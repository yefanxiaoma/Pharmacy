<template>
  <el-container>
    <el-header style="height: 56px">
      <Header></Header>
    </el-header>
    <ReturnHome></ReturnHome>
    <el-main style="padding: 20px 0 20px">
  <div>
    <div class="sidebar">
      <div>
        <el-button style="color: white" type="text" @click="goToOrderInfo"><h2>全部订单</h2></el-button>
      <el-button style="color: white" type="text" @click="fetchOrders('待付款')">待付款(<span style="color: red">{{pendingPaymentCount}}</span>)</el-button>
      <el-button style="color: white" type="text" @click="fetchOrders('待发货')">待发货(<span style="color: red">{{pendingShipmentCount}}</span>)</el-button>
      <el-button style="color: white" type="text" @click="fetchOrders('待收货')">待收货(<span style="color: red">{{pendingReceiptCount}}</span>)</el-button>
      <el-button style="color: white" type="text" @click="fetchOrders('待评价')">待评价(<span style="color: red">{{pendingReviewCount}}</span>)</el-button>
    </div>
    </div>

    <div style="display: flex;align-items: center;justify-content: center">
      <div style="height: 500px;width: 200px">
      <Aside></Aside>
      </div>
    <div style="width: 1000px">
      <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%">
        <el-table-column
            label="下单人"
            width="100">
            {{ this.user.name || this.user.userno }}
        </el-table-column>
        <el-table-column
            prop="status"
            label="订单状态"
            width="100">
        </el-table-column>
        <el-table-column
            prop="orderDate"
            label="下单时间"
            width="300px">
        </el-table-column>
        <el-table-column
            prop="totalPrice"
            label="订单金额（元）"
        width="200px">
        </el-table-column>
        <el-table-column
            label="查看订单详情"
        width="200px">
          <template #default="scope">
            <el-button type="text" @click="viewOrderDetails(scope.row)">订单详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    </div>
 </div>
    </el-main>
    <el-footer>
      <Footer></Footer>
    </el-footer>
  </el-container>
</template>

<script>
 import Header from "@/components/Header.vue";
 import ReturnHome from "@/components/ReturnHome.vue";
 import Footer from "@/components/Footer.vue"
 import Aside from "@/components/Aside.vue";
 export default {
   name:"OrderInfo",
   components: {Aside, ReturnHome, Header,Footer},
   data(){
     return{
       tableData:[],
       status:''
     }
   },
   mounted() {
     this.loadPost()
   },
   computed: {
     pendingPaymentCount() {
       return this.tableData.filter(order => order.status === '待付款').length;
     },
     pendingShipmentCount() {
       return this.tableData.filter(order => order.status === '待发货').length;
     },
     pendingReceiptCount() {
       return this.tableData.filter(order => order.status === '待收货').length;
     },
     pendingReviewCount() {
       return this.tableData.filter(order => order.status === '待评价').length;
     },
   },
   methods:{
     loadPost(){
       const formatOrderDate = (orderDate) => {
         const date = new Date(orderDate);
         const year = date.getFullYear();
         const month = date.getMonth() + 1;
         const day = date.getDate();
         const hours = String(date.getHours()).padStart(2, '0');
         const minutes = String(date.getMinutes()).padStart(2, '0');
         const seconds = String(date.getSeconds()).padStart(2, '0');
         return `${year}年${month}月${day}日${hours}:${minutes}:${seconds}`;
       };

       this.$axios.post(this.$HttpUrl+"/orders/list",{ id: this.user.id }).then(res=>res.data)
           .then(res=>{
             /* 如果有数据就存到tableData*/
             if(res.code === 200){
               this.tableData = res.data;
               this.tableData.forEach(item => {
                 item.orderDate = formatOrderDate(item.orderDate);
               });
             }
           }).catch(error=>{
         console.error('数据获取失败',error)
       })
     },
     fetchOrders(status) {
       const formatOrderDate = (orderDate) => {
         const date = new Date(orderDate);
         const year = date.getFullYear();
         const month = date.getMonth() + 1;
         const day = date.getDate();
         const hours = String(date.getHours()).padStart(2, '0');
         const minutes = String(date.getMinutes()).padStart(2, '0');
         const seconds = String(date.getSeconds()).padStart(2, '0');
         return `${year}年${month}月${day}日${hours}:${minutes}:${seconds}`;
       };
       this.status = status; // 更新状态
       this.$axios.post(this.$HttpUrl + "/orders/listType", {
         userId: this.user.id,
         status: this.status
       }).then(res => res.data)
           .then(res => {
             /* 如果有数据就存到tableData */
             if (res.code === 200) {
               this.tableData = res.data;
               this.tableData.forEach(item => {
                 item.orderDate = formatOrderDate(item.orderDate);
               });
             }
           }).catch(error => {
         console.error('数据获取失败', error);
       });
     },
     viewOrderDetails(order) {
       this.$router.push({
             path: '/orders/orderdetail',
             query: {
               orderId: order.orderId,
               status:order.status,
             },
           });
     },
     init() {
       this.user = JSON.parse(sessionStorage.getItem('CurUser'));
     },
     goToOrderInfo(){
       this.$router.push('/orders/orderinfo');
       this.loadPost();
     },
   },
   created() {
     this.init()
   },
 }
</script>

<style scoped>
.sidebar{
  display: flex;
  height: 60px;
  width: 100%;
  align-items: center;
  justify-content: center;
  background-color: #409EFF;
}
</style>