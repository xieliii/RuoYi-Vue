<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">新增流程</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="myProcessList" border style="position: absolute;" height="calc(100vh - 245px)">
      <el-table-column type="index" width="55" align="center" />
<!--      <el-table-column label="流程编号" align="center" prop="procInsId" :show-overflow-tooltip="true"/>-->
      <el-table-column label="流程名称" align="center" prop="processName" min-width="200px" :show-overflow-tooltip="true"/>
      <el-table-column label="提交时间" align="center" prop="startTime" min-width="180"/>
      <el-table-column label="流程状态" align="center" min-width="100px">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.finishTime == null" size="mini">进行中</el-tag>
          <el-tag type="success" v-if="scope.row.finishTime != null" size="mini">已完成</el-tag>
        </template>
      </el-table-column>
<!--      <el-table-column label="耗时" align="center" prop="duration" min-width="180"/>-->
      <el-table-column label="当前节点" align="center" prop="currentNode">
        <template slot-scope="scope">
          <span>{{scope.row.currentNode!==null?scope.row.currentNode:'-'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="办理人" align="center" prop="currentAssignee">
        <template slot-scope="scope">
          <span>{{scope.row.currentAssignee!==null?scope.row.currentAssignee:'-'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="80" fixed="right" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button @click="handleFlowRecord(scope.row)" type="text" size="small">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      style="position: fixed; bottom: 15px; right: 15px;"
      :total="total"
      :page.sync="pageNum"
      :limit.sync="pageSize"
      :page-sizes="[5,10,20,30]"
      @pagination="getList"
    />

    <!-- 发起流程 -->
    <el-dialog :title="title" :visible.sync="open" width="60%" append-to-body>
      <el-table :data="definitionList" border >
        <el-table-column label="流程名称" align="center" prop="name" />
          <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-edit-outline" @click="handleStartProcess(scope.row)">发起流程</el-button>
            </template>
          </el-table-column>
      </el-table>
    </el-dialog>

    <!--新建组件-->
    <el-dialog :visible.sync="visible" width="60%" append-to-body :fullscreen="true">
      <h1 style="text-align: center;margin: 0 0 40px 0;">{{addTitle}}</h1>
      <flow-launch :process-key="processKey" :business-form="businessForm" @close="closeDialog"/>
    </el-dialog>

    <!--详情-->
    <el-dialog :title="workflowTitle" :visible.sync="detailVisible" append-to-body :fullscreen="true" :before-close="destroyData">
      <div style="text-align: center;margin: 0 0 35px 0">
        <h1 style="font-weight: bold ">{{processName}}</h1>
      </div>
      <div>
        <base-form ref="baseForm" :process-instance-id="processInstanceId" :process-key="processKey" :selector-list="selectorList" @submitForm="submit" @close="closeDialog" />
        <approval-form :approval-list="approvalList" ref="approvalForm"/>
        <flowchart :flow-data="flowData" ref="flowChart"/>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import baseForm from '../components/baseForm'
import approvalForm from '../components/approvalTable'
import flowchart from '../components/flowchart'
import clearForm from '../components/clearForm'
import potentialAddForm from '../components/potentialForm'
import approvedAddForm from '../components/approvedForm'
import potentialReqBaseForm from '../../inventory-mgt/components/potentialReqBaseForm'
import approvedReqBaseForm from '../../inventory-mgt/components/approvedReqBaseForm'
import supplierMultipleSelect from '../../inventory-mgt/components/supplierMultipleSelect'
import supplierSelect from '../../inventory-mgt/components/supplierSelect'
import { listAllSupplierByKind } from '../../../../api/asgt/supplier/supplierBase'
import {
  getProcessDetailById,
  getProcessXmlDataByKey,
  listProcessInstance
} from '../../../../api/workflow/workflow-common'
import constant from '../../inventory-mgt/constant/constant'
import { deepClone } from '../../../../utils'
import FlowLaunch from "@/views/asgt/workflow/flowLaunch"
import processConstant from '../constant/constant'
import { listProcessInstanceByQueryCondition } from '@/api/workflow/workflow-common'
export default {
  name: "process",
  components: {
    baseForm, approvalForm, flowchart, clearForm, potentialAddForm, approvedAddForm,
    supplierMultipleSelect, supplierSelect,
    potentialReqBaseForm,approvedReqBaseForm,
    FlowLaunch
  },
  watch: {
    supplierInfo: {
      handler(val) {
        val.forEach(item => {
          if (item.supplierId !== undefined && item.supplierId !== null) {
            this.supplierIds.push(item.supplierId)
          }
        })
      },
      deep: true
    },
  },
  data() {
    return {
      clearForm,potentialAddForm, approvedAddForm,
      flowData:{},
      currentDate: new Date(),
      loading: false,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      total: 0,
      pageNum: 1,
      pageSize: 20,
      // 我发起的流程列表数据
      myProcessList: [],
      addTitle: '',
      workflowTitle: '流程详情',
      processName: '',
      processInstanceId: '',
      visible: false,
      detailVisible: false,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      definitionList: processConstant.processKeyList,
      processKey: '',
      businessForm: null,
      selectorList: [],
      activeTaskKey: "",
      // 清退表单
      removeForm: [{ supplierId: null, description: null,remark: null }],
      potentialForm: {},
      supplierInfo: [{id: null,code: null,companyNature: null,address: null}],
      supplierIds: [],
      approvedForm: {},
      purchaseInfo: [{itemName: null,specificationModel: null,num: null,price: null,referenceSupplier: null,}],
      // 查询参数
      queryParams: {
        name: null,
      },
      queryProcessParams: {
        name: null,
        category: null,
        key: null,
        engineVersion: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      companyNatureOptions: constant.companyNatureOptions,
      supplierType: constant.supplierType,
      approvalList: [],
    };
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
    this.getList();
  },
  methods: {
    submit(){},
    /** 查询流程定义列表 */
    getList() {
      this.loading = true
      // 旧版非查询接口
      // listProcessInstance(this.pageNum,this.pageSize).then(res=>{
      //   this.myProcessList = res.data.records
      //   this.pageNum = res.data.current
      //   this.pageSize = res.data.size
      //   this.total = res.data.total
      //   this.loading = false
      // })
      listProcessInstanceByQueryCondition(this.pageNum,this.pageSize, this.queryParams.name).then(res=>{
        this.myProcessList = res.data.records
        this.pageNum = res.data.current
        this.pageSize = res.data.size
        this.total = res.data.total
        this.loading = false
      })
      listAllSupplierByKind(0).then(res=>{
        this.selectorList = res.data
      })
    },
    // 发起清退
    createClearForm(data){
      this.clearVisible = false
      this.open = false
    },
    // 发起潜在需求
    createPotentialForm(){
      this.potentialForm.supplierList = this.supplierInfo
      this.open = false
    },
    // 发起获批需求
    createApprovedForm(){
      this.approvedForm.purchaseDetailList = this.purchaseInfo
      this.approvedVisible = false
      this.open = false
    },

    // 取消按钮
    cancel() {
      this.open = false
      this.reset();
    },
    // 表单重置
    reset() {
      this.potentialForm = {}
      this.approvedForm = {}
      this.resetForm("potentialForm");
      this.resetForm("approvedForm");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.processName = '';
      this.resetForm("queryForm");
      this.getList();
    },
    handleAdd() {
      this.open = true;
      this.title = "发起流程";
    },
    // 新建流程
    handleStartProcess(row){
      this.processKey = row.processKey
      if (row.processKey===processConstant.potentialProcessKey){
        this.addTitle = '潜在供应商入册-需求申请'
        this.businessForm = potentialAddForm
      }
      else if (row.processKey===processConstant.approvedProcessKey){
        this.addTitle = '获批供应商入册-需求申请'
        this.businessForm = approvedAddForm
      }
      else if (row.processKey===processConstant.clearProcessKey){
        this.addTitle = '清退审批流程'
        this.businessForm = clearForm
      }
      this.visible = true
    },
    // 详情
    handleFlowRecord(row){
      this.detailVisible = true
      this.processName = row.processName
      this.processKey = row.processKey
      this.processInstanceId = row.processInstanceId
      this.$nextTick(()=>{
        this.$refs.baseForm && this.$refs.baseForm.setDefault();
      })
      getProcessDetailById(row.processInstanceId).then(res=>{
        this.flowData = deepClone({"xmlData": res.data?.xmlData, "nodeData": res.data?.nodes, "activeTaskKey": res.data?.activeTaskKey});
        this.approvalList = deepClone(res.data.historyList);
        this.activeTaskKey = res.data.activeTaskKey
      })
    },
    closeDialog(){
      console.log("close");
      this.open = false
      this.visible = false
      this.detailVisible = false
      this.getList()
    },
    destroyData(done){
      this.processName = ''
      this.processInstanceId = ''
      this.processKey = ''
      this.detailVisible = false
      done();
    },
    submit(){

    }
  }
};
</script>

<style scoped>
>>>.el-dialog__headerbtn .el-dialog__close {
  font-size: 30px;
}
</style>

