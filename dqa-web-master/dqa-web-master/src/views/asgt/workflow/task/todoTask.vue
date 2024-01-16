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

<!--    <el-row :gutter="10" class="mb8">-->
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="danger"-->
<!--          plain-->
<!--          icon="el-icon-delete"-->
<!--          size="mini"-->
<!--          :disabled="multiple"-->
<!--          @click="handleDelete"-->
<!--          v-hasPermi="['system:deployment:remove']"-->
<!--        >删除-->
<!--        </el-button>-->
<!--      </el-col>-->
<!--      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>-->
<!--    </el-row>-->

    <el-table v-loading="loading" :data="todoList" border style="position: absolute" height="calc(100vh - 245px)">
      <el-table-column type="index" width="55" align="center"/>
<!--      <el-table-column label="任务编号" align="center" prop="taskId" :show-overflow-tooltip="true"/>-->
      <el-table-column label="流程名称" align="center" prop="processName" min-width="150"/>
      <el-table-column label="当前节点" align="center" prop="taskName" min-width="120"/>
      <el-table-column label="流程发起人" align="center" prop="startUser" min-width="100"/>
      <el-table-column label="接收时间" align="center" prop="receiveTime" min-width="100"/>
      <el-table-column label="操作" align="center" min-width="120">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit-outline"
            @click="handleProcess(scope.row)"
          >处理
          </el-button>
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
    <el-dialog :visible.sync="workflowVisible" append-to-body :fullscreen="true">
      <h2 style="text-align: center;font-weight: bold">{{ title }}</h2>
      <div class="el-dialog__header" style="text-align:right;margin-right: 25px">
        <el-button type="primary" size="small" @click="passTask">通过</el-button>
        <el-button type="danger" size="small" @click="rejectTask">驳回</el-button>
        <el-button type="danger" size="small" @click="dismissedTask">拒绝</el-button>
      </div>
      <flow-task :process-instance-id="processInstanceId" :business-form="businessForm" :data="data" :disabled="true" ref="flowTask"
                 :selector-list="selectorList" @formSubmit="handleFormSubmit" @closeDialog="closeDialog" />
    </el-dialog>

    <!--审批意见-->
    <el-dialog :title="'审批意见'" :visible.sync="adviceVisible" append-to-body>
      <el-form :rules="rejectRules" :model="commentForm" label-width="100px" ref="taskOperationForm">
        <el-form-item label="驳回节点" prop="rejectTaskKey" v-if="processOperationType==='reject'">
          <el-select v-model="commentForm.rejectTaskKey" placeholder="请选择活动区域">
            <el-option v-for="item in rejectTableTaskNodes" :key="item.taskKey" :label="item.taskName" :value="item.taskKey"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="处理意见" prop="comment">
          <el-input type="textarea" :autosize="{ minRows: 5 }" v-model="comment" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="adviceVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleProcessOperation">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import baseForm from '../components/baseForm'
import clearForm from '../components/clearForm'
import potentialForm from '../components/potentialForm'
import approvedForm from '../components/approvedForm'
import sourceForm from '../components/sourceForm'
import RFIForm from '../../inventory-mgt/components/RFIForm'
import changeForm from '../../record-mgt/components/changeForm'
import approvalTable from '../components/approvalTable'
import flowchart from '../components/flowchart'
import {
  completeTask,
  listRejecttableTaskOfProcess,
  listTask, listTaskByQueryCondition,
  rejectProcess,
  stopProcess
} from '@/api/workflow/workflow-common'
import FlowTask from '@/views/asgt/workflow/flowTask'
import processConstant from '../constant/constant'
import RFITaskKeyMap from '../constant/RFITaskKeyMap'
import {
  getApprovedByProcessInstanceId,
  getApprovedReqByProcess,
  getPotentialByProcessInstanceId
} from '../../../../api/asgt/supplier/requirement'
import { deepClone } from '../../../../utils'
import { getClearByProcessInstanceId } from '../../../../api/asgt/recordMgt/clearRecord'
import {
  getChangeByProcessInstanceId,
  getSupplierByProcessInstanceId
} from '../../../../api/asgt/recordMgt/changeRecord'
import { listAllSupplierByKind } from '../../../../api/asgt/supplier/supplierBase'

