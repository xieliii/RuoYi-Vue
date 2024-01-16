<template>
  <div>
    <el-form ref="approvedForm" :model="approvedForm" label-width="120px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="项目编号" prop="projectCode">
            <el-input v-model="approvedForm.projectCode" placeholder="请输入项目编号" style="width: 75%" :disabled="formDisabled"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="项目名称" prop="projectName">
            <el-input v-model="approvedForm.projectName" placeholder="请输入项目名称" style="width: 75%" :disabled="formDisabled"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="供应商类别" prop="category">
            <el-select v-model="approvedForm.category" placeholder="请选择供应商类别" style="width: 75%" :disabled="formDisabled">
              <el-option v-for="item in supplierType" :key="item.value" :value="item.value" :label="item.label" /></el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="需求编号" prop="reqCode">
            <el-input v-model="approvedForm.reqCode" placeholder="请输入需求编号" style="width: 75%" :disabled="formDisabled"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="需求交付时间" prop="reqDeliveryTime">
            <el-date-picker v-model="approvedForm.reqDeliveryTime" type="date" placeholder="请选择需求交付时间"
                            format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" style="width: 75%" :disabled="formDisabled"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="采购申请时间">
            <el-date-picker v-model="approvedForm.creatorTime" type="date" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" style="width: 75%" :disabled="formDisabled"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <!--主管selector-->
        <el-col :span="8">
          <el-form-item label="申请人" prop="fileId">
            <el-input v-model="approvedForm.creatorUser" placeholder="请选择供应商部门主管" style="width: 75%" :disabled="formDisabled"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="需求附件" prop="fileId">
            <oss-file-upload v-model="approvedForm.fileId" :disabled="formDisabled"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import constant from '../constant/constant'

export default {
  name: 'potentialBaseForm',
  props:{
    formDisabled: {
      type: Boolean,
      default: false
    },
    approvedForm:{
      type: Object,
      default: ()=>({})
    }
  },
  data(){
    return{
      supplierType: constant.supplierType,
    }
  },
}
</script>

<style scoped>

</style>
