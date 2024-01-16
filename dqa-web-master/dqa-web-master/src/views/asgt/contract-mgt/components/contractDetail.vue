<template>
<div>
  <h1 style="text-align: center;font-weight: bold;font-size: 24px">合同详情</h1>
  <h3 style="margin-left: 50px;margin-bottom: 20px;font-weight: bold">基本信息</h3>
  <el-descriptions style="margin-left: 40px;margin-right: 40px" :column="2" border>
      <el-descriptions-item label="合同名称" >
        {{contractForm.name}}
      </el-descriptions-item>
      <el-descriptions-item label="编号" >
        {{ contractForm.code }}
      </el-descriptions-item>
      <el-descriptions-item label="类型" >
        {{ contractForm.contractType }}
      </el-descriptions-item>
      <el-descriptions-item label="开始日期" >
        {{ contractForm.startDate }}
      </el-descriptions-item>
      <el-descriptions-item label="到期日期" >
        {{ contractForm.endDate }}
      </el-descriptions-item>
      <el-descriptions-item label="状态" >
        {{contractForm.statusLabel}}
      </el-descriptions-item>
      <el-descriptions-item label="乙方供应商" >
        {{contractForm.supplierName}}
      </el-descriptions-item>
      <el-descriptions-item label="乙方负责人" >
        <!--人员选择器-->
        {{ contractForm.supplierPrincipal }}
      </el-descriptions-item>
      <el-descriptions-item label="联系电话" >
        <!--人员选择器-->
        {{ contractForm.telephone }}
      </el-descriptions-item>
      <!--单位选择器-->
      <el-descriptions-item label="需求单位" >
        {{ contractForm.companyId }}
      </el-descriptions-item>
      <el-descriptions-item label="项目名称" >
        {{ contractForm.projectName }}
      </el-descriptions-item>
      <el-descriptions-item label="项目负责人" >
        {{ contractForm.projectPrincipal }}
      </el-descriptions-item>
      <el-descriptions-item label="附件" >
        <oss-file-upload v-model="contractForm.contractFile" :disabled="true"/>
      </el-descriptions-item>
      <el-descriptions-item label="主要内容" >
        {{ contractForm.content }}
      </el-descriptions-item>
  </el-descriptions>
  <h3 style="margin-left: 50px;margin-bottom: 20px;font-weight: bold">乙方产品信息</h3>
    <el-descriptions style="margin-left: 40px;margin-right: 40px" :column="3" border>
      <template
        v-for="(domain, index) in contractForm.productList"
        >
        <el-descriptions-item label="产品/服务" :key="domain.id">
          {{ domain.name }}
        </el-descriptions-item>
        <el-descriptions-item label="类别" :key="domain.id">
          {{domain.typeLabel}}
        </el-descriptions-item>
        <el-descriptions-item label="型号" :key="domain.id">
          {{domain.productModel }}
        </el-descriptions-item>
      </template>
    </el-descriptions>
</div>
</template>

<script>
import constant from '@/views/asgt/contract-mgt/constant/constant'
import supplierConstant from '@/views/asgt/inventory-mgt/constant/constant'

export default {
  name: 'contractDetail',
  props:{
    data:{
      type: Object,
      default: () => {}
    },
    selectorList:{
      type:Array,
      default: () => []
    }
  },
  watch:{
    data(val){
      this.setValue();

    }
  },
  data(){
    return{
      contractForm:{},
      contractStatusOptions: constant.contractStatusOptions,
      contractStatusMap: constant.contractStatusMap,
      supplierType: constant.supplierType,
      companyNatureOptions: supplierConstant.companyNatureOptions,
    }
  },
  methods:{
    setValue(){
      this.contractForm = this.data;
      for (const ele of this.contractStatusOptions) {
        if (ele.value === this.contractForm.status){
          this.contractForm.statusLabel = ele.label
        }
      }
      for (const ele of this.selectorList) {
        if (ele.id === this.contractForm.supplierId){
          this.contractForm.supplierName = ele.supplierName
        }
      }
      for (const ele of this.supplierType) {
        this.contractForm.productList.forEach(item => {
          if (ele.value === item.supplierType){
            item.typeLabel = ele.label;
          }
        })
      }
    }
  },
}
</script>

<style scoped>
>>>.upload-file-list .el-upload-list__item[data-v-611c528f]{
  border: 0;
}
</style>