export default {
  name: "todoTask",
  components: {
    baseForm, approvalTable, flowchart, FlowTask, potentialForm, approvedForm, changeForm, sourceForm, RFIForm
  },
  data() {
    return {
      // 遮罩层
      loading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 分页
      total: 0,
      pageNum: 0,
      pageSize: 20,
      // 流程待办任务表格数据
      todoList: [],
      // 弹出层标题
      title: "",
      workflowVisible: false,
      adviceVisible: false,
      // 查询参数
      queryParams: {
        name: null,
        category: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      comment: '',
      businessForm: null,
      baseForm,
      commentForm:{
        taskRejectKey: ''
      },
      clearForm,
      potentialForm,
      approvedForm,
      RFIForm,
      sourceForm,
      data: {},
      processOperationType: '',
      taskId: '',
      selectorList: [],
      processInstanceId: '',
      activeTaskKey: '',
      rejectTaskKey: '',
      rejectTableTaskNodes: [],
      rejectRules:{
        rejectTaskKey: [
          { required: true, message: '请选择驳回节点', trigger: 'blur' }
        ],
      }
    };
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询流程定义列表 */
    getList() {
      this.loading = true
      // 旧版接口
      // listTask(this.pageNum,this.pageSize).then(res=>{
      //   this.todoList = res.data.records
      //   this.pageNum = res.data.current
      //   this.pageSize = res.data.size
      //   this.total = res.data.total
      //   this.loading = false
      // })
      listTaskByQueryCondition(this.pageNum,this.pageSize, this.queryParams.name).then(res=>{
        this.todoList = res.data.records
        this.pageNum = res.data.current
        this.pageSize = res.data.size
        this.total = res.data.total
        this.loading = false
      })
      listAllSupplierByKind(2).then(res=>{
        this.selectorList = res.data
      })
    },
    // 跳转到处理页面
    handleProcess(row){
      this.workflowVisible = true
      this.taskId = row.taskId;
      this.title = row.processName
      this.processInstanceId = row.processInstanceId;
      // this.activeTaskKey = row.activeTaskKey
      this.listRejecttableTaskOfProcess();
      // 更新流程数据
      this.$refs.flowTask && this.$refs.flowTask.initFlowData();
      // 潜在
      if (row.processKey===processConstant.potentialProcessKey){
        this.businessForm = potentialForm
        let data = {
          processInstanceId: row.processInstanceId
        }
        getPotentialByProcessInstanceId(data).then(res=>{
          this.data = deepClone(res.data)
        })
      }
      // 获批
      else if (row.processKey===processConstant.approvedProcessKey){
        this.businessForm = approvedForm
        let data = {
          processInstanceId: row.processInstanceId
        }
        getApprovedByProcessInstanceId(data).then(res=>{
          this.data = deepClone(res.data)
        })
      }
      // 清退
      else if (row.processKey===processConstant.clearProcessKey){
        this.businessForm = clearForm
        getClearByProcessInstanceId(row.processInstanceId).then(res=>{
          this.data = deepClone(res.data)
        })
      }
      // 变更
      else if (row.processKey===processConstant.changeProcessKey){
        this.businessForm = changeForm
        getChangeByProcessInstanceId(row.processInstanceId).then(res=>{
          this.data = deepClone(res.data)
        })
      }
      else if (row.processKey===processConstant.RFI){
        this.businessForm = RFIForm
        let data = {
          searchId: row.processInstanceId,
          processKey: row.processKey
        }
        getApprovedReqByProcess(data).then(res=>{
          this.data = deepClone(res.data)
        })
      }
      else if (row.processKey === processConstant.sourceProcessKey){
        this.businessForm = sourceForm
        getSupplierByProcessInstanceId(row.processInstanceId).then(res=>{
          this.data = deepClone(res.data);
        })
      }
    },
    // 通过按钮
    passTask(){
      this.adviceVisible = true;
      this.processOperationType = 'complete';
    },
    // 驳回按钮
    rejectTask(){
      this.adviceVisible = true;
      this.processOperationType = 'reject';
    },
    // 终止
    dismissedTask(){
      this.adviceVisible = true;
      this.processOperationType = 'stop';
    },
    handleProcessOperation(){
      this.$refs.flowTask.submitForm();
    },
    handleFormSubmit(data){
      if(this.processOperationType==='complete'){
        completeTask(this.taskId, data, this.comment).then(res=>{
          this.commentForm.taskRejectKey = '';
          this.comment = '';
        }).finally(()=>{
          this.adviceVisible = false
          this.workflowVisible = false
          this.comment = ''
          this.getList()
        })
      }else if(this.processOperationType==='reject'){
        this.$refs['taskOperationForm'].validate((valid) => {
          if (valid) {
            rejectProcess(this.taskId, data, this.comment, this.commentForm.rejectTaskKey).then(res=>{
              this.commentForm.taskRejectKey = '';
              this.comment = '';
            }).finally(()=>{
              this.adviceVisible = false
              this.workflowVisible = false
              this.comment = ''
              this.getList()
            })
          } else {
            this.$message.error("请选择驳回节点！");
            return false;
          }
        });
      }else if(this.processOperationType==='stop'){
        stopProcess(this.taskId, data, this.comment).then(res=>{
          this.commentForm.taskRejectKey = '';
          this.comment = '';
        }).finally(()=>{
          this.adviceVisible = false
          this.workflowVisible = false
          this.comment = ''
          this.getList()
        })
      }
    },
    listRejecttableTaskOfProcess(){
      listRejecttableTaskOfProcess(this.processInstanceId).then(res=>{
        this.rejectTableTaskNodes = res.data;
      })
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    closeDialog(dialogVisible){
      this.workflowVisible = dialogVisible
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
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    resetQuery(){
      this.queryParams= {
        name: null,
        category: null
      }
      this.getList();
    }
  }
};
</script>
<style scoped>
>>>.el-dialog__headerbtn .el-dialog__close {
  font-size: 30px;
}
</style>

