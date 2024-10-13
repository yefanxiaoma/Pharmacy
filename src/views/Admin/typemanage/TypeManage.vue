<template>
  <div>
    <div style="margin-bottom: 6px;width: 700px">
      <el-input v-model="name" placeholder="请输入分类名" suffix-icon="el-icon-search" style="width: 250px;"
                @keyup.enter.native="loadPost" ></el-input>
      <el-button type="primary" style="margin-left: 5px" @click="loadPost">查询</el-button>
      <el-button type="success" @click="resetParam">重置</el-button>
      <el-button type="primary" style="margin-left: 10px" @click="add">新增</el-button>
    </div>
    <el-table :data="tableData"
              :header-cell-style="{background:'#c1bebe', color:'#555'}"
              border
    >
      <el-table-column prop="typeId" label="ID" width="60">
      </el-table-column>
      <el-table-column prop="typeName" label="分类名" >
      </el-table-column>
      <el-table-column prop="description" label="备注" width="600px">
      </el-table-column>
      <el-table-column prop="operate" label="操作" width="500px">
        <template #default="scope">
          <el-button size="small" type="success" @click="mod_type(scope.row)">编辑</el-button>
          <el-popconfirm style="margin-left: 5px"
                         title="确定删除吗?"
                         @confirm="delete_type(scope.row.typeId)"
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
          :page-sizes="[5, 10]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </div>
    <!-- 新增的表单-->
    <el-dialog
        title="提示"
        :visible.sync="centerDialogVisible"
        width="30%"
        center>
      <el-form ref="form" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="分类名" prop="typeName">
          <el-col :span="20">
            <el-input v-model="form.typeName"></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="备注" prop="description">
          <el-col :span="20">
            <el-input type="textarea" v-model="form.description"></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="centerDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="save">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name:"TypeManage",
  data() {
    return {
      tableData:[],
      pageSize:5,
      pageNum:1,
      total:0,
      name:"",
      centerDialogVisible:false,
      form: {
        typeId:'',
        typeName:'',
        description:''
      },
      rules: {
        typeName: [
          { required: true, message: '请输入分类名', trigger: 'blur' },
        ]
      },
    }
  },
  mounted(){
    this.loadPost();
  },
  methods: {
    //加载数据、查询
    loadPost() {
      this.$axios.post(this.$HttpUrl+"/medicationtype/listType", {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        param: {
          name: this.name,
        }
      }).then(res => res.data)
          .then(res => {
            if (res.code === 200) {
              this.tableData = res.data;
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

    resetForm() {
      this.$refs.form.resetFields();
    },
    //新增
    add() {
      this.centerDialogVisible = true
      this.$nextTick(() => {
        this.resetForm() // 重置填写的信息
        this.form.id = ''
      })
    },
    //保存
    doSave(){
      this.$axios.post(this.$HttpUrl+"/medicationtype/save", this.form).then(res => res.data)
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
    doMod(){
      this.$axios.post(this.$HttpUrl+"/medicationtype/update", this.form).then(res => res.data)
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
      this.$refs.form.validate((valid) => {
        if (valid) {
          if(this.form.typeId){
            this.doMod();
          }else {
            this.doSave();
          }
        } else {
          return false;
        }
      });
    },
    //修改
    mod_type(row) {
      this.centerDialogVisible = true
      this.$nextTick(() => {
        //赋值到表单
        this.form.typeId = row.typeId
        this.form.typeName = row.typeName
        this.form.description = row.description
      })
    },
    //删除
    delete_type(id) {
      this.$axios.get(this.$HttpUrl+"/medicationtype/delete?id="+id).then(res=>res.data).then(res=>{
        if (res.code === 200) {
          this.$message({message: "操作成功!", type: 'success'})
          this.loadPost()
        } else {
          this.$message({message: "操作失败!", type: 'error'})
        }
      })
    }
  }
};
</script>

<style >

</style>