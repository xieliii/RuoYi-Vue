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
<!--      <el-form-item label="开始时间" prop="deployTime">-->
<!--        <el-date-picker clearable size="small"-->
<!--                        v-model="queryParams.deployTime"-->
<!--                        type="date"-->
<!--                        value-format="yyyy-MM-dd"-->
<!--                        placeholder="选择时间">-->
<!--        </el-date-picker>-->
<!--      </el-form-item>-->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="finishedList" border style="position: absolute" height="calc(100vh - 245px)">
      <el-table-column type="index" width="55" align="center" />
<!--      <el-table-column label="任务编号" align="center" prop="taskId" min-width="120" :show-overflow-tooltip="true"/>-->
      <el-table-column label="流程名称" align="center" prop="processName" min-width="120" :show-overflow-tooltip="true"/>
      <el-table-column label="处理节点" align="center" prop="taskName" min-width="120" />
      <el-table-column label="流程发起人" align="center" prop="startUser" min-width="120" />
      <el-table-column label="接收时间" align="center" prop="receiveTime" min-width="120"/>
      <el-table-column label="审批时间" align="center" prop="finishTime" min-width="120"/>
      <el-table-column label="耗时" align="center" prop="duration" min-width="120"/>
      <el-table-column label="操作" min-width="100" align="center" fixed="right" >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-tickets"
            @click="handleFlowRecord(scope.row)"
          >流转记录</el-button>
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

    <!--处理流程-->
    <el-dialog :visible.sync="visible" append-to-body :fullscreen="true">
      <div style="text-align: center;margin: 0 0 35px 0">
        <h1 style="font-weight: bold ">{{processName}}</h1>
      </div>
      <div>
        <base-form :process-instance-id="processInstanceId" :process-key="processKey" ref="baseForm"/>
        <approval-form :approval-list="approvalList"/>
        <flowchart :flow-data="flowData"/>
<!--        <flow-task :process-instance-id="processInstanceId" :business-form="businessForm" :disabled="true" />-->
      </div>
    </el-dialog>

  </div>
</template>

<script>
import potentialForm from '../components/potentialForm'
import approvedForm from '../components/approvedForm'
import clearForm from '../components/clearForm'
import approvalTable from '../components/approvalTable'
import flowchart from '../components/flowchart'
import {
  listTask,
  listDoneTask,
  listProcessInstance,
  getProcessDetailById, listDoneTaskByQueryCondition
} from '../../../../api/workflow/workflow-common'
import FlowTask from '@/views/asgt/workflow/flowTask'
import Flow from '@/views/asgt/workflow/flowview/flow'
import processConstant from '../constant/constant'
import {
  getApprovedByProcessInstanceId,
  getPotentialByProcessInstanceId
} from '../../../../api/asgt/supplier/requirement'
import { deepClone } from '../../../../utils'
import { getClearByProcessInstanceId } from '../../../../api/asgt/recordMgt/clearRecord'
import baseForm from '../components/baseForm'
import approvalForm from '../components/approvalTable'

export default {
  name: "finish",
  components: {
    Flow, approvalTable, flowchart, FlowTask,
    potentialForm, approvedForm, clearForm,
    baseForm,approvalForm
  },
  data() {
    return {
      // 遮罩层
      loading: false,
      // 显示搜索条件
      showSearch: true,
      total: 0,
      pageNum: 1,
      pageSize: 10,
      // 已办任务列表数据
      finishedList: [],
      // 是否显示弹出层
      open: false,
      visible: false,
      businessForm: null,
      potentialForm, approvedForm, clearForm,
      processName: '',
      processKey: '',
      processInstanceId: '',
      flowData:{},
      approvalList: [],
      // 查询参数
      queryParams: {
        name: null,
        category: null,
        key: null,
        tenantId: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询流程定义列表 */
    getList() {
      this.loading = true
      listDoneTaskByQueryCondition(this.pageNum, this.pageSize,  this.queryParams.name).then(res=>{
        this.finishedList = res.data.records
        this.pageNum = res.data.current
        this.pageSize = res.data.size
        this.total = res.data.total
        this.loading = false
      })
      // 旧版不带查询接口
      // listDoneTask(this.pageNum,this.pageSize).then(res=>{
      //   this.finishedList = res.data.records
      //   this.pageNum = res.data.current
      //   this.pageSize = res.data.size
      //   this.total = res.data.total
      //   this.loading = false
      // })
    },
    // 流转记录
    handleFlowRecord(row){
      this.visible = true
      this.taskId = row.taskId;
      this.processName = row.processName
      this.processInstanceId = row.processInstanceId;
      this.processKey = row.processKey
      this.$nextTick(()=>{
        this.$refs.baseForm && this.$refs.baseForm.setDefault();
      })
      getProcessDetailById(row.processInstanceId).then(res=>{
        this.flowData = deepClone({"xmlData": res.data?.xmlData, "nodeData": res.data?.nodes, "activeTaskKey": res.data?.activeTaskKey});
        this.approvalList = deepClone(res.data.historyList);
      })
      // this.listRejecttableTaskOfProcess();
      // 潜在
      // if (row.processKey===processConstant.potentialProcessKey){
      //   this.processKey = row.processKey
      // }
      // 获批
      // else if (row.processKey===processConstant.approvedProcessKey){
      //   this.processKey = row.processKey
      // }
      // 清退
      // else if (row.processKey===processConstant.clearProcessKey){
      //   this.processKey = row.processKey
      // }
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        name: null,
        category: null,
        key: null,
        tenantId: null,
        deployTime: null,
        derivedFrom: null,
        derivedFromRoot: null,
        parentDeploymentId: null,
        engineVersion: null
      };
      this.resetForm("form");
    },
    setIcon(val){
      if (val){
        return "el-icon-check";
      }else {
        return "el-icon-time";
      }

    },
    // 搜索按钮操作
    handleQuery() {
      this.getList()
    },
    // 重置按钮操作
    resetQuery() {
      this.resetForm("queryForm");
      this.getList();
    },
    // 导出按钮操作
    // handleExport() {
    //   const queryParams = this.queryParams;
    //   this.$confirm('是否确认导出所有流程定义数据项?', "警告", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning"
    //   }).then(function() {
    //   }).then(response => {
    //   })
    // }
  }
};
</script>
<style scoped>
>>>.el-dialog__headerbtn .el-dialog__close {
  font-size: 30px;
}
</style>
