<template>
  <div>
    <div style="margin-bottom: 6px;width: 700px">
      <el-input v-model="name" placeholder="请输入菜单名" suffix-icon="el-icon-search" style="width: 250px;"
                @keyup.enter.native="loadPost" ></el-input>
      <el-button type="primary" style="margin-left: 5px" @click="loadPost">查询</el-button>
      <el-button type="success" @click="resetParam">重置</el-button>
      <el-button type="primary" style="margin-left: 10px" @click="add">新增</el-button>
    </div>
    <el-table :data="tableData"
              :header-cell-style="{background:'#c1bebe', color:'#555'}"
              border
    >
      <el-table-column prop="id" label="ID" width="80px">
      </el-table-column>
      <el-table-column prop="menuCode" label="菜单编码" width="100px">
      </el-table-column>
      <el-table-column prop="menuName" label="菜单名字" width="150px">
      </el-table-column>
      <el-table-column prop="menuLevel" label="菜单等级" width="80px">
      </el-table-column>
      <el-table-column prop="menuClick" label="路由后缀" width="120px">
      </el-table-column>
      <el-table-column prop="menuRight" label="菜单权限" width="100px">
      </el-table-column>
      <el-table-column prop="menuComponent" label="页面名称" >
      </el-table-column>
      <el-table-column prop="menuIcon" label="菜单图标">
      </el-table-column>
      <el-table-column prop="operate" label="操作" width="200px">
        <template #default="scope">
          <el-button size="small" type="success" @click="mod_menu(scope.row)">编辑</el-button>
          <el-popconfirm style="margin-left: 5px"
                         title="确定删除吗?"
                         @confirm="delete_menu(scope.row.id)"
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
        <el-form-item label="菜单编码" prop="menuCode">
          <el-col :span="20">
            <el-input v-model="form.menuCode"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="菜单名称" prop="menuName">
          <el-col :span="20">
            <el-input v-model="form.menuName"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="菜单等级" prop="menuLevel">
          <el-col :span="20">
            <el-input v-model="form.menuLevel"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="路由后缀" prop="menuClick">
          <el-col :span="20">
            <el-input v-model="form.menuClick"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="菜单权限" prop="menuRight">
          <el-col :span="20">
            <el-input v-model="form.menuRight"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="页面名称" prop="menuComponent">
          <el-col :span="20">
            <el-input v-model="form.menuComponent"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="菜单图标" prop="menuIcon">
          <el-col :span="20">
            <el-input v-model="form.menuIcon"></el-input>
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
        id:'',
        menuCode:'',
        menuName:'',
        menuLevel:'',
        menuClick:'',
        menuRight:'',
        menuComponent:'',
        menuIcon:'',
      },
      rules: {
        menuCode: [
          { required: true, message: '请输入菜单名', trigger: 'blur' },
        ],
        menuName: [
          { required: true, message: '请输入菜单名', trigger: 'blur' },
        ],
        menuLevel: [
          { required: true, message: '请输入菜单名', trigger: 'blur' },
        ],
        menuClick: [
          { required: true, message: '请输入菜单名', trigger: 'blur' },
        ],
        menuRight: [
          { required: true, message: '请输入菜单名', trigger: 'blur' },
        ],
        menuComponent: [
          { required: true, message: '请输入菜单名', trigger: 'blur' },
        ],
        menuIcon: [
          { required: true, message: '请输入菜单名', trigger: 'blur' },
        ],
      },
    }
  },
  mounted(){
    this.loadPost();
  },
  methods: {
    //加载数据、查询
    loadPost() {
      this.$axios.post(this.$HttpUrl+"/menu/listPage", {
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
      this.$axios.post(this.$HttpUrl+"/menu/save", this.form).then(res => res.data)
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
      this.$axios.post(this.$HttpUrl+"/menu/update", this.form).then(res => res.data)
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
          if(this.form.id){
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
    mod_menu(row) {
      this.centerDialogVisible = true
      this.$nextTick(() => {
        //赋值到表单
        this.form.id = row.id
        this.form.menuCode= row.menuCode
        this.form.menuName= row.menuName
        this.form.menuLevel= row.menuLevel
        this.form.menuClick= row.menuClick
        this.form.menuRight= row.menuRight
        this.form.menuComponent= row.menuComponent
        this.form.menuIcon= row.menuIcon
      })
    },
    //删除
    delete_menu(id) {
      this.$axios.get(this.$HttpUrl+"/menu/delete?id="+id).then(res=>res.data).then(res=>{
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