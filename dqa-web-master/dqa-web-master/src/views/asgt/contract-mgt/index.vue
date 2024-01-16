<template>
  <div class="app-container">
    <!--头部搜索-->
    <el-form :model="contractQuery" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="名称" prop="supplierName">
        <el-input v-model="contractQuery.name" placeholder="请输入合同名称关键字" clearable/>
      </el-form-item>
      <el-form-item label="编号" prop="code">
        <el-input
          v-model="contractQuery.code"
          placeholder="请输入合同编号关键字"
          clearable/>
      </el-form-item>
      <el-form-item label="状态" prop="category">
        <el-select v-model="contractQuery.status" placeholder="请选择状态" clearable>
          <el-option
            v-for="dict in contractStatusOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"/>
        </el-select>
      </el-form-item>
<!--      <el-form-item label="公司性质" prop="companyNature">-->
<!--        <el-select v-model="contractQuery.companyNature" placeholder="请选择公司性质" clearable>-->
<!--          <el-option-->
<!--            v-for="dict in companyNatureOptions"-->
<!--            :key="dict.value"-->
<!--            :label="dict.label"-->
<!--            :value="dict.value"-->
<!--          />-->
<!--        </el-select>-->
<!--      </el-form-item>-->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="init">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!--头部按钮-->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
      </el-col>
      <!--      <el-col :span="1.5">-->
      <!--        <el-button type="success" plain icon="el-icon-upload2" size="mini" @click="handleImport">导入</el-button>-->
      <!--      </el-col>-->
      <!--      <el-col :span="1.5">-->
      <!--        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport">导出</el-button>-->
      <!--      </el-col>-->
      <!--      <el-col :span="1.5">-->
      <!--        <el-button type="danger" plain icon="el-icon-close" size="mini" :disabled="multiple" @click="handleDelete">删除</el-button>-->
      <!--      </el-col>-->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="init"></right-toolbar>
    </el-row>
    <!--表-->
    <el-table v-loading="loading" :data="contractList" style="position: absolute" height="calc(100vh - 270px)" >
      <el-table-column label="序号" type="index" align="center" min-width="35" />
      <el-table-column label="合同名称" align="center" prop="name" min-width="150" />
      <el-table-column label="编号" align="center" prop="code" min-width="150" :show-overflow-tooltip="true"/>
      <el-table-column label="类型" align="center" prop="contractType" min-width="100"/>
      <el-table-column label="状态" align="center" min-width="100">
        <template slot-scope="scope">
          <el-tag :type="statusTag(scope.row.status)">{{contractStatusMap[scope.row.status]}}</el-tag>
<!--          <span>{{contractStatusMap[scope.row.status]}}</span>-->
        </template>
      </el-table-column>
      <el-table-column label="主要内容" align="center" prop="content" min-width="200" :show-overflow-tooltip="true"/>
      <el-table-column label="开始日期" align="center" prop="startDate" min-width="120" />
      <el-table-column label="结束日期" align="center" prop="endDate" min-width="120" />
      <el-table-column label="需求单位" align="center" prop="companyName" min-width="150" />
      <el-table-column label="项目名称" align="center" prop="projectName" min-width="180" />
      <el-table-column label="项目负责人" align="center" prop="projectPrincipal" min-width="120" />
      <el-table-column label="乙方供应商" align="center" prop="supplierName" min-width="180" />
      <el-table-column label="乙方负责人" align="center" prop="supplierPrincipal" min-width="120" />
      <el-table-column label="操作" align="center" min-width="150" fixed="right">
        <!--        class-name="small-padding fixed-width"-->
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document"
            @click.native.stop="handleDetail(scope.row)"
          >详情</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click.native.stop="handleUpdate(scope.row)"
          >编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      style="position: fixed; bottom: 15px; right: 15px;"
      :total="total"
      :page.sync="contractQuery.pageNum"
      :limit.sync="contractQuery.pageSize"
      :page-sizes="[5,10,20,30]"
      @pagination="init"
    />

    <!--新建-->
    <el-dialog :visible.sync="showAdd" append-to-body style="height: calc(100vh - 0px);" :fullscreen="true" :before-close="closeContract">
      <h1 style="text-align: center;font-weight: bold;">新增合同</h1>
      <el-form ref="contractForm" :model="contractForm" :rules="rules" label-width="100px">
        <el-card shadow="always" style="margin: 10px 30px 20px 30px">
          <h3 style="margin-bottom: 20px;font-weight: bold">基本信息</h3>
          <el-row>
            <el-col :span="8">
              <el-form-item label="合同名称" prop="name">
                <el-input v-model="contractForm.name" placeholder="请输入合同名称" style="width: 80%"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="编号" prop="code">
                <el-input v-model="contractForm.code" placeholder="请输入合同编号" style="width: 80%"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="类型" prop="contractType">
                <el-input v-model="contractForm.contractType" placeholder="请选择合同类型" style="width: 80%"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="开始日期" prop="startDate">
                <el-date-picker v-model="contractForm.startDate" placeholder="请选择开始日期" style="width: 80%" type="date"
                                format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="到期日期" prop="endDate">
                <el-date-picker v-model="contractForm.endDate" placeholder="请选择到期日期" style="width: 80%" type="date"
                                format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="状态" prop="status">
                <el-select v-model="contractForm.status" placeholder="请选择合同状态（默认为履约中）" style="width: 80%">
                  <el-option v-for="item in contractStatusOptions" :value="item.value" :key="item.value" :label="item.label"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="乙方供应商" prop="supplierId">
                <supplier-select :input-style="'width: 80%'" v-model="contractForm.supplierId" :supplier-list="selectorList" @change="getSupplierId"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="乙方负责人" prop="supplierPrincipal">
                <!--人员选择器-->
                <el-input v-model="contractForm.supplierPrincipal" placeholder="请选择乙方负责人" style="width: 80%"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="联系电话" prop="telephone">
                <!--人员选择器-->
                <el-input style="width: 80%;display: inline-block" :rows="1" v-model="contractForm.telephone" placeholder="请输入手机号" maxlength="11" show-word-limit />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <!--单位选择器-->
              <el-form-item label="需求单位" prop="companyId">
                <el-select v-model="contractForm.companyId" placeholder="部门状态" clearable>
                  <el-option
                    v-for="dict in deptList"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
