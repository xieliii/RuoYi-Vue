<template>
  <div style="height: 100%">
    <div style="margin: 0 40px 0 40px;">
      <h1 style="text-align: center;font-weight: bold;" v-if="titleVisible">供应商清退审批表</h1>
      <el-row>
        <el-col :span="12">
          <div style="margin: 12px" v-if="!disabled">
            <el-row>
              <el-col :span="7.5">
                <el-button icon="el-icon-plus" @click="addRemoveSupplier" type="primary" size="small" plain>插入行</el-button>
              </el-col>
              <el-col :span="5">
                <supplier-multiple-select :button-style="'margin-left: 10px'" :supplier-list="selectorList" :exist-ids="removeIds" @getSupplierInfo="multipleRemove"/>
              </el-col>
              <el-button icon="el-icon-check" @click="submitRemoveSupplier" type="success" size="small" plain>提交</el-button>
            </el-row>
          </div>
        </el-col>
      </el-row>
      <div style="font-size: 18px;margin: 5px 5px">
        <el-row>
          <el-col :span="2">
            <div style="font-size: 16px; margin-top: 10px;">
              <span>清退凭据材料：</span>
            </div>
          </el-col>
          <el-col :span="5">
            <div>
              <oss-file-upload v-model="fileId" :disabled="disabled"/>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div style="margin: 20px 40px 0 40px">
      <el-table :data="removeForm" :row-class-name="rowClassName" border>
        <el-table-column label="序号" align="center" prop="xh" width="50" />
        <el-table-column label="清退供应商名单" align="center" prop="id" min-width="200px">
          <template slot-scope="{row,$index}">
            <supplier-select v-model="removeForm[row.xh-1].supplierId" :input-style="'width: 90%'" :list-index="(row.xh-1)"
                             :supplier-list="selectorList" @getInfo="removeSelectSupplier" :disabled="disabled"/>
          </template>
        </el-table-column>
        <el-table-column label="清退说明" align="center" prop="description" min-width="400px">
          <template slot-scope="{row,$index}">
            <el-input v-model="removeForm[row.xh-1].description" placeholder="请输入清退说明" style="width: 90%" :disabled="disabled"/>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark" min-width="280px">
          <template slot-scope="{row,$index}">
            <el-input v-model="removeForm[row.xh-1].remark" placeholder="请输入清退说明" style="width: 90%" :disabled="disabled"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="100px" v-if="!disabled">
          <template slot-scope="{row,$index}">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="deleteRemoveSupplier(row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import supplierMultipleSelect from '../../inventory-mgt/components/supplierMultipleSelect'
import supplierSelect from '../../inventory-mgt/components/supplierSelect'
import { addClearRecords } from '../../../../api/asgt/recordMgt/clearRecord'
import { listAllSupplierByKind } from '../../../../api/asgt/supplier/supplierBase'
import { startProcess } from '../../../../api/workflow/workflow-common'
import constant from '../constant/constant'
import { deepClone } from '../../../../utils'
export default {
  name: 'clearForm',
  components:{
    supplierMultipleSelect,supplierSelect
  },
  props:{
    processInstanceId:{
      type: String,
    },
    type: {
      type: String,
    },
    titleVisible: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => ({})
    },
    selectorList:{
      type: Array,
      default: () => []
    },
  },
  watch:{
    removeForm:{
      handler(val){
        val.forEach(item=>{
          if (item.supplierId!==undefined && item.supplierId!==null){
            this.removeIds.push(item.supplierId)
          }
        })
      },
      deep: true
    },
    data:{
      handler(val){
        if (val){
          this.removeForm = deepClone(val.supplierList)
          this.fileId = val.fileId
          console.log(val)
        }
      }
    }
  },
  data(){
    return{
      removeForm: [{ supplierId: null, description: null,remark: null }],
      removeIds: [],
      fileId: '',
    }
  },
  methods:{
    // 提交清退审批表
    submitRemoveSupplier(){
      let flag = true
      for (let item of this.removeForm)
      {
        if(item.supplierId === null){
          flag = false
          this.$message.error('存在重复供应商')
          return;
        }
      }
      if (this.removeForm.length===0){
        flag = false
        this.$message.error('未选择供应商')
      }
      if (flag){
        let data = {}
        data.supplierIdList = this.removeForm
        data.fileId = this.fileId
        startProcess(JSON.stringify(data),constant.clearProcessKey).then(res=>{
          this.$emit("close",false)
          this.$message.success("成功发起清退流程")
        })
      }
    },
    // 清退审批表
    multipleRemove(ids,data){
      let arr = data.map(item=>{
        return{
          supplierId: item.id,
        }
      })
      for (let item of arr){
        let sign = true
        for (let existItem of this.removeForm){
          if (item.supplierId===existItem.supplierId){
            sign = false
          }
        }
        if (sign){
          this.removeForm.push(item)
        }
      }
    },
    // 单选供应商
    removeSelectSupplier(id,data,index){
      let sign = true
      for (let item of this.removeForm) {
        if (id===item.supplierId){
          sign = false
        }
      }
      if (sign){
        this.removeForm[index].supplierId = id
      }
      else {
        this.removeForm[index].supplierId = null
        this.$message.error("已添加过该供应商，请重新选择")
      }
    },
    rowClassName({ row, rowIndex }) {
      row.xh = rowIndex + 1;
    },
    addRemoveSupplier(){
      this.removeForm.push({
        supplierId: null,
        description: null,
        remark: null,
      })
    },
    deleteRemoveSupplier(item){
      let index = this.removeForm.indexOf(item)
      if (index !== -1) {
        this.removeForm.splice(index, 1)
      }
    },
  },
  mounted() {
  }
}
</script>

<style scoped>

</style>
