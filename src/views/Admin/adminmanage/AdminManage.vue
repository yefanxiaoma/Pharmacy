<template>
  <div>
    <div style="margin-bottom: 6px;width: 900px">
      <el-input v-model="no" placeholder="请输入账号" suffix-icon="el-icon-search" style="width: 250px;"
                @keyup.enter.native="loadPost" ></el-input>
      <el-input v-model="name" placeholder="请输入名字" suffix-icon="el-icon-search" style="width: 250px;margin-left: 5px;"
                @keyup.enter.native="loadPost" ></el-input>
      <el-button type="primary" style="margin-left: 5px" @click="loadPost">查询</el-button>
      <el-button type="success" @click="resetParam">重置</el-button>
      <el-button type="primary" style="margin-left: 10px" @click="add">新增</el-button>
    </div>
    <el-table :data="tableData"
              :header-cell-style="{background:'#c1bebe', color:'#555'}"
              border
    >
      <el-table-column prop="id" label="ID" width="70">
      </el-table-column>
      <el-table-column prop="userno" label="账号" >
      </el-table-column>
      <el-table-column prop="password" label="密码" >
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="180">
      </el-table-column>
      <el-table-column prop="age" label="年龄" width="100">
      </el-table-column>

      <el-table-column prop="sex" label="性别" width="100">
        <template v-slot="{ row }">
          <el-tag :type="row.sex === 1 ? 'primary' : 'success'" disable-transitions>
            {{ row.sex === 1 ? '男' : '女' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="phone" label="电话" width="180">
      </el-table-column>

      <el-table-column prop="roleId" label="角色" width="120">
        <template v-slot="{ row }">
          <el-tag :type="row.roleId === 0 ? 'danger' : 'primary'" disable-transitions>
            {{ row.roleId === 0 ? '超级管理员' : '管理员' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="operate" label="操作" width="410px">
        <template #default="scope">
          <el-button size="small" type="success" @click="mod_user(scope.row)">编辑</el-button>
          <el-popconfirm style="margin-left: 5px"
                         title="确定删除吗?"
                         @confirm="delete_user(scope.row.id)"
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
    <!-- 新增的表单-->
    <el-dialog
        title="提示"
        :visible.sync="centerDialogVisible"
        width="30%"
        center>
      <el-form ref="form" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="账号" prop="userno">
          <el-col :span="20">
            <el-input v-model="form.userno"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="名字" prop="name">
          <el-col :span="20">
            <el-input v-model="form.name"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-col :span="20">
            <el-input v-model="form.password"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-col :span="20">
            <el-input v-model="form.age"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="form.sex" ref="radio">
            <el-radio label="1">男</el-radio>
            <el-radio label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-col :span="20">
            <el-input v-model="form.phone"></el-input>
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
  name: "AdminManage",
  data() {
    //检查年龄
    let checkAge = (rule, value, callback) => {
      if (value > 150) {
        callback(new Error('年龄过大'))
      } else if (value <= 0) {
        callback(new Error('请输入正确的年龄'))
      } else {
        callback();
      }
    };
    //验证账号唯一
    let checkDuplicate = (rule, value, callback) => {
      if (this.form.id) {
        return callback();
      }
      this.$axios.get(this.$HttpUrl + "/user/findByNo?no=" + this.form.userno).then(res => res.data).then(res => {
        if (res.code !== 200) {
          callback()
        } else {
          callback(new Error('账号已存在'));
        }
      })
    }
    return {
      tableData: [],
      pageSize: 5,
      pageNum: 1,
      total: 0,
      name: "",
      no: "",
      centerDialogVisible: false,
      form: {
        id: '',
        userno: '',
        name: '',
        password: '',
        age: '',
        sex: '',
        phone: '',
        roleId: '1'
      },
      rules: {
        userno: [
          {required: true, message: '请输入账号', trigger: 'blur'},
          {
            pattern: /^[A-Za-z0-9]+$/, // 正则表达式：仅允许英文字符和数字
            message: '名字只能包含英文字符和数字',
            trigger: 'blur'
          },
          {validator: checkDuplicate, trigger: "blur"}
        ],
        name: [
          {required: true, message: '请输入名字', trigger: 'blur'},
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
        ],
        age: [
          {required: true, message: '请输入年龄', trigger: 'blur'},
          {min: 1, max: 3, message: '长度在 1 到 3 个字符', trigger: 'blur'},
          {pattern: /^([1-9][0-9]*){1,3}$/, message: '年龄必须为正整数', trigger: "blur"},
          {validator: checkAge, trigger: "blur"}
        ],
        phone: [
          {required: true, message: '手机号不能为空', trigger: 'blur'},
          {pattern: /^1\d{10}$/, message: '请输入11位正确的手机号码', trigger: "blur"},
          {validator:this.checkPhone}
        ],
      },
    }
  },
  mounted() {
    this.loadPost();
  },
  methods: {
    checkPhone(rule,value,callback){
      if(!this.form.id){
      this.$axios.get(this.$HttpUrl+"/userAddress/findByPhone?phone="+value).then(res => {
        if (res.data.code !== 200) {
          callback();
        } else {
          callback(new Error('该手机号已绑定'));
        }
      });
      }else {
        callback();
      }
    },
    //加载数据、查询
    loadPost() {
      this.$axios.post(this.$HttpUrl+"/user/listPage", {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        param: {
          name: this.name,
          no: this.no,
          roleId: '1'
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
        this.form.sex = ''
      })
    },
    //保存
    doSave() {
      this.$axios.post(this.$HttpUrl+"/user/save", this.form).then(res => res.data)
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
      this.$axios.post(this.$HttpUrl+"/user/update", this.form).then(res => res.data)
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
    //修改
    mod_user(row) {
      this.centerDialogVisible = true
      this.$nextTick(() => {
        //赋值到表单
        this.form.id = row.id
        this.form.userno = row.userno
        this.form.name = row.name
        this.form.password = row.password
        this.form.age = row.age + ''
        this.form.sex = row.sex + ''
        this.form.phone = row.phone
        this.form.roleId = row.roleId
      })
    },
    //删除
    delete_user(id) {
      this.$axios.get(this.$HttpUrl+"/user/delete?id=" + id).then(res => res.data).then(res => {
        if (res.code === 200) {
          this.$message({message: "操作成功!", type: 'success'})
          this.loadPost()
        } else {
          this.$message({message: "操作失败!", type: 'error'})
        }
      })
    }
  },
}

</script>

<style scoped>

</style>