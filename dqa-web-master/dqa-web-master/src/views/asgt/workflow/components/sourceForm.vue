<template>
  <div style="margin: 15px">
    <el-form ref="form" :model="form" :rules="rules" label-width="150px" :disabled="disabled">
      <div style="position: relative;top: 20px">
        <div  style="margin: 10px 30px 20px 30px">
          <h3 style="margin-bottom: 20px;font-weight: bold">基本信息</h3>
          <el-row>
            <el-col :span="8">
              <el-form-item label="供应商名称" prop="supplierName">
                <el-input v-model="form.supplierName" placeholder="请输入供应商名称" style="width: 80%"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="供应商编号" prop="code">
                <el-input v-model="form.code" placeholder="请输入供应商编号" style="width: 80%"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="控股公司名称" prop="holdingCompany">
                <el-input v-model="form.holdingCompany" placeholder="请输入控股公司名称" style="width: 80%"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="商业注册号" prop="businessNum">
                <el-input v-model="form.businessNum" placeholder="请输入商业注册号" style="width: 80%"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="成立时间" prop="establishDate">
                <el-date-picker v-model="form.establishDate" placeholder="请选择成立时间" style="width: 80%" type="date"
                                format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="法人姓名" prop="juristicPersonName">
                <el-input v-model="form.juristicPersonName" placeholder="请输入法人姓名" style="width: 80%"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="注册资本(万元)" prop="registeredCapital">
                <el-input v-model="form.registeredCapital" type="number" placeholder="请输入注册资本（万元）" style="width: 80%"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="公司性质" prop="companyNature">
                <el-select v-model="form.companyNature" placeholder="请选择公司性质" style="width: 80%">
                  <el-option v-for="item in companyNatureOptions" :value="item.value" :key="item.value" :label="item.label"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="注册地址" prop="registeredAddress">
                <el-input v-model="form.registeredAddress" placeholder="请输入注册地址" style="width: 80%"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="竞争优势" prop="advantage">
                <el-input v-model="form.advantage" placeholder="请输入竞争优势" style="width: 80%"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="业务描述" prop="businessDescription">
                <el-input v-model="form.businessDescription" placeholder="请输入业务描述" style="width: 80%"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="等级" prop="level">
                <el-select v-model="form.level" placeholder="请选择等级" style="width: 80%">
                  <el-option v-for="item in levelOptions" :value="item.value" :key="item.value" :label="item.label"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="合格评定" prop="isQualified">
                <el-select v-model="form.isQualified" placeholder="请选择合格评定" style="width: 80%">
                  <el-option v-for="item in qualityOptions" :value="item.value" :key="item.value" :label="item.label"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="合格有效期" prop="qualifiedDate">
                <el-date-picker v-model="form.qualifiedDate" type="date" placeholder="请选择合格有效期"
                                format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" style="width: 80%"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="供应商状态" prop="status">
                <el-input v-model="form.status" placeholder="请输入供应商状态" style="width: 80%"/>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div  style="margin: 10px 30px 10px 30px;">
          <h3 style="margin-bottom: 20px;font-weight: bold">财务信息</h3>
          <el-row>
            <el-col :span="8">
              <el-form-item label="会计年度开始日期" label-width="150px" prop="fiscalStartDate">
                <el-date-picker v-model="form.fiscalStartDate" type="date" placeholder="请选择会计年度开始日期"
                                format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" style="width: 80%"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="银行综合资信证明" label-width="150px" prop="creditCertificateFile">
                <oss-file-upload v-model="form.creditCertificateFile" :disabled="disabled" style="width: 80%"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="营业收入额（万元）" label-width="150px" prop="lastQuarterEarn">
                <el-input v-model="form.lastQuarterEarn" type="number" placeholder="上三个月会计年度经审计的营业收入额" style="width: 80%"/>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <!--联系人-->
        <div  style="margin: 10px 30px 10px 30px;" v-if="form.contacts && form.contacts.length !== 0">
          <h3 style="margin-bottom: 20px;font-weight: bold">联系人信息</h3>
          <el-form ref="contactForm" label-width="15px" style="padding-left: 20px" :disabled="disabled">
            <el-form-item
              v-for="(domain, index) in form.contacts"
              :label="index+1 +'.'"
              :key="index">
              <el-row>
                <el-col :span="4">
                  联系人   <el-input style="width: 75%;display: inline-block" :rows="1" v-model="domain.name" placeholder="请输入联系人姓名" clearable/>
                </el-col>
                <el-col :span="4">
                  职位   <el-input style="width: 75%;display: inline-block" :rows="1" v-model="domain.position" placeholder="请输入职位" clearable/>
                </el-col>
                <el-col :span="4">
                  电话   <el-input style="width: 73%;display: inline-block" :rows="1" v-model="domain.phone" placeholder="请输入电话" maxlength="12" show-word-limit />
                </el-col>
                <el-col :span="4">
                  手机   <el-input style="width: 73%;display: inline-block" :rows="1" v-model="domain.telephone" placeholder="请输入手机" maxlength="11" show-word-limit/>
                </el-col>
                <el-col :span="4">
                  邮箱   <el-input style="width: 73%;display: inline-block" :rows="1" v-model="domain.email" placeholder="请输入邮箱" clearable/>
                </el-col>
                <el-col :span="4">
                  传真   <el-input style="width: 75%;display: inline-block" :rows="1" v-model.number="domain.fax" placeholder="请输入传真" clearable/>
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
        </div>
        <!--业务-->
        <div  style="margin: 10px 30px 10px 30px;" v-if="form.businessInfo && form.businessInfo.length !== 0">
          <h3 style="margin-bottom: 20px;font-weight: bold">业务信息</h3>
          <el-form ref="businessForm" label-width="15px" style="padding-left: 20px" :disabled="disabled">
            <el-form-item
              v-for="(domain, index) in form.businessInfo"
              :label="index+1 +'.'"
              :key="index">
              <el-row>
                <el-col :span="8">
                  飞机制造商客户   <el-input style="width: 70%;display: inline-block" :rows="1" v-model="domain.customer" placeholder="飞机制造商客户" clearable />
                </el-col>
                <el-col :span="8">
                  在研民机项目   <el-input style="width: 70%;display: inline-block" :rows="1" v-model="domain.aircraftProjects" placeholder="请输入在研民机项目" clearable />
                </el-col>
                <el-col :span="8">
                  分包商   <el-input style="width: 70%;display: inline-block" :rows="1" v-model="domain.subcontractor" placeholder="请输入分包商" clearable />
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
        </div>
        <!--产品-->
        <div  style="margin: 10px 30px 10px 30px;" v-if="form.productsInfo && form.productsInfo.length !== 0">
          <h3 style="margin-bottom: 20px;font-weight: bold">产品信息</h3>
          <el-form ref="productForm" label-width="15px" style="padding-left: 20px" :disabled="disabled">
            <el-form-item
              v-for="(domain, index) in form.productsInfo"
              :label="index+1 +'.'"
              :key="index">
              <el-row>
                <el-col :span="4">
                  产品/服务   <el-select v-model="domain.kindCode" placeholder="请选择产品/服务" style="width: 65%">
                  <el-option v-for="item in productKind" :label="item.label" :value="item.value" :key="item.value"/></el-select>
                </el-col>
                <el-col :span="4">
                  名称   <el-input style="width: 75%;display: inline-block" :rows="1" v-model="domain.name" placeholder="请输入产品/服务名称"></el-input>
                </el-col>
                <el-col :span="4">
                  产品唯一   <el-input style="width: 65%;display: inline-block" :rows="1" v-model="domain.productUnique" placeholder="请输入产品唯一" clearable />
                </el-col>
                <el-col :span="4">
                  型号   <el-input style="width: 70%;display: inline-block" :rows="1" v-model="domain.productModel" placeholder="请输入型号" clearable/>
                </el-col>
                <el-col :span="4">
                  供应商类别   <el-select v-model="domain.supplierType" placeholder="请选择供应商类别" style="width: 65%" clearable>
                  <el-option v-for="item in supplierType" :label="item.label" :value="item.value" :key="item.value"/></el-select>
                </el-col>
                <el-col :span="4">
                  <div style="margin-left: 12px">
                    <el-row>
                      <el-col :span="10"><span>取证情况</span></el-col>
                      <el-col :span="14"><oss-file-upload v-model="domain.fileId" :disabled="disabled"/></el-col>
                    </el-row>
                  </div>
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
        </div>
        <!--认证-->
        <div  style="margin: 10px 30px 10px 30px;" v-if="form.authenticationInfo && form.authenticationInfo.length !== 0">
          <h3 style="margin-bottom: 20px;font-weight: bold">认证信息</h3>
          <el-form ref="authorityForm" label-width="20px" style="padding-left: 20px" :disabled="disabled">
            <el-form-item
              v-for="(domain, index) in form.authenticationInfo"
              :label="index+1 +'.'"
              :key="index">
              <el-row>
                <el-col :span="4">
                  认证标准   <el-input style="width: 73%;display: inline-block" :rows="1" v-model="domain.standard" placeholder="例如ASE AS9100, ISO 9001等" clearable />
                </el-col>
                <el-col :span="4">
                  证书编号   <el-input style="width: 73%;display: inline-block" :rows="1" v-model="domain.certificateNo" placeholder="请输入证书编号" clearable />
                </el-col>
                <el-col :span="4">
                  认证范围   <el-input style="width: 73%;display: inline-block" :rows="1" v-model="domain.certificationScope" placeholder="请输入认证范围" clearable />
                </el-col>
                <el-col :span="7">
                  有效期   <el-date-picker v-model="domain.validityStartTime" type="date" placeholder="有效开始日期" format="yyyy年MM月dd日" value-format="yyyy-MM-dd" style="width: 40%"/>
                  - <el-date-picker v-model="domain.validityEndTime" type="date" placeholder="有效结束日期" format="yyyy年MM月dd日" value-format="yyyy-MM-dd" style="width: 40%"/>
                </el-col>
                <el-col :span="5">
                  <div style="margin-left: 12px">
                    <el-row>
                      <el-col :span="6"><span>认证资料</span></el-col>
                      <el-col :span="18"><oss-file-upload v-model="domain.fileId" :disabled="disabled"/></el-col>
                    </el-row>
                  </div>
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-form>
    <!--    </el-card>-->
    <div style="text-align: right;margin-top: 20px">
      <el-button v-if="!disabled" type="primary" @click="createForm">提 交</el-button>
    </div>
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import constant from '@/views/asgt/inventory-mgt/constant/constant'
import processConstant from '@/views/asgt/workflow/constant/constant'
import { startProcess } from '@/api/workflow/workflow-common'

export default {
  name: 'sourceForm',
  props:{
    disabled:{
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => ({})
    },
    selectorList: {
      default: () => ([])
    }
  },
  watch:{
    data:{
      handler(val){
        if (val){
          console.log(val)
          this.form = deepClone(val)
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
      rules:{
        supplierName: [
          { required: true, message: "供应商名称不能为空", trigger: "blur" }
        ],
        code: [
          { required: true, message: "供应商编码不能为空", trigger: "change" }
        ]
      },
      form:{},
      purchaseInfo: [],
      currentDate: new Date(),
      supplierType: constant.supplierType,
      processConstant,
      companyNatureOptions: constant.companyNatureOptions,
      levelOptions: constant.levelOptions,
      qualityOptions: constant.qualityOptions,
      productKind: constant.productKind,
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
  methods:{
    createForm(){
      startProcess(JSON.stringify(this.form),processConstant.approvedProcessKey).then(res=>{
        this.$message.success("成功发起货源供应商入册流程")
      })
    },
    submitForm(){
      this.$emit("submitForm", JSON.stringify(this.form));
    },
  }
}
</script>

<style scoped>

</style>
