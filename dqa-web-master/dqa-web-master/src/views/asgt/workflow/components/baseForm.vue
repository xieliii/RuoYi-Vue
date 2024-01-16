<template>
  <div style="margin: 0 35px 35px 35px">
    <el-card shadow="always">
      <!--潜在需求基本信息-->
      <div v-if="processKey===processConstant.potentialProcessKey">
        <h3 style="font-weight: bold">基本信息</h3>
        <potential-req-base-form :potential-form="potentialForm" :form-disabled="true" />
        <h3 style="font-weight: bold;margin-top: 50px">供应商列表</h3>
        <div class="base-form-div">
          <el-table :data="supplierList" style="margin-bottom: 30px">
            <el-table-column label="序号" width="55px" type="index" align="center" />
            <el-table-column label="供应商" min-width="100px" prop="supplierName" align="center" />
            <el-table-column label="供应商编号" min-width="100px" prop="code" align="center" />
            <el-table-column label="公司性质" min-width="80px" align="center">
              <template slot-scope="scope">
                <span>{{ companyNatureMap[scope.row.companyNature] }}</span>
              </template>
            </el-table-column>
            <el-table-column label="地址" min-width="150px" prop="registeredAddress" align="center" :show-overflow-tooltip="true"/>
          </el-table>
        </div>
      </div>

      <!--获批需求基本信息-->
      <div v-if="processKey===processConstant.approvedProcessKey">
        <h3 style="font-weight: bold">基本信息</h3>
        <approved-req-base-form :approved-form="approvedForm" :form-disabled="true"/>
        <h3 style="font-weight: bold;margin-top: 50px">采购明细</h3>
        <div class="base-form-div">
          <el-table :data="purchaseList" style="margin-bottom: 30px">
            <el-table-column label="序号" width="55px" type="index" align="center" />
            <el-table-column label="采购物品名称" min-width="100px" prop="itemName" align="center" />
            <el-table-column label="规格型号" min-width="100px" prop="specificationModel" align="center" />
            <el-table-column label="数量" min-width="80px" prop="num" align="center" />
            <el-table-column label="单价（元）" min-width="80px" prop="price" align="center" />
            <el-table-column label="物品总价" min-width="80px" align="center" >
              <template slot-scope="scope">
                <span> {{ itemTotal(scope.row.num,scope.row.price) }} </span>
              </template>
            </el-table-column>
            <el-table-column label="参考供应商" min-width="200px" prop="referenceSupplier" align="center" :show-overflow-tooltip="true" />
          </el-table>
          <span>采购总价：{{purchaseTotal}}</span>
        </div>
      </div>

      <!--清退-->
      <div v-if="processKey===processConstant.clearProcessKey">
        <h3 style="font-weight: bold">清退信息</h3>
        <div class="base-form-div">
          <div style="font-size: 15px;margin: 15px 15px 15px ;">
            <el-row>
              <el-col :span="2">
                <div style="margin-top: 15px">
                  <span>清退凭据材料：</span>
                </div>
              </el-col>
              <el-col :span="5">
                <oss-file-upload v-model="removeForm.fileId" :disabled="true"/>
              </el-col>
            </el-row>
          </div>
          <el-table :data="supplierInfo" style="margin-bottom: 30px">
            <el-table-column label="序号" width="55px" type="index" align="center" />
            <el-table-column label="清退供应商" min-width="100px" prop="supplierName" align="center" />
            <el-table-column label="清退说明" min-width="80px" prop="description" align="center" />
            <el-table-column label="备注" min-width="150px" prop="remark" align="center" :show-overflow-tooltip="true"/>
          </el-table>
        </div>
      </div>

      <!--变更记录-->
      <div v-if="processKey===processConstant.changeProcessKey">
        <change-form :data="changeForm" :show-title="false"/>
      </div>

      <!--RFI-->
      <div v-if="processKey===processConstant.RFI">
        <RFIForm :data="rfiForm" :selector-list="selectorList" :active-task-key="activeTaskKey" :disabled="true" @submit="submitRFI"/>
      </div>

      <div v-if="processKey === processConstant.sourceProcessKey">
        <source-form :data="sourceForm" :disabled="true"/>
      </div>

    </el-card>
  </div>
</template>

