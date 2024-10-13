<template>
<div style="display: flex; flex-direction: column;align-items: center;">
  <div class="lunbotu_main">
    <div style="display:flow;width: 250px;">
      <div style="background-color: deepskyblue;height: 40px;display: flex; align-items: center; justify-content: center;">
        全部产品分类
      </div>
      <div v-if="tableDataType && tableDataType.length" style="background-color: black;height: 360px">
        <div v-for="item in tableDataType" :key="item.id" class="items">
          <dl>
            <dt @click="typeShow(item.typeName)">
              {{item.typeName}}
            </dt>
          </dl>
        </div>
      </div>
    </div>
    <!-- 轮播图-->
    <div class="block" style=";margin: 0;padding: 0;">
      <el-carousel height="400px" style="width: 1000px">
        <el-carousel-item v-for="(image, index) in images" :key="index">
          <el-image :src="image" alt="轮播图" style="width: 100%; height: 100%; object-fit: cover;"></el-image>
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
  <!-- 药品展示-->
  <div style="width: 1400px;">
    <dl>
      <dt style="font-family: 'Microsoft YaHei',serif;margin-left: 100px;font-size: 30px;font-weight: bold">
        药品展示
      </dt>
      <dd>
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
                    <p>价格 : {{ item.price }}元</p>
                  </div>
                </div>
              </router-link>
            </template>
            <template v-else>
      <span style="cursor: not-allowed; opacity: 0.5;">
        <div style="display: flow">
          <div>
            <el-image :src="require(`@/image/${item.image}`)" class="item_image" alt="药品展示" lazy></el-image>
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

      </dd>
    </dl>
  </div>
  <div style="display: flex; justify-content: center;">
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[4, 8]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
    </el-pagination>
  </div>
  <!-- 热销药品-->
  <div style="width: 1400px;">
    <dl>
      <dt style="font-family: 'Microsoft YaHei',serif;margin-left: 100px;font-size: 30px;font-weight: bold;color: red">
       Top 热销药品
      </dt>
      <dd>
        <div v-if="hotData && hotData.length" class="container">
          <div v-for="item in hotData" :key="item.id" class="item">
            <template v-if="item.stockQuantity > 0">
              <router-link :to="`/drugdetail/${item.id}`" style="text-decoration: none">
                <div style="display: flow">
                  <div>
                    <img :src="require(`@/image/${item.image}`)" class="item_image" alt="药品展示">
                  </div>
                  <div class="img_box">
                    <h3>{{ item.genericName }}</h3>
                    <br>
                    <p>价格 : {{ item.price }}元</p>
                  </div>
                </div>
              </router-link>
            </template>
            <template v-else>
      <span style="cursor: not-allowed; opacity: 0.5;">
        <div style="display: flow">
          <div>
            <el-image :src="require(`@/image/${item.image}`)" class="item_image" alt="药品展示" lazy></el-image>
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

      </dd>
    </dl>
  </div>
  <div style="display: flex; justify-content: center;">
    <el-pagination
        @size-change="hotSizeChange"
        @current-change="hotCurrentChange"
        :current-page="hotNum"
        :page-sizes="[4]"
        :page-size="hotSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="hotDatatotal">
    </el-pagination>
  </div>
  </div>
</template>

<script>

export default {
  name: "Main",
  data() {
    return {
      tableDataType: [],
      tableData: [],
      hotData:[],
      pageSize: 4,
      pageNum: 1,
      hotSize: 4,
      hotNum: 1,
      total: 0,
      hotDatatotal:4,
      images: [
        require('@/image/shenbaopian.jpg'),
        require('@/image/erchenwan.jpg'),
        require('@/image/fufangejiao.jpg')
      ]
    };
  },
  mounted() {
    this.loadPost();
    this.loadPostType()
    this.loadPostHot()
  },
  methods: {
    /*
   * 加载热门药品
   * */
    loadPostHot() {
      this.$axios.post(this.$HttpUrl + "/medication/hotPage", {
        hotSize: this.hotSize,
        hotNum: this.hotNum,
        param: {
          name: this.name
        }
      }).then(res => res.data).then(res => {
        if (res.code === 200) {
          this.hotData = res.data;
        }
      }).catch(error => {
        console.error('数据获取失败', error)
      })
    },
    //分页功能
    hotSizeChange(val) {
      //切换时候保证页数跳转到1
      this.hotNum = 1
      this.hotSize = val
      this.loadPost()
    },
    hotCurrentChange(val) {
      this.hotNum = val
      this.loadPost()
    },
    /*
    * 加载药品
    * */
    loadPost() {
      this.$axios.post(this.$HttpUrl + "/medication/listPage", {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        param: {
          name: this.name
        }
      }).then(res => res.data).then(res => {
        if (res.code === 200) {
          this.tableData = res.data;
          this.total = res.total
        }
      }).catch(error => {
        console.error('数据获取失败', error)
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
    /*
   * 加载药品类型
   * */
    loadPostType() {
      this.$axios.get(this.$HttpUrl + "/medicationtype/list").then(res => res.data).then(res => {
        if (res.code === 200) {
          this.tableDataType = res.data;
        }
      }).catch(error => {
        console.error('数据获取失败', error)
      })
    },
    typeShow(typename) {
      // 跳转到 TypeShow.vue，并传递输入的内容
      this.$router.push({name:'TypeShow', query: {name: typename}});
    },
  },
}
</script>

<style>
.el-input{
  margin: 0; padding: 0;
}
.el-button{
  padding: 0;
}
.lunbotu_main{
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  width: 1400px;
  margin-left: 50px;
}
.items {
  width: 250px;
}
.items dl {
  padding: 10px; /* 给 dl 添加内边距 */
  margin: 0;
  background-color: black; /* 默认背景色 */
  transition: background-color 0.3s, color 0.3s, transform 0.3s; /* 平滑过渡效果 */
  display: flex;
}
.items dt{
  color: lightgray; /* 默认文字颜色 */
  margin: 0;
  transition: color 0.3s, transform 0.3s; /* 平滑过渡效果 */
}
.items:hover dl {
  background-color: white; /* 鼠标移入时背景色 */
}

.items:hover dt {
  color: black; /* 鼠标移入时文字颜色 */
  transform: translateX(10px); /* 鼠标移入时文字右移10px */
}
.el-carousel img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover; /* Adjust image to cover the area */
}
.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}
.container {
  display: grid;
  width: 100%;
  max-width: 1300px;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
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