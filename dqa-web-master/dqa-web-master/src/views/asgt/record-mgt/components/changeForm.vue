<template>
  <div style="margin: 40px">
    <h2 v-if="showTitle" style="text-align: center;margin: 0 0 40px 0;font-weight: bold">供应商变更记录表</h2>
    <div style="text-align: right;font-size: 16px;margin: 0 0 40px 0;">
      <span>入册申请单位：{{data.companyName}}</span>
    </div>
    <el-descriptions title="基本信息" :column="4" style="margin-bottom: 50px;margin-top: 40px" border>
      <el-descriptions-item label="供应商名称" label-style="width: 200px" content-style="width: 450px">{{data.supplierName}}</el-descriptions-item>
      <el-descriptions-item label="控股公司名称" label-style="width: 200px" content-style="width: 450px">{{data.holdingCompany}}</el-descriptions-item>
      <el-descriptions-item label="商业注册号" label-style="width: 200px" content-style="width: 450px">{{data.businessNum}}</el-descriptions-item>
      <el-descriptions-item label="成立时间" label-style="width: 200px" content-style="width: 450px">{{data.establishDate}}</el-descriptions-item>
      <el-descriptions-item label="法人姓名" label-style="width: 200px" content-style="width: 450px">{{data.juristicPersonName}}</el-descriptions-item>
      <el-descriptions-item label="注册资本" label-style="width: 200px" content-style="width: 450px">{{data.registeredCapital}}万元</el-descriptions-item>
      <el-descriptions-item label="公司性质" label-style="width: 200px" content-style="width: 450px">{{companyNatureMap[data.companyNature]}}</el-descriptions-item>
      <el-descriptions-item label="注册地址" label-style="width: 200px" content-style="width: 450px">{{data.registeredAddress}}</el-descriptions-item>
      <el-descriptions-item label="竞争优势" :span="4" label-style="width: 200px" content-style="width: 450px">{{data.advantage}}</el-descriptions-item>
      <el-descriptions-item label="业务描述" :span="4" label-style="width: 200px" content-style="width: 450px">{{data.businessDescription}}</el-descriptions-item>
    </el-descriptions>
    <el-descriptions title="财务信息" :column="1" border>
      <el-descriptions-item label="会计年度开始日期" label-style="width: 350px;">{{data.fiscalStartDate}}</el-descriptions-item>
      <el-descriptions-item label="银行综合资信证明" label-style="width: 350px;">
        <div style="width: 50%">
          <oss-file-upload v-model="data.creditCertificateFile" :disabled="true"/>
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="适上三个会计年度经审计的营业收入额" label-style="width: 350px;">{{data.lastQuarterEarn}}万元</el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script>
import constant from '../../inventory-mgt/constant/constant'
export default {
  name: 'changeForm',
  props:{
    data:{
      type: Object,
      default: () => ({
        companyName: '',
        supplierName: '',
        holdingCompany: '',
        businessNum: '',
        establishDate: '',
        juristicPersonName: '',
        registeredCapital: '',
        companyNature: '',
        registeredAddress: '',
        advantage: '',
        businessDescription: '',
        fiscalStartDate: '',
        creditCertificateFile: '',
        lastQuarterEarn: 0
      })
    },
    showTitle:{
      type: Boolean,
      default: true
    }
  },
  data(){
    return{
      companyNatureMap: constant.companyNatureMap,
    }
  },
  methods:{
    submitForm(){
      this.$emit("submitForm", JSON.stringify(this.data));
    }
  }
}
</script>

<style scoped>
</style>