<!--                <el-input v-model="contractForm.companyId" placeholder="请选择需求单位" :disabled="true" style="width: 80%"/>-->
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="项目名称" prop="projectName">
                <el-input v-model="contractForm.projectName" placeholder="请选择合同类型" style="width: 80%"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="项目负责人" prop="projectPrincipal">
                <el-input v-model="contractForm.projectPrincipal" placeholder="请选择合同类型" style="width: 80%"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="附件" prop="contractFile">
                <oss-file-upload v-model="contractForm.contractFile" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="主要内容" prop="content">
              <el-input v-model="contractForm.content" type="textarea" :autosize="{ minRows: 3 }" style="width: 93%" />
            </el-form-item>
          </el-row>
        </el-card>
        <el-card shadow="always" style="margin: 10px 30px 10px 30px" v-if="flag">
          <h3 style="margin-bottom: 20px;font-weight: bold">乙方产品信息</h3>
          <el-form ref="productList" label-width="20px" style="padding-left: 20px">
            <el-form-item
              v-for="(domain, index) in productList"
              :label="index+1 +'.'"
              :key="index" label-width="5px">
              <el-row>
                <el-col :span="6">
                  产品/服务   <el-select v-model="domain.productId" placeholder="请选择产品/服务" clearable @change="productChange(index)">
                  <el-option v-for="item in productInfo" :label="item.name" :value="item.id" :key="item.id" />
                </el-select>
<!--                  <el-input style="width: 70%;display: inline-block" :rows="1" v-model="domain.productId" placeholder="请选择产品/服务" clearable/>-->
                </el-col>
                <el-col :span="5">
                  类别   <el-select v-model="domain.supplierType" placeholder="根据产品回填" style="width: 75%" clearable :disabled="true" >
                  <el-option v-for="item in supplierType" :label="item.label" :value="item.value" :key="item.value"/></el-select>
                </el-col>
                <el-col :span="5">
                  型号   <el-input style="width: 70%;display: inline-block" :rows="1" v-model="domain.productModel" placeholder="根据产品回填" clearable :disabled="true" />
                </el-col>
                <el-button @click.prevent="removeProduct(domain)" icon="el-icon-delete" type="danger" circle style="right: 0"></el-button>
              </el-row>
            </el-form-item>
            <div style="margin-top: 40px"><el-divider><el-button icon="el-icon-plus" @click="addProduct" size="small" circle plain /></el-divider></div>
          </el-form>
        </el-card>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">提 交</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-drawer :visible.sync="detailVisible" size="100%">
      <contract-detail ref="contractDetail" :data="detailData" :selector-list="selectorList"></contract-detail>
    </el-drawer>
  </div>
</template>