<script>
import potentialReqBaseForm from '../../inventory-mgt/components/potentialReqBaseForm'
import approvedReqBaseForm from '../../inventory-mgt/components/approvedReqBaseForm'
import changeForm from '../../record-mgt/components/changeForm'
import RFIForm from '../../inventory-mgt/components/RFIForm'
import constant from '../../inventory-mgt/constant/constant'
import processConstant from '../constant/constant'
import { deepClone } from '../../../../utils'
import { getPotentialByProcessInstanceId,getApprovedByProcessInstanceId, getApprovedReqByProcess } from '../../../../api/asgt/supplier/requirement'
import { getClearByProcessInstanceId } from '../../../../api/asgt/recordMgt/clearRecord'
import {
  getChangeByProcessInstanceId,
  getSupplierByProcessInstanceId
} from '../../../../api/asgt/recordMgt/changeRecord'
import SourceForm from '@/views/asgt/workflow/components/sourceForm'

export default {
  name: 'baseForm',
  components: {
    SourceForm,
    potentialReqBaseForm,approvedReqBaseForm,changeForm,RFIForm
  },
  props:{
    // 用于判断流程
    processKey:{
      type: String,
      default: ''
    },
    processInstanceId:{
      type: String,
      default: ''
    },
    selectorList:{
      type: Array,
      default: ()=>[]
    },
    activeTaskKey:{
      type: String,
      default: ""
    }
  },
  computed: {
    purchaseTotal(){
      let res = 0
      if (this.purchaseList){
        if (this.purchaseList.length!==0){
          this.purchaseList.forEach(item=>{
            res += item.price * item.num
          })
        }
        return res
      }
    }
  },
  created() {
  },
  data(){
    return{
      companyNatureMap: constant.companyNatureMap,
      potentialForm: {},
      approvedForm: {},
      purchaseList: [],
      supplierList: [],
      removeForm: {},
      supplierInfo: [],
      changeForm: {},
      rfiForm: {},
      sourceForm:{},
      processConstant
    }
  },
  methods:{
    setDefault(){
      this.rfiForm = {};
      this.potentialForm = {};
      this.approvedForm = {};
      this.removeForm = {};
      this.changeForm = {};
      this.sourceForm = {};
      // 潜在
      if (this.processKey===processConstant.potentialProcessKey){
        let query = {
          processInstanceId: this.processInstanceId
        }
        getPotentialByProcessInstanceId(query).then(res=>{
          this.potentialForm = res.data
          this.supplierList = deepClone(res.data.supplierList)
          this.supplierList.map(item=>item.supplierId=item.id)
        })
      }
      // 获批
      else if (this.processKey===processConstant.approvedProcessKey){
        let query = {
          processInstanceId: this.processInstanceId
        }
        getApprovedByProcessInstanceId(query).then(res=>{
          this.approvedForm = res.data
          this.purchaseList = deepClone(res.data.purchaseList)
        })
      }
      // 清退
      else if (this.processKey===processConstant.clearProcessKey){
        getClearByProcessInstanceId(this.processInstanceId).then(res=>{
          this.removeForm = res.data
          this.supplierInfo = deepClone(res.data.supplierList)
          this.supplierInfo.map(item=>item.supplierId=item.id)
        })
      }
      // 变更
      else if (this.processKey===processConstant.changeProcessKey){
        getChangeByProcessInstanceId(this.processInstanceId).then(res=>{
          this.changeForm = res.data
        })
      }
      // RFI
      else if (this.processKey===processConstant.RFI){
        let query = {
          searchId: this.processInstanceId,
          processKey: this.processKey
        }
        getApprovedReqByProcess(query).then(res=>{
          this.rfiForm = res.data
        })
      }
      //source
      else if (this.processKey === processConstant.sourceProcessKey){
        getSupplierByProcessInstanceId(this.processInstanceId).then(res=>{
          this.sourceForm = res.data
        })
      }
      // RFP
      // RFQ
    },
    submitRFI(data,isClose){
      this.$emit("submitForm",data)
      this.$emit('close',false)
    },
    itemTotal(num, price) {
      return num * price
    },
  }
}
</script>

<style scoped>
.base-form-div{
  margin: 0 35px 35px 35px;
}

</style>
