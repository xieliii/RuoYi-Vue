<template>
  <div style="margin: 15px">
<!--    <h1 style="text-align: center;margin: 0 0 40px 0;">潜在供应商入册-需求申请</h1>-->
    <el-form ref="potentialForm" :model="potentialForm" label-width="120px">
<!--      <el-card shadow="always" style="margin: 10px 30px 20px 30px">-->
      <div style="margin-bottom: 60px">
        <h3 style="margin-bottom: 20px;font-weight: bold">基本信息</h3>
        <el-row>
          <el-col :span="8">
            <el-form-item label="需求编号" prop="reqCode">
              <el-input v-model="potentialForm.reqCode" placeholder="请输入需求编号" style="width: 75%" :disabled="disabled"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="供应商部门主管" prop="managerId">
              <el-input v-model="potentialForm.managerId" placeholder="请选择供应商主管" style="width: 75%" :disabled="disabled"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="需求名称" prop="reqName">
              <el-input v-model="potentialForm.reqName" placeholder="请输入需求名称" style="width: 75%" :disabled="disabled"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="供应商类别" prop="category">
              <el-select v-model="potentialForm.category" placeholder="请选择供应商类别" style="width: 75%" :disabled="disabled">
                <el-option v-for="item in supplierType" :key="item.value" :value="item.value" :label="item.label" /></el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="论证材料附件" prop="argumentationFileId">
              <oss-file-upload v-model="potentialForm.argumentationFileId" :disabled="disabled"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="需求来源说明" prop="sourceDescription">
          <el-input v-model="potentialForm.sourceDescription" type="textarea" placeholder="请输入需求来源说明" style="width: 93%" :autosize="{ minRows: 3 }" :disabled="disabled"/>
        </el-form-item>
      </div>

      <div>
        <el-row>
          <el-col :span="2">
            <h3 style="margin-bottom: 20px;font-weight: bold">供应商列表</h3>
          </el-col>
          <el-col :span="2">
            <supplier-multiple-select v-if="!disabled" :button-style="'margin-top:12px'" :supplier-list="selectorList" @getSupplierInfo="potentialSelectSupplier" :exist-ids="supplierIds"/>
          </el-col>
        </el-row>
        <el-form ref="supplierInfo" label-width="15px" style="padding-left: 20px">
          <el-form-item
            v-for="(domain, index) in supplierInfo"
            :label="index+1 +'.'"
            :key="index" label-width="5px">
            <el-row>
              <el-col :span="5">
                <el-row>
                  <el-col :span="5">
                    <span>供应商</span>
                  </el-col>
                  <el-col :span="19">
                    <supplier-select :input-style="'width: 90%'" v-model="domain.supplierId" :listIndex="index" :supplier-list="selectorList" @getInfo="potentialAddSupplier" :disabled="disabled"/>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="5">
                供应商编号   <el-input style="width: 70%;display: inline-block" :rows="1" v-model="domain.code" placeholder="根据供应商回填" :disabled="true" clearable />
              </el-col>
              <el-col :span="5">
                公司性质   <el-select v-model="domain.companyNature" placeholder="根据供应商回填" style="width: 75%" :disabled="true">
                <el-option v-for="item in companyNatureOptions" :label="item.label" :value="item.value" :key="item.value"/></el-select>
              </el-col>
              <el-col :span="7">
                地址   <el-input style="width: 85%;display: inline-block" :rows="1" v-model="domain.registeredAddress" placeholder="根据供应商回填" :disabled="true" />
              </el-col>
              <el-button v-if="!disabled" @click.prevent="removeSupplierInfo(domain)" icon="el-icon-delete" type="danger" circle style="right: 0"></el-button>
            </el-row>
          </el-form-item>
          <div style="margin-top: 40px" v-if="!disabled"><el-divider><el-button icon="el-icon-plus" @click="addSupplierInfo" size="small" circle plain /></el-divider></div>
        </el-form>
      </div>
<!--      </el-card>-->
    </el-form>
    <div style="text-align: right;margin-top: 20px" v-if="!disabled">
      <el-button type="primary" @click="createPotentialForm">提 交</el-button>
    </div>
  </div>
</template>

<script>
import constant from '../../inventory-mgt/constant/constant'
import supplierSelect from '../../inventory-mgt/components/supplierSelect'
import supplierMultipleSelect from '../../inventory-mgt/components/supplierMultipleSelect'
import { deepClone } from '../../../../utils'
import { listAllSupplierByKind } from '../../../../api/asgt/supplier/supplierBase'
import { startProcess } from '../../../../api/workflow/workflow-common'
import processConstant from '../constant/constant'
export default {
  name: 'potentialForm',
  components:{
    supplierSelect,
    supplierMultipleSelect
  },
  props:{
    disabled:{
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => {}
    },
    selectorList: {
      type: Array,
      default: () => []
    }
  },
  data(){
    return{
      selectorList: [],
      potentialForm: {},
      supplierInfo: [],
      supplierIds: [],
      companyNatureOptions: constant.companyNatureOptions,
      supplierType: constant.supplierType,
      processConstant
    }
  },
  watch:{
    data:{
      handler(val){
        if (val){
          this.potentialForm = deepClone(val)
          this.potentialForm.category = this.potentialForm.category?parseInt(this.potentialForm.category):null
          if (val.supplierList){
            this.supplierInfo = deepClone(val.supplierList)
            this.supplierInfo.map(item=>item.supplierId = item.id)
          }
        }
      }
    }
  },
  methods:{
    createPotentialForm(){
      this.potentialForm.supplierList = this.supplierInfo
      debugger
      startProcess(JSON.stringify(this.potentialForm), processConstant.potentialProcessKey).then(res=>{
        this.$message.success("成功发起潜在入册需求申请流程")
        this.$emit("close", false);
      })
    },
    submitForm(){
      for (let item of this.supplierInfo){
        item.potentialReqId = this.potentialForm.id
      }
      this.potentialForm.supplierList = this.supplierInfo
      this.$emit("submitForm", JSON.stringify(this.potentialForm));
    },
    // 潜在需求
    potentialSelectSupplier(ids,data){
      let arr = data.map(item=>{
        return{
          supplierId: item.id,
          code: item.code,
          companyNature: item.companyNature,
          registeredAddress: item.registeredAddress
        }
      })
      // 去重
      arr = this.supplierInfo.concat(arr)
      for (let item of arr){
        let sign = true
        for (let existItem of this.supplierInfo){
          if (item.supplierId===existItem.supplierId){
            sign = false
          }
        }
        if (sign){
          this.supplierInfo.push(item)
        }
      }
    },
    potentialAddSupplier(id,data,index){
      let obj = {
        supplierId: data.id,
        code: data.code,
        companyNature: data.companyNature,
        registeredAddress: data.registeredAddress
      }
      let sign = true
      for (let item of this.supplierInfo){
        if (id===item.supplierId){
          sign = false
        }
      }
      if (sign){
        this.supplierInfo[index] = deepClone(obj)
      }
    },
    addSupplierInfo(){
      this.supplierInfo.push({
        id: ''
      })
    },
    removeSupplierInfo(item) {
      let index = this.supplierInfo.indexOf(item)
      if (index !== -1) {
        this.supplierInfo.splice(index, 1)
      }
    },
  }
}
</script>

<style scoped>

</style>