<script>
import { getContractByPage,addContract,updateContract,getContractById } from '../../../api/asgt/contractMgt/contract'
import constant from './constant/constant'
import supplierConstant from '../inventory-mgt/constant/constant'
import supplierSelect from '../inventory-mgt/components/supplierSelect'
import { listAllSupplierByKind,getSupplierInfo } from '../../../api/asgt/supplier/supplierBase'
import { deepClone } from '../../../utils'
import contractDetail from '@/views/asgt/contract-mgt/components/contractDetail'
import { listDept } from '@/api/system/dept'
export default {
  name: 'index',
  components:{
    supplierSelect,
    contractDetail
  },
  watch:{
    contractForm:{
      handler(val){
        this.flag = val.supplierId !== undefined && val.supplierId !== null && val.supplierId !== '';
      },
      deep: true
    }
  },
  data(){
    return{
      detailVisible:false,
      detailData:{},
      loading: false,
      showSearch: true,
      flag: false,
      contractList: [],
      productList:[],
      productInfo: [],
      showAdd: false,
      total: 0,
      contractQuery:{
        pageNum: 1,
        pageSize: 10,
        name: '',
        code: ''
      },
      contractForm: {},
      rules:{
        name: [
          { required: true, message: "供应商名称不能为空", trigger: "blur" }
        ],
        supplierId: [
          { required: true, message: "乙方供应商不能为空", trigger: "blur" }
        ]
      },
      selectorList: [],
      contractStatusOptions: constant.contractStatusOptions,
      contractStatusMap: constant.contractStatusMap,
      supplierType: constant.supplierType,
      companyNatureOptions: supplierConstant.companyNatureOptions,
    }
  },
  created() {
    this.init()
    listAllSupplierByKind(0).then(res=>{
      this.selectorList = res.data
    })
  },
  methods:{
    init(){
      getContractByPage(this.contractQuery).then(res=>{
        this.contractList = res.data.records
        this.total = res.data.total
        this.contractQuery.pageNum = res.data.current
        this.contractQuery.pageSize = res.data.size
      })
      listDept(null).then(res=>{
        if (res.data){

        }
      })
    },
    handleAdd(){
      this.showAdd = true
      this.productList = [{ productId: '' }]
    },
    handleUpdate(row){
      this.showAdd = true
      this.contractForm = deepClone(row)
      getSupplierInfo(row.supplierId).then(res=>{
        this.productInfo = res.data.productsInfo
        getContractById(row.id).then(res=>{
          for (let i=0;i<res.data.productList.length;i++){
            this.productList.push({
              productId: res.data.productList[i].id,
              supplierType: res.data.productList[i].supplierType,
              productModel: res.data.productList[i].productModel
            })
          }
        })
      })
    },
    handleDetail(row){
      this.detailVisible = true;
      getContractById(row.id).then(res=>{
        if (res.data){
          this.detailData = res.data;
        }
      })
    },
    submitForm(){
      if (this.contractForm.telephone) {
        let phoneReg = /^1[3-9][0-9]{9}$/
        if (!phoneReg.test(this.contractForm.telephone)) {
          this.$message.warning("乙方联系方式格式有误")
          return;
        }
      }
      this.$refs.contractForm.validate(valid =>{
        if (valid){
          let productIds = []
          // 去重
          if (this.productList.length>0){
            for (let item of this.productList){
              if (item.productId && !productIds.includes(item.productId)){
                productIds.push(item.productId)
              }
            }
          }
          else {
            this.$message.error("产品/服务不能为空，请绑定产品/服务")
            return;
          }
          this.contractForm.productIds = productIds
          addContract(this.contractForm).then(res=>{
            this.showAdd = false
            this.$message.success("新增成功")
            this.reset()
            this.init()
          })
        }
      })
    },
    getSupplierId(id,data){
      this.contractForm.supplierId = id
      this.productInfo = data.productsInfo
    },
    // 产品回显
    productChange(index){
      let data = this.productInfo.find(item=>item.id===this.productInfo[index].id)
      this.productList[index].supplierType = data.supplierType
      this.productList[index].productChange = data.productModel
    },
    closeContract(done){
      this.reset()
      done();
    },
    reset(){
      this.contractForm = {}
      this.productList = []
    },
    resetQuery(){
      this.contractQuery = {
        pageNum: 1,
        pageSize: 10,
        name: '',
        code: ''
      }
      this.init()
    },
    cancel(){},
    addProduct() {
      this.productList.push({
        id: ''
      })
    },
    removeProduct(item) {
      let index = this.productList.indexOf(item)
      if (index !== -1) {
        this.productList.splice(index, 1)
      }
    },
    statusTag(status){
      if (status===1){
        return 'primary'
      }
      else if (status===2){
        return 'success'
      }
      else if (status===3){
        return 'warning'
      }
      else if (status===4){
        return 'info'
      }
    }
  }
}
</script>

<style scoped>

</style>
