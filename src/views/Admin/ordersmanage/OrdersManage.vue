<template>
  <div>
    <div style="margin-bottom: 6px;width: 700px">
      <el-input v-model="name" placeholder="请输入订单状态" suffix-icon="el-icon-search" style="width: 250px;"
                @keyup.enter.native="loadPost" ></el-input>
      <el-button type="primary" style="margin-left: 5px" @click="loadPost">查询</el-button>
      <el-button type="success" @click="resetParam">重置</el-button>
    </div>
    <el-table :data="tableData"
              :header-cell-style="{background:'#c1bebe', color:'#555'}"
              border
    >
      <el-table-column prop="orderId" label="ID" width="100">
      </el-table-column>
      <el-table-column prop="userId" label="下单用户" width="150px" :formatter="formatUser">
      </el-table-column>
      <el-table-column prop="orderDate" label="下单时间" >
      </el-table-column>
      <el-table-column prop="status" label="订单状态" >
      </el-table-column>
      <el-table-column prop="totalPrice" label="订单总额" width="150px">
      </el-table-column>
      <el-table-column  label="订单详情" >
        <template #default="scope">
          <el-button type="text" @click="viewOrderDetails(scope.row)">订单详情</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="operate" label="操作" width="200px">
        <template #default="scope">
          <el-popconfirm style="margin-left: 5px"
                         title="确定发货吗?"
                         @confirm="confirmSend(scope.row.orderId)"
          >
            <el-button slot="reference" size="small" type="primary" v-if="scope.row.status === '待发货'" >商家发货</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div style="display: flex; justify-content: center;">
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[5, 10]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name:"OrdersManage",
  data() {
    return {
      tableData:[],
      userData:[],
      userAddress:[],
      pageSize:5,
      pageNum:1,
      total:0,
      name:"",
      status:''
    }
  },
  mounted(){
    this.loadPost();
    this.loadUser();
    this.loadUserAddress();
  },
  methods: {
    //加载数据、查询
    loadPost() {
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
      this.$axios.post(this.$HttpUrl+"/orders/listPage", {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        param: {
          name: this.name,
        }
      }).then(res => res.data)
          .then(res => {
            if (res.code === 200) {
              this.tableData = res.data;
              this.tableData.forEach(item => {
                item.orderDate = formatOrderDate(item.orderDate);
              });
              this.total = res.total
            }
          }).catch(error => {
        console.error('获取数据失败:', error)
      })
    },
    //分页功能
    handleSizeChange(val) {
      //切换时候保证页数跳转到1
      this.pageNum = 1
      this.pageSize = val
      this.loadPost()
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.loadPost()
    },
    //重置
    resetParam() {
      this.name = ''
    },
    loadUser(){
      this.$axios.get(this.$HttpUrl+"/user/listall"
      ).then(res => res.data)
          .then(res => {
            if (res.code === 200) {
              this.userData = res.data;
            }
          }).catch(error => {
        console.error('获取数据失败:', error)
      })
    },
    loadUserAddress(){
      this.$axios.post(this.$HttpUrl+"/userAddress/listPage", {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        param:{
            name: this.name,
          }
      }).then(res => res.data)
          .then(res => {
            if (res.code === 200) {
              this.userAddress = res.data;
            }
          }).catch(error => {
        console.error('获取数据失败:', error)
      })
    },
    viewOrderDetails(order) {
      this.$router.push({
        path: '/OrderShow',
        query: {
          orderId: order.orderId,
          status:order.status
        },
      });
    },
    confirmSend(orderId){
      this.$axios.post(this.$HttpUrl + "/orders/send?id="+orderId,
      ).then(res=>res.data).then(res=>{
        if (res.code === 200){
          this.$message.success('发货成功')
          this.loadPost()
        }
      }).catch(error=> {
        this.$message.error('收货失败')
      })
    },
    formatUser(row){
      let temp = this.userData.find(item=>{
        return item.id === row.userId
      })
      return temp && temp.name
    }
  }
};
</script>

<style >

</style>