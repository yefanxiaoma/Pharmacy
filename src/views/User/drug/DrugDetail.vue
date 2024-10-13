<template>
  <el-container style="display: flex;height: 100%">
    <el-header style="padding: 0; margin: 0; height: 56px">
      <Header></Header>
    </el-header>

    <el-main style="padding: 0;">
      <div>
        <Search></Search>
      </div>
      <div style="width: 100%;height: 40px;background-color: dodgerblue;text-align: center;">
        <router-link to="/" style="text-decoration: none;color: white">回到首页</router-link>
      </div>

      <div v-if="tableData && tableData.length" style="background-color: aquamarine">
        <div v-for="item in tableData" :key="item.id" class="item-container">
          <div class="item-image">
            <!-- 药品图片 -->
            <img :src="require(`@/image/${item.image}`)" class="item_image" :alt="item.name">
          </div>
          <div class="item-details">
            <!-- 药品介绍 -->
            <div class="items">通用名: {{ item.genericName }}</div>
            <div class="itemss">药剂类型: {{ item.dosageForm }}</div>
            <div class="itemss">服用方法: {{ item.routeOfAdministration }}</div>
            <div class="itemss">保质期: {{ item.expiryDate }}</div>
            <div class="itemss">主要原料: {{ item.description }}</div>
            <div class="itemss">主要作用: {{ item.power }}</div>
            <div class="itemPrice">价格: ￥{{ item.price }}</div>

            <el-input-number v-model="num" @change="handleChange" :min="1" :max="200"  class="item-quantity"></el-input-number>

            <div class="button-container">
              <el-button type="danger" style="width: 200px;" @click="dialogBuy">立即购买</el-button>
              <el-button type="primary" style="width: 200px;" @click="addToCart(item)">加入购物车</el-button>
            </div>
          </div>
          <el-dialog
              title="您确定要购买吗？"
              :visible.sync="DialogVisible"
              width="400px"
              center>
          <span slot="footer" class="dialog-footer">
            <el-button @click="DialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="toBuy(item)">确 定</el-button>
          </span>
          </el-dialog>
        </div>
      </div>
      <div v-else>
      <p>加载中或没有数据...</p>
    </div>

    </el-main>
    <el-footer>
      <Footer></Footer>
    </el-footer>
  </el-container>
</template>

<script>
import Header from "@/components/Header.vue";
import Search from "@/components/Search.vue";
import Footer from "@/components/Footer.vue"
export default {
  name:"DrugDetail",
  components: {Search, Header,Footer},
  props:['id'],
  data(){
    return{
      shoppingCart: [],
      tableData:[],
      multipleSelection: [],
      submits:[],
      orderId:'',
      totalPrice:'',
      DialogVisible:false,
      num:1,
    }
  },
  mounted() {
    this.loadPost();
    this.user = JSON.parse(sessionStorage.getItem('CurUser'));
    this.address = JSON.parse(sessionStorage.getItem('Address'));
  },
  methods:{
    loadPost(){
      this.$axios.post(this.$HttpUrl+"/medication/list",{ id: this.id }).then(res=>res.data)
          .then(res=>{
            /* 如果有数据就存到tableData*/
            if(res.code === 200){
              this.tableData = res.data;
            }
          }).catch(error=>{
        console.error('数据获取失败',error)
      })
    },
    handleChange(value) {
    },
    doMod(item){
      this.$axios.post(this.$HttpUrl+"/shoppingcart/update", {
        userId: this.user.id,
        medicationId: item.id,
        quantity: this.num,
      }).then(res => res.data)
          .then(res => {
            if (res.code === 200) {
              this.$message({message: "添加成功!", type: 'success'})
              this.loadPost()
            } else {
              this.$message({message: "添加失败!", type: 'error'})
            }
          })
    },
    dosumbit(item){
        this.$axios.post(this.$HttpUrl + "/orderItems/submit", {
          orderId:this.orderId,
          medicationId:item.id,
          quantity:this.num,
          price:item.price,
          totalPrice:this.totalPrice
        }).then(res=>res.data).then(res=>{
          if(res.code === 200){
            this.$message.success('您已提交订单，请去支付')
            this.$router.push("/orders/orderinfo")
          }
        }).catch(error=>{
          this.$message.error('数据上传失败')
        })
    },
    dialogBuy(){
      this.DialogVisible = true
    },
    toBuy(item){
       this.totalPrice = this.num * item.price;
      if (this.address == null) {
        this.$message.warning("请先设置默认一个地址");
      } else {
        this.$axios.post(this.$HttpUrl + "/orders/submit", {
          userId: this.user.id,
          status: '待付款',
          totalPrice: this.totalPrice,
          useraddressId: this.address.id
        }).then(res => res.data).then(res => {
          if (res.code === 200) {
            this.orderId = res.data;
            this.dosumbit(item);
          }
        }).catch(error => {
          this.$message.error('提交订单失败')
        })
      }
    },
    doSave(item){
      const totalPrice = this.num * item.price;
      // 保存购物车
      this.$axios.post(this.$HttpUrl + "/shoppingcart/save", {
        userId: this.user.id,
        medicationId: item.id,
        medicationName: item.name,
        medicationImage: item.image,
        quantity: this.num,
        price: item.price,
        totalPrice:totalPrice
      }).then(res => res.data)
          .then(res => {
            if (res.code === 200) {
              this.$message({message: "添加成功!", type: 'success'})
              this.loadPost()
            } else {
              this.$message({message: "添加失败!", type: 'error'})
            }
          }).catch(error => {
        console.error("Error saving cart:", error);
        this.$message({ message: "添加失败!", type: 'error' });
      });
    },
    addToCart(item) {
      if(this.user == null){
        this.$message.warning("请先登录")
      }
      else {
      this.$axios.post(this.$HttpUrl+"/shoppingcart/findId",{medicationId:item.id,userId:this.user.id}).then(res=>res.data)
          .then(res=> {
            if (res.code === 200) {
              /*
        * 如果已经加入购物车,重复添加只需要更改数量*/
              this.doMod(item);
            } else {
              // 如果未加入购物车, 添加新的购物车项
             this.doSave(item);
            }
          })
          .catch(error => {
            this.$message.error('添加失败');
          });
    }
    },
  }
}
</script>

<style scoped>
.item-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}
.item-image {
  margin-right: 20px;

}
.item_image {
  width: 400px;
  height: 450px;
}

.item-details {
  width: 500px;
}

.item-quantity {
  margin-top: 10px;
}

.button-container {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}
.items{
  width: 400px;
  font-size: 30px;
}
.itemss{
  width: 400px;
  font-size: 15px;
  margin-top: 8px;
}
.itemPrice{
  margin-top: 10px;
  color: red;
  font-size: 20px;
}
</style>