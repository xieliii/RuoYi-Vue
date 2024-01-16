<template>
  <div style="margin: 15px">
<!--    <h1 style="text-align: center;margin: 0 0 40px 0;">获批供应商入册-需求申请</h1>-->
<!--    <el-card shadow="always" style="margin: 10px 30px 20px 30px">-->
    <div style="margin-bottom: 60px">
      <h3 style="margin-bottom: 20px;font-weight: bold">基本信息</h3>
      <el-form ref="approvedForm" :model="approvedForm" label-width="120px" >
        <el-row>
          <el-col :span="8">
            <el-form-item label="项目编号" prop="projectCode">
              <el-input v-model="approvedForm.projectCode" placeholder="请输入项目编号" style="width: 75%" :disabled="disabled"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目名称" prop="projectName">
              <el-input v-model="approvedForm.projectName" placeholder="请输入项目名称" style="width: 75%" :disabled="disabled"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="供应商类别" prop="category">
              <el-select v-model="approvedForm.category" placeholder="请选择供应商类别" style="width: 75%" :disabled="disabled">
                <el-option v-for="item in supplierType" :key="item.value" :value="item.value" :label="item.label" /></el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="需求编号" prop="reqCode">
              <el-input v-model="approvedForm.reqCode" placeholder="请输入需求编号" style="width: 75%" :disabled="disabled"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="需求交付时间" prop="reqDeliveryTime">
              <el-date-picker v-model="approvedForm.reqDeliveryTime" type="date" placeholder="请选择需求交付时间"
                              format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" style="width: 75%" :disabled="disabled"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="需求附件" prop="fileId">
              <oss-file-upload v-model="approvedForm.fileId" :disabled="disabled"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="采购申请时间">
              <el-date-picker v-model="currentDate" type="date" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" style="width: 75%" :disabled="true"/>
            </el-form-item>
          </el-col>
          <!--主管selector-->
          <el-col :span="8">
            <el-form-item label="供应商部门主管" prop="managerId">
              <el-input v-model="approvedForm.managerId" placeholder="请选择供应商部门主管" style="width: 75%" :disabled="disabled"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
<!--    </el-card>-->
<!--    <el-card shadow="always" style="margin: 10px 30px 20px 30px">-->
    <div>
      <h3 style="margin-bottom: 20px;font-weight: bold">采购明细</h3>
      <el-form ref="purchaseForm" label-width="15px" style="padding-left: 20px">
        <el-form-item
          v-for="(domain, index) in purchaseInfo"
          :label="index+1 +'.'"
          :key="index">
          <el-row>
            <el-col :span="4">
              物品名称   <el-input style="width: 70%;display: inline-block" :rows="1" v-model="domain.itemName" placeholder="请输入采购物品名称" clearable :disabled="disabled" />
            </el-col>
            <el-col :span="4">
              规格型号   <el-input style="width: 70%;display: inline-block" :rows="1" v-model="domain.specificationModel" placeholder="请输入规格型号" clearable :disabled="disabled" />
            </el-col>
            <el-col :span="3">
              数量   <el-input style="width: 70%;display: inline-block" type="number" :rows="1" v-model="domain.num" placeholder="数量" clearable :disabled="disabled" />
            </el-col>
            <el-col :span="4">
              单价   <el-input style="width: 70%;display: inline-block" type="number" :rows="1" v-model="domain.price" placeholder="单价(元)" :disabled="disabled"/>
            </el-col>
            <el-col :span="2">
              <span style="margin-left: 5px"> 物品总价 {{ itemTotal(domain.num,domain.price) }} </span>
            </el-col>
            <el-col :span="6">
              参考供应商   <el-input style="width: 75%;display: inline-block" :rows="1" v-model="domain.referenceSupplier" placeholder="请输入参考供应商" :disabled="disabled" />
            </el-col>
            <el-col :span="1">
              <el-button v-if="!disabled" @click.prevent="removePurchase(domain)" icon="el-icon-delete" type="danger" circle style="position: absolute;right: 0"></el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <div style="margin-top: 40px" v-if="!disabled"><el-divider><el-button icon="el-icon-plus" @click="addPurchase" size="small" circle plain /></el-divider></div>
        <span>采购总价：{{purchaseTotal}}</span>
      </el-form>
    </div>
<!--    </el-card>-->
    <div style="text-align: right;margin-top: 20px">
      <el-button v-if="!disabled" type="primary" @click="createApprovedForm">提 交</el-button>
    </div>
  </div>

</template>

<script>
import constant from '../../inventory-mgt/constant/constant'
import {startProcess} from '../../../../api/workflow/workflow-common'
import { deepClone } from '../../../../utils'
import processConstant from '../constant/constant'
import { listAllSupplierByKind } from '../../../../api/asgt/supplier/supplierBase'

export default {
  name: 'approvedForm',
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
  watch:{
    data:{
      handler(val){
        if (val){
          this.approvedForm = deepClone(val)
          // this.potentialForm.category = this.potentialForm.category?parseInt(this.potentialForm.category):null
          if (val.purchaseList){
            this.purchaseInfo = deepClone(val.purchaseList)
            // this.purchaseInfo.map(item=>item.supplierId = item.id)
          }
        }
      }
    }
  },
  data(){
    return{
      approvedForm: {},
      purchaseInfo: [],
      currentDate: new Date(),
      supplierType: constant.supplierType,
      processConstant
    }
  },
  computed:{
    purchaseTotal(){
      let res = 0
      if (this.purchaseInfo.length!==0){
        this.purchaseInfo.forEach(item=>{
          res += item.price * item.num
        })
      }
      return res
    }
  },
  created() {
    // listAllSupplierByKind(2).then(res=>{
    //   this.selectorList = res.data
    // })
  },
  methods:{
    createApprovedForm(){
      this.approvedForm.purchaseDetailList = this.purchaseInfo
      startProcess(JSON.stringify(this.approvedForm),processConstant.approvedProcessKey).then(res=>{
        this.$message.success("成功发起获批入册需求申请流程")
        this.$emit("close", false);
      })
    },
    submitForm(){
      for (let item of this.purchaseInfo){
        item.approvedRequirementId = this.approvedForm.id
      }
      this.approvedForm.purchaseDetailList = this.purchaseInfo
      this.$emit("submitForm", JSON.stringify(this.approvedForm));
    },
    addPurchase(){
      this.purchaseInfo.push({
        itemName: null,
        specificationModel: null,
        num: null,
        price: null,
        referenceSupplier: null,
      })
    },
    removePurchase(item){
      let index = this.purchaseInfo.indexOf(item)
      if (index !== -1) {
        this.purchaseInfo.splice(index, 1)
      }
    },
    itemTotal(num,price){
      return num*price
    }
  }
}
</script>

<style scoped>

</style>
