<template>
  <div>
    <div style="margin-bottom: 6px;width: 900px">
      <el-input v-model="name" placeholder="请输入药品名字" suffix-icon="el-icon-search" style="width: 250px;margin-left: 5px;"
                @keyup.enter.native="loadPost" ></el-input>
      <el-button type="primary" style="margin-left: 5px" @click="loadPost">查询</el-button>
      <el-button type="success" @click="resetParam">重置</el-button>
      <el-button type="primary" style="margin-left: 10px" @click="add">新增</el-button>
    </div>
    <el-table :data="tableData"
              :header-cell-style="{background:'#c1bebe', color:'#555'}"
              border
    >
      <el-table-column prop="id" label="ID" width="50">
      </el-table-column>
      <el-table-column  label="药品图片" width="100">
        <template v-slot="scope">
          <img :src="require(`@/image/${scope.row.image}`)" alt="药品图片" style="width: 70px; height: 70px;" />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="药品名字" width="150">
      </el-table-column>
      <el-table-column prop="genericName" label="常用名" width="100">
      </el-table-column>
      <el-table-column prop="dosageForm" label="剂型" width="50">
      </el-table-column>
      <el-table-column prop="routeOfAdministration" label="服用方式" width="80">
      </el-table-column>
      <el-table-column prop="expiryDate" label="保质期" width="80">
      </el-table-column>
      <el-table-column prop="price" label="价格" width="80">
      </el-table-column>
      <el-table-column prop="stockQuantity" label="库存数量" width="80">
      </el-table-column>
      <el-table-column prop="description" label="主要原料">
      </el-table-column>
      <el-table-column prop="power" label="主要作用">
      </el-table-column>
      <el-table-column prop="operate" label="操作" width="150">
        <template #default="scope">
          <el-button size="small" type="success" @click="mod_medication(scope.row)">编辑</el-button>
          <el-popconfirm style="margin-left: 5px"
                         title="确定删除吗?"
                         @confirm="delete_medication(scope.row.id)"
          >
            <el-button slot="reference" size="small" type="danger" >删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div style="display: flex; justify-content: center;">
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[5, 10, 20, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </div>
  <el-dialog
      title="提示"
      :visible.sync="centerDialogVisible"
      width="30%"
      center>
    <el-form ref="form" :rules="rules" :model="form" label-width="150px">
      <el-form-item label="药品名字" prop="name">
        <el-col :span="20">
          <el-input v-model="form.name"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="常用名" prop="genericName">
        <el-col :span="20">
          <el-input v-model="form.genericName"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="剂型" prop="dosageForm">
        <el-col :span="20">
          <el-input v-model="form.dosageForm"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="服用方式" prop="routeOfAdministration">
        <el-col :span="20">
          <el-input v-model="form.routeOfAdministration"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="保质期" prop="expiryDate">
        <el-col :span="20">
          <el-input v-model="form.expiryDate"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="价格" prop="price">
        <el-col :span="20">
          <el-input v-model="form.price"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="库存" prop="stockQuantity">
        <el-col :span="20">
          <el-input v-model="form.stockQuantity"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="主要原材料" prop="description">
        <el-col :span="20">
          <el-input v-model="form.description"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="主要作用" prop="power">
        <el-col :span="20">
          <el-input v-model="form.power"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-upload
            class="upload-demo"
            :action="uploadUrl"
            :on-change="handleChange"
            :file-list="fileList"
            :headers="headerObj"
            list-type="picture"
            v-model="form.image"
        >
          <el-button style="height: 40px" size="small" type="primary">点击上传药品图片</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button @click="cancelUpload">取 消</el-button>
    <el-button type="primary" @click="confirmUpload">确 定</el-button>
  </span>
  </el-dialog>
  </div>
</template>

<script>
export default {
  name:"MedicationManage",
  data() {
    let checkDuplicate = (rule, value, callback) => {
      if (value>99999) {
        callback(new Error('输入数量过大'))
      }else if (value < 0) {
        callback(new Error('库存数量不能为负'))
      } else {
        callback();
      }
    }
    return {
      tableData:[],
      total:0,
      name:'',
      pageSize: 4,
      pageNum: 1,
      headerObj: {
        file:'',
        Authorization: window.sessionStorage.getItem("token"),
      },
      //1.配置要上传文件的路由
      uploadUrl: "http://localhost:3000/upload",
      fileList: [],
      form: {
        id: '',
        name: '',
        genericName:'',
        dosageForm:'',
        routeOfAdministration:'',
        expiryDate:'',
        price:'',
        stockQuantity:'',
        description:'',
        power:'',
        image:'',
      },
      centerDialogVisible:false,
      rules:{
        name:[{required:true,message:'请输入药品名字',trigger:'blur'}],
        genericName:[{required:true,message:'请输入药品常用名字',trigger:'blur'}],
        dosageForm:[{required:true,message:'请输入剂型',trigger:'blur'}],
        routeOfAdministration:[{required:true,message:'请输入服用方式',trigger:'blur'}],
        expiryDate:[{required:true,message:'请输入保质期',trigger:'blur'}],
        price:[{required:true,message:'请输入价格',trigger:'blur'}],
        stockQuantity:[{required:true,message:'请输入库存数量',trigger:'blur'},
          {validator: checkDuplicate, trigger: "blur"}],
      }
    };
  },
  mounted() {
    this.loadPost();
  },
  methods: {
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
    //重置
    resetParam() {
      this.no = ''
      this.name = ''
    },
    resetForm() {
      this.$refs.form.resetFields();
    },
    //新增
    add() {
      this.centerDialogVisible = true
      this.$nextTick(() => {
        this.resetForm() // 重置填写的信息
        this.form.id = ''
        this.form.image = ''
      })
    },
    //修改
    mod_medication(row) {
      this.centerDialogVisible = true
      this.$nextTick(() => {
        //赋值到表单
        this.form.id = row.id
        this.form.name = row.name
        this.form.genericName = row.genericName
        this.form.dosageForm = row.dosageForm
        this.form.routeOfAdministration = row.routeOfAdministration
        this.form.expiryDate = row.expiryDate
        this.form.price = row.price
        this.form.stockQuantity = row.stockQuantity
        this.form.description = row.description
        this.form.power = row.power
        this.form.image = row.image
      })
    },
    //删除
    delete_medication(id) {
      this.$axios.get(this.$HttpUrl+"/medication/delete?id=" + id).then(res => res.data).then(res => {
        if (res.code === 200) {
          this.$message({message: "操作成功!", type: 'success'})
          this.loadPost()
        } else {
          this.$message({message: "操作失败!", type: 'error'})
        }
      })
    },
    handleChange(file, fileList) {
      // 文件变化时触发
      if (file.status === 'success') {
        // 只在上传成功时更新表单数据
        this.form.image = file.name; // 将上传成功的文件名称赋值给 form.image
      }
      this.fileList = fileList; // 更新文件列表
    },
    //保存
    doSave() {
      this.$axios.post(this.$HttpUrl+"/medication/save", this.form).then(res => res.data)
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
    doMod() {
      this.$axios.post(this.$HttpUrl+"/medication/update", this.form).then(res => res.data)
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
    confirmUpload() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.form.id) {
            this.doMod();
          } else {
            this.doSave();
          }
        } else {
          return false;
        }
      });
    },
    cancelUpload() {
      // 取消操作
      this.fileList = []; // 清空文件列表
      this.centerDialogVisible = false
    },
  },
}
</script>

<style scoped>

</style>