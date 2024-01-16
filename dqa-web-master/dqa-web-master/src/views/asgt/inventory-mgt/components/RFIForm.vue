<template>
  <div>
<!--    <div style="margin: 0 32px 40px 0;height: 120px;top: 0;" class="fix-div">-->
<!--      <h1 class="title-class">获批供应商入册-编制RFI</h1>-->
<!--    </div>-->
    <div>
      <el-form ref="approvedForm" :model="approvedForm" label-width="120px">
        <!--基本信息-->
        <div class="card-div">
          <h3 class="topic-class">基本信息</h3>
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
        </div>
        <!--采购明细-->
        <div class="card-div">
          <h3 class="topic-class">采购明细</h3>
          <el-table :data="purchaseInfo" style="margin-bottom: 30px">
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
        <!--过程文档-->
        <div class="card-div">
          <h3 class="topic-class">过程文档</h3>
          <el-row style="padding-left: 20px;">
            <el-col :span="8">
              <el-form-item label="上传编制RFI文件" prop="rfiId">
                <oss-file-upload v-model="approvedForm.rfiId" :disabled="rfiDisabled||RFITaskKeyMap[activeTaskKey]!==1"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="单一货源说明" prop="singleReport" v-if="RFITaskKeyMap[activeTaskKey]>2">
                <oss-file-upload v-model="approvedForm.singleReport" :disabled="rfiDisabled||RFITaskKeyMap[activeTaskKey]!==3"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="上传RFI评估报告" prop="estimateReport" v-if="RFITaskKeyMap[activeTaskKey]>=5">
                <oss-file-upload v-model="approvedForm.estimateReport" :disabled="rfiDisabled||RFITaskKeyMap[activeTaskKey]!==5"/>
              </el-form-item>
<!--              <el-form-item v-if="" label="上传RFP评估报告" prop="estimateReport">-->
<!--                <oss-file-upload v-model="approvedForm.estimateReport"/>-->
<!--              </el-form-item>-->
<!--              <el-form-item v-if="" label="上传RFQ评估报告" prop="estimateReport">-->
<!--                <oss-file-upload v-model="approvedForm.estimateReport"/>-->
<!--              </el-form-item>-->
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="是否开启RFP" prop="needRfpFlag" v-if="RFITaskKeyMap[activeTaskKey]>=5">
                <el-select v-model="approvedForm.needRfpFlag" placeholder="是否需要继续进行RFP流程" style="width: 70%" :disabled="RFITaskKeyMap[activeTaskKey]!==5">
                  <el-option v-for="item in yesOrNo" :label="item.label" :value="item.value" :key="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <!--供应商信息-->
        <div class="card-div" v-if="RFITaskKeyMap[activeTaskKey]>2">
          <h3 class="topic-class">供应商信息</h3>
          <el-form ref="supplierInfo" label-width="15px" style="padding-left: 20px">
            <el-form-item
              v-for="(domain, index) in supplierList"
              :label="index+1 +'.'"
              :key="index">
              <el-row>
                <el-col :span="5">
                  <el-row>
                    <el-col :span="5">供应商</el-col>
                    <el-col :span="19">
                      <supplier-select v-model="domain.supplierId" :list-index="index" :supplier-list="selectorList" :disabled="RFITaskKeyMap[activeTaskKey]!==3"
                                       :kind="2" :input-style="'width: 90%'" @getInfo="getInfo"/>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="5" v-if="RFITaskKeyMap[activeTaskKey]>=5">
                  <el-row>
                    <el-col :span="6"><span>回复RFI</span></el-col>
                    <el-col :span="18"><oss-file-upload v-model="domain.rfiId" :disabled="RFITaskKeyMap[activeTaskKey]!==5"/></el-col>
                  </el-row>
<!--                  <el-row v-if="">-->
<!--                    <el-col :span="5"><span>回复RFP</span></el-col>-->
<!--                    <el-col :span="2"><oss-file-upload v-model="domain.rfpId"/></el-col>-->
<!--                  </el-row>-->
<!--                  <el-row  v-if="">-->
<!--                    <el-col :span="5"><span>回复RFQ</span></el-col>-->
<!--                    <el-col :span="2"><oss-file-upload v-model="domain.rfqId"/></el-col>-->
<!--                  </el-row>-->
                </el-col>
                <el-col :span="6" v-if="RFITaskKeyMap[activeTaskKey]>=5">
                  RFI是否通过   <el-select v-model="domain.approvedFlag" placeholder="是否通过RFI文件" style="width: 70%" :disabled="RFITaskKeyMap[activeTaskKey]!==5">
                  <el-option v-for="item in approveChoice" :label="item.label" :value="item.value" :key="item.value"/></el-select>
                </el-col>
                <el-col :span="6" v-if="RFITaskKeyMap[activeTaskKey]>=5">
                  备注   <el-input style="width: 80%;display: inline-block" :rows="1"  v-model="domain.remark" placeholder="请输入备注" :disabled="RFITaskKeyMap[activeTaskKey]!==5"/>
                </el-col>
                <el-col :span="1">
                  <el-button style="position: absolute;right: 45px" v-if="RFITaskKeyMap[activeTaskKey]===3" @click.prevent="removeSupplier(domain)" icon="el-icon-delete" type="danger" circle></el-button>
                </el-col>
              </el-row>
            </el-form-item>
            <div style="margin-top: 40px" v-if="RFITaskKeyMap[activeTaskKey]===3"><el-divider><el-button icon="el-icon-plus" @click="addNewSupplier" size="small" circle plain /></el-divider></div>
          </el-form>
        </div>
        <div style="display: flex;justify-content: right;margin: 20px" v-if="!disabled">
          <el-button type="primary" @click="handleCreate">提 交</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import constant from '../constant/constant'
