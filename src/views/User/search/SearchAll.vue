<template>
  <el-container>
    <el-header style="padding: 0; margin: 0; height: 56px">
      <Header></Header>
    </el-header>
    <div style="display: flex; justify-content: center;align-items: center;height: 150px;width: 100%">
      <div>
        <el-image
            style="width: 310px; height: 90px;"
            :src="require('@/image/jianke_logo.jpg')"
            fit="cover"
        ></el-image>
      </div>
      <!-- 搜索框-->
      <div>
        <el-input v-model="name" placeholder="请输入相关内容"
                  suffix-icon="el-icon-search" type="text"
                  style="width: 400px;margin-left: 15px;
                border: 2px solid deepskyblue;"></el-input>
        <el-button type="primary" style="width: 100px;height: 45px;border:0;border-radius:0;
      background-color: deepskyblue !important;"
                   @click="search">搜索</el-button>
      </div>
    </div>
    <div style="background-color: #409EFF; height: 40px; width: 100%; display: flex; justify-content: space-between; align-items: center;">
      <div style="color: white;margin-left: 20px">
        全部结果: "<span style="color: red">{{this.name}}</span>"
      </div>
      <div style="text-align: right; color: white;margin-right: 20px">
        <router-link to="/" style="text-decoration: none; color: white; padding-right: 20px;">首页</router-link>
        共计 <span style="color: red">{{this.total}}</span> 件药品
      </div>
    </div>

    <el-main>
   <div style="display: flex; align-items: center;justify-content: center;background-color: aquamarine">
    <div v-if="tableData && tableData.length" class="container">
      <div v-for="item in tableData" :key="item.id" class="item">
        <template v-if="item.stockQuantity > 0">
        <router-link :to="`/drugdetail/${item.id}`" style="text-decoration: none">
          <div style="display: flow">
            <div>
              <img :src="require(`@/image/${item.image}`)" class="item_image" alt="药品展示">
            </div>
            <div class="img_box">
              <h3>{{ item.genericName }}</h3>
              <br>
              <p>价格 : {{item.price}}元</p>
            </div>
          </div>
        </router-link>
        </template>
        <template v-else>
      <span style="cursor: not-allowed; opacity: 0.5;">
        <div style="display: flow">
          <div>
            <img :src="require(`@/image/${item.image}`)" class="item_image" alt="药品展示">
          </div>
          <div class="img_box">
            <h3>{{ item.genericName }}</h3>
            <p>价格 : {{ item.price }}元</p>
            <p style="color: red;">库存不足</p> <!-- 添加库存不足的提示 -->
          </div>
        </div>
      </span>
        </template>
      </div>
    </div>
   </div>
  <div style="display: flex; justify-content: center;">
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[4, 8, 16, 32]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
    </el-pagination>
  </div>
      <Footer></Footer>
    </el-main>
  </el-container>
</template>

<script>
import Header from "@/components/Header.vue";
import Search from "@/components/Search.vue";
import Footer from "@/components/Footer.vue";

export default {
  name:"SearchAll",
  components: {Footer, Search, Header},
  data(){
    return{
      name:'',
      tableData:[],
      pageSize:4,
      pageNum:1,
      total:0,
    }
  },
  mounted() {
    this.loadPost();
  },
  methods: {
    //加载数据、查询
    loadPost() {
      this.$axios.post(this.$HttpUrl+"/medication/listPage", {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        param: {
          name: this.name,
        }
      }).then(res => res.data)
          .then(res => {
            if (res.code === 200) {
              this.tableData = res.data;
              console.log(this.tableData)
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
    search() {
      // 检查输入框是否为空
      if (!this.name.trim()) {
        // 设置默认值
        this.name = '感冒灵颗粒';
        // 跳转到 SearchAll.vue，并传递输入的内容
        this.$router.push({ name: 'SearchAll', query: { name: this.name } });
        this.loadPost()
      }else {
      // 跳转到 SearchAll.vue，并传递输入的内容
      this.$router.push({ name: 'SearchAll', query: { name: this.name } });
      this.loadPost()
      }
    },
  },
  created() {
    this.name = this.$route.query.name;
  }
}
</script>


<style scoped>
.container {
  display: grid;
  width: 100%;
  max-width: 1300px;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
  padding: 10px;
  box-sizing: border-box;
  margin-left: 85px;
}
.item {
  width: 300px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}
.item_image{
  width: 100%;
  height: 300px;
  object-fit: cover;
}
.img_box {
  width: 100%;
  height: 80px;
  background-color: aliceblue;
  text-align: center;
}
p{
  margin: 0;
  color: red;
}
</style>