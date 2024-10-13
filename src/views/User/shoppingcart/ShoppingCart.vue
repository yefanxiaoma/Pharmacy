<template>
  <el-container style="display: flex;height: 100%">
    <el-header style="padding: 0; margin: 0; height: 56px">
      <Header></Header>
    </el-header>
    <el-main style="padding: 0">
      <ReturnHome></ReturnHome>
  <div style="display: flex;flex-direction: column;align-items: center;justify-content: center;margin-top: 10px">
    <el-steps :active="number" align-center style="width: 500px;">
      <el-step title="选择产品"></el-step>
      <el-step title="填写核对订单信息"></el-step>
      <el-step title="完成订单"></el-step>
    </el-steps>
    <div style="width: 1000px">
      <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange">
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column
            label="商品信息"
            width="400px"
        >
          <template #default="scope">
            <div style="display: flex; align-items: center;">
              <el-image
                  :src="require(`@/image/${scope.row.medicationImage}`)"
                  style="width: 80px; height: 80px; margin-right: 10px;">
              </el-image>
              <span>{{ scope.row.medicationName }}</span>
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
        <el-table-column
            prop="operate"
            label="操作">
          <template #default="scope">
            <el-popconfirm style="margin-left: 5px"
                           title="确定删除吗?"
                           @confirm="delete_cart(scope.row.cartId)"
            >
              <el-button slot="reference" style="width: 70px;" type="danger" >删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 20px;display: flex">
        <el-button type="primary" @click="allSelection">全选</el-button>
        <div style="margin-left: auto;">
          已选商品数量: <span style="color: red;font-weight: bold">{{ selectedCount }} </span>件
          总价:<span style="margin-left: 10px;color: red">￥{{ totalAmount }}</span>
        </div>
        <el-button type="primary" style="margin-left: auto;width: 150px" @click="selectedAddress">选择收获地址</el-button>
        <el-button type="success" style="width: 150px" @click="checkout">结算</el-button>
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
          title="选择收货地址"
          :visible.sync="DialogVisible"
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
                  @click="selectAddress(scope.row)"
                  type="primary"
                  size="small">选择</el-button>
            </template>
          </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
        <el-button @click="DialogVisible = false">取 消</el-button>
        <el-button type="primary" >确 定</el-button>
      </span>
      </el-dialog>
    </el-main>

  </el-container>
</template>

<script>
import Header from "@/components/Header.vue";
import ReturnHome from "@/components/ReturnHome.vue";

export default {
  name:"ShoppingCart",
  components: {ReturnHome, Header},
  data(){
    return{
      number:1,
      address:[],
      tableData:[],
      id:'',
      orderId:'',
      ids:[],
      multipleSelection: [],
      submits:[],
      allSelected:false,
      selectedCount: 0, // 新增选中商品数量
      totalAmount: 0,   // 新增小计之和
      form:{},
      centerDialogVisible:false,
      DialogVisible:false,
      selectedPayment: '', // 记录选择的支付方式
      AddressSelected:null,
      paymentOptions: [
        { name: '支付宝', imageUrl: require('@/image/支付宝支付.png') },
        { name: '微信支付', imageUrl: require('@/image/微信支付.jpg') },
      ],
    }
  },
  mounted() {
    this.user = JSON.parse(sessionStorage.getItem('CurUser'));
    this.loadPost();
  },
  methods: {
    loadPost() {
      this.id = this.user.id;
      this.$axios.post(this.$HttpUrl + "/shoppingcart/list", {id: this.id}).then(res => res.data)
          .then(res => {
            /* 如果有数据就存到tableData*/
            if (res.code === 200) {
              this.tableData = res.data;
            }
            else {
              this.$message.error('获取数据失败')
            }
          }).catch(error=>{
            this.$message.error('数据传入失败')
      })
    },
    allSelection(){
      this.allSelected = !this.allSelected;
      this.$refs.multipleTable.clearSelection(); // 清空之前的选中
      if (this.allSelected) {
        this.tableData.forEach(item => {
          this.$refs.multipleTable.toggleRowSelection(item, true);
        });
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      const selectedCount = val.length;
      const totalAmount = val.reduce((sum, item) => {
        return sum + item.totalPrice; // 假设每个item都有一个totalPrice属性
      }, 0).toFixed(2);
      this.selectedCount = selectedCount;
      this.totalAmount = parseFloat(totalAmount);
    },
    delete_cart(id) {
      this.$axios.get(this.$HttpUrl + "/shoppingcart/delete?id="+id).then(res=>res.data).then(res=>{
        if (res.code === 200) {
          this.$message({message: "操作成功!", type: 'success'})
          this.loadPost()
        } else {
          this.$message({message: "操作失败!", type: 'error'})
        }
      })
    },
    dosumbit(orderId){
      this.submits = [];
      // 遍历 multipleSelection，将每个选中的商品信息添加到 submits 数组中
      this.multipleSelection.forEach(item => {
        this.submits.push({
          orderId: orderId,
          medicationId: item.medicationId,
          quantity: item.quantity,
          price: item.price,
          totalPrice: item.totalPrice
        });
      });
      this.submits.forEach(submitData => {
        this.$axios.post(this.$HttpUrl + "/orderItems/submit", submitData)
      });
    },
    checkout(){
      if(this.selectedCount  > 0) {
        if (this.AddressSelected == null) {
          this.$message.warning("请先选择一个地址");
        } else {
          this.$axios.post(this.$HttpUrl + "/orders/submit", {
            userId: this.user.id,
            status: '待付款',
            totalPrice: this.totalAmount,
            useraddressId: this.AddressSelected.id
          }).then(res => res.data).then(res => {
            if (res.code === 200) {
              this.orderId = res.data;
              this.dosumbit(this.orderId);
              this.centerDialogVisible = true
              this.number = 2
              //清空已支付的药品
              this.clearCart();
            }
          }).catch(error => {
            this.$message.error('提交订单失败')
          })
        }
      }else {
        this.$message.warning("请先选择要购买的商品");
      }
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
          this.number = 3
        }
      }).catch(error=> {
        this.$message.error('付款失败')
      })
    },
    clearCart() {
      const idsToDelete = this.multipleSelection.map(item => item.cartId);
      if (idsToDelete.length > 0) {
        this.$axios.post(this.$HttpUrl + "/shoppingcart/deletecart", idsToDelete)
            .then(res => res.data).then(res => {
          if (res.code === 200) {
            this.loadPost(); // 重新加载购物车数据
          } else {
            this.$message.error('清空购物车失败');
          }
        }).catch(error => {
          this.$message.error('请求失败');
        });
      }
    },
    selectedAddress(){
      this.$axios.post(this.$HttpUrl+"/userAddress/list",{ id: this.user.id }).then(res=>res.data)
          .then(res=>{
            /* 如果有数据就存到tableData*/
            if(res.code === 200){
              this.address = res.data;
              this.DialogVisible = true
            }
          }).catch(error=>{
        console.error('数据获取失败',error)
      })
    },
    selectAddress(address) {
      this.AddressSelected = address; // 保存选中的地址
      console.log(this.AddressSelected)
      this.DialogVisible = false; // 关闭对话框
    },
  },
  computed:{

  },
}
</script>


<style scoped>
.cart-container {
  display: flex;
  flex-direction: column;
  padding: 20px;
  max-width: 600px;
  margin: auto;
}

.cart-item {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-bottom: 15px;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.item-details h3 {
  margin: 0;
  font-size: 1.2em;
}

.item-details p {
  margin: 5px 0 0;
  color: #666;
}
.payment-options {
  display: flex;
  justify-content: space-between; /* 横向排列 */
  margin-bottom: 20px;
}
.el-image {
  width: 300px; /* 设置图片宽度 */
  height: 200px; /* 设置图片高度 */
}
</style>