<template>
  <div style="margin: 0 70px 0 70px">
    <h1 style="text-align: center;margin: 0 0 40px 0;">供应商详情</h1>
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
    <el-descriptions title="财务信息" :column="3" style="margin-bottom: 50px" border>
      <el-descriptions-item label="会计年度开始日期" label-style="width: 160px;">{{data.fiscalStartDate}}</el-descriptions-item>
      <el-descriptions-item label="银行综合资信证明" label-style="width: 160px;">
        <div style="width: 80%">
          <oss-file-upload v-model="data.creditCertificateFile" :disabled="true"/>
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="适上三个会计年度经审计的营业收入额" label-style="width: 320px;">{{data.lastQuarterEarn}}万元</el-descriptions-item>
    </el-descriptions>

    <h3 style="font-weight: bolder; color: black">联系人信息</h3>
    <el-table :data="contactInfo" >
      <el-table-column label="序号" width="55px" type="index" align="center" />
      <el-table-column label="联系人姓名" prop="name" align="center" />
      <el-table-column label="职位" prop="position" align="center" />
      <el-table-column label="电话" prop="phone" align="center" />
      <el-table-column label="手机" prop="telephone" align="center" />
      <el-table-column label="邮箱" prop="email" align="center" />
      <el-table-column label="传真" prop="fax" align="center" />
    </el-table>

    <h3 style="margin-top: 50px; font-weight: bolder; color: black">业务信息</h3>
    <el-table :data="businessInfo" >
      <el-table-column label="序号" width="55px" type="index" align="center" />
      <el-table-column label="飞机制造商客户" prop="customer" align="center" />
      <el-table-column label="在研民机项目" prop="aircraftProjects" align="center" />
      <el-table-column label="分包商" prop="subcontractor" align="center" />
    </el-table>

    <h3 style="margin-top: 50px; font-weight: bolder; color: black">主要产品信息</h3>
    <el-table :data="productInfo" >
      <el-table-column label="序号" width="55px" type="index" align="center" />
      <el-table-column label="名称" prop="name" align="center" />
      <el-table-column label="产品/服务" prop="kindCode" align="center" >
        <template slot-scope="scope">

        </template>
      </el-table-column>
      <el-table-column label="型号" prop="productModel" align="center" />
      <el-table-column label="供应商类别" prop="kindCode" align="center" >
        <template slot-scope="scope">
          <span>{{ supplierCategoryMap[scope.row.kindCode] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="取证情况" prop="fileId" align="center">

      </el-table-column>
    </el-table>

    <h3 style="margin-top: 50px; font-weight: bolder; color: black">认证信息</h3>
    <el-table :data="authorityInfo" >
      <el-table-column label="序号" width="55px" type="index" align="center" />
      <el-table-column label="认证标准" prop="standard" align="center" />
      <el-table-column label="证书编号" prop="certificateNo" align="center" />
      <el-table-column label="认证范围" prop="certificationScope" align="center" />
      <!--需要validityStartTime和validityEndTime拼接-->
      <el-table-column label="有效期" prop="validityTime" align="center" />
      <el-table-column label="认证资料" prop="fileId" align="center" />
    </el-table>
  </div>
</template>

<script>
import constant from '../constant/constant'
export default {
  name: 'supplierDetail',
  props:{
    data:{
      type: Object,
      default: () => ({
        companyName: '',
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
        lastQuarterEarn: 0,
      })
    },
    contactInfo: { type: Array, default: () => ([]) },
    productInfo: { type: Array, default: () => ([]) },
    businessInfo: { type: Array, default: () => ([]) },
    authorityInfo: { type: Array, default: () => ([]) },
  },
  data(){
    return{
      // contactInfo:[],
      // businessInfo: [],
      // productInfo: [],
      // authorityInfo: [],
      companyNatureMap: constant.companyNatureMap,
      supplierCategoryMap: constant.supplierCategoryMap,
    }
  },
  created() {
    this.handleData();
  },
  methods:{
    handleData(){
      for (let i=0;i < this.authorityInfo.length;i++){
        this.authorityInfo[i].validityTime = this.authorityInfo[i].validityEndTime + '至' + this.authorityInfo[i].validityStartTime
      }
    }
  }
}
</script>

<style scoped>

</style>