import { deepClone } from '../../../../utils'
import supplierSelect from './supplierSelect'
import RFITaskKeyMap from '../../workflow/constant/RFITaskKeyMap'
import { startProcess } from '../../../../api/workflow/workflow-common'

export default {
  name: 'RFIForm',
  components:{
    supplierSelect
  },
  props:{
    formDisabled:{
      type: Boolean,
      default: true
    },
    rfiDisabled:{
      type: Boolean,
      default: false
    },
    disabled:{
      type: Boolean,
      default: false
    },
    data:{
      type: Object,
      default: () => ({
        projectCode: '',
        projectName: '',
        category: null,
        reqCode: '',
        reqDeliveryTime:'',
        creatorTime: '',
        creatorUser: '',
        rfiId: null, rfpId: null, rfqId: null, singleReport: null, estimateReport: null,
        purchaseInfo: [],
      })
    },
    selectorList:{
      type: Array,
      default: ()=>[]
    },
    activeTaskKey:{
      type: String,
      default: ''
    },
  },
  computed:{
    purchaseTotal(){
      let res = 0
      if (this.purchaseInfo&&this.purchaseInfo.length>0){
        this.purchaseInfo.forEach(item=>{
          res += item.price * item.num
        })
      }
      return res
    }
  },
  watch:{
    data:{
      handler(val){
        if (val){
          this.approvedForm = deepClone(val)
          if (val.purchaseList){
            this.purchaseInfo = deepClone(val.purchaseList)
            this.supplierList = deepClone(val.supplierList)
            this.supplierList.map(item=>item.supplierId=item.id)
          }
        }
      }
    },

  },
  data(){
    return{
      approvedForm: {
        needRfpFlag:null ,rfiId: null, rfpId: null, rfqId: null, singleReport: null, estimateReport: null, purchaseInfo: []
      },
      purchaseInfo: [],
      supplierList: [
        { supplierId: null, rfiId: null, approvedFlag: null, remark: null}
      ],
      supplierType: constant.supplierType,
      approveChoice: constant.approveChoice,
      yesOrNo: constant.yesOrNo,
      RFITaskKeyMap
    }
  },
  created() {
    // this.approvedForm = deepClone(this.data)
    // this.purchaseInfo = this.data.purchaseList
  },
  methods:{
    handleCreate(){
      this.$refs['approvedForm'].validate(valid =>{
        if (valid){
          this.approvedForm.purchaseDetailList = this.purchaseInfo
          this.approvedForm.supplierList = this.supplierList
          this.$emit('submitForm',this.approvedForm)
          this.$emit("close",false)
        }
      })
    },
    submitForm(){
      let suppliers = []
      for (let item of this.supplierList){
        if (item.supplierId){
          suppliers.push(item)
        }
      }
      this.approvedForm.purchaseDetailList = this.purchaseInfo
      this.approvedForm.supplierList = suppliers
      this.$emit('submitForm',JSON.stringify(this.approvedForm))
    },
    getInfo(id,data,index){
      this.supplierList[index].supplierId = id
    },
    itemTotal(num,price){
      return num * price
    },
    cancel(){
      this.supplierList = [{ supplierId: null, rfiId: null, approvedFlag: null, remark: null}]
      this.approvedForm = {}
    },
    addNewSupplier(){
      this.supplierList.push({
        supplierId: null,
        rfiId: null,
        approvedFlag: null,
        remark: null
      })
    },
    removeSupplier(item) {
      let index = this.supplierList.indexOf(item)
      if (index !== -1) {
        this.supplierList.splice(index, 1)
      }
    },
  }
}
</script>

<style scoped>
.card-div{
  margin: 35px 10px 60px 10px;
}
.fix-div{
  position: fixed;
  /*left: 52px;*/
  /*right: 40px;*/
  background-color: white;
  z-index: 9999;
  width: 97%;
}
.title-class{
  margin-top: 50px;
  text-align: center;
  font-weight: bold;
}
.topic-class{
  margin-bottom: 20px;
  font-weight: bold
}
</style>
