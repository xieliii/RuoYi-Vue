<template>
  <div>
    <!--处理流程-->
    <el-dialog :visible.sync="detailVisible" append-to-body :fullscreen="true">
      <h2 style="text-align: center;font-weight: bold">{{ processName }}</h2>
      <div class="el-dialog__header" style="text-align:right;margin-right: 25px">
        <el-button type="primary" size="small" @click="completeTask">通过</el-button>
        <el-button type="danger" size="small" @click="rejectTask">驳回</el-button>
        <el-button type="danger" size="small" @click="stopProcess">拒绝</el-button>
      </div>
      <flow-task :process-instance-id="processInstanceId" :business-form="processForm" :data="data" :disabled="true"
                 ref="flowTask" @formSubmit="handleFormSubmit"/>
    </el-dialog>

    <!--审批意见-->
    <el-dialog :title="'审批意见'" :visible.sync="adviceVisible" append-to-body>
      <el-form :rules="rejectRules" :model="commentForm" label-width="100px" ref="taskOperationForm">
        <el-form-item label="驳回节点" prop="rejectTaskKey" v-if="processOperationType==='reject'">
          <el-select v-model="commentForm.rejectTaskKey" placeholder="请选择活动区域">
            <el-option v-for="item in rejectTableTaskNodes" :key="item.taskKey" :label="item.taskName"
                       :value="item.taskKey"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="处理意见" prop="comment">
          <el-input type="textarea" :autosize="{ minRows: 5 }" v-model="commentForm.comment"/>
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
import FlowTask from '@/views/asgt/workflow/flowTask'
import businessFormMap from '@/views/asgt/workflow/constant/business-form-map'
import { completeTask, listRejecttableTaskOfProcess, rejectProcess, stopProcess } from '@/api/workflow/workflow-common'
export default {
  name: 'FlowTaskOperation',
  components: {
    FlowTask,
  },
  props:{
    taskId: {
      type: String,
      default: '',
    },
    processInstanceId: {
      type: String,
      default: '',
    },
    processKey: {
      type: String,
      default: '',
    },
    processName: {
      type: String,
      default: '',
    },
    flowTaskVisible: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: '',
    }
  },
  computed:{
    processForm(){
      return businessFormMap.componentMap[this.processKey];
    },
    detailVisible:{
      get(){
        return this.flowTaskVisible
      },
      set(value){
        this.$emit("update:flowTaskVisible", value);
      }
    }
  },
  data(){
    return {
      adviceVisible: false,
      rejectTableTaskNodes: [],
      commentForm:{
        taskRejectKey: '',
        comment: '',
      },
      data: {},
      title: '',
      processOperationType:'',
      rejectRules:{
        rejectTaskKey: [
          { required: true, message: '请选择驳回节点', trigger: 'blur' }
        ],
      }
    }
  },
  watch:{
    flowTaskVisible(newVal){
      if(newVal){
        // 获取驳回节点
        this.listRejecttableTaskOfProcess();
        // 更新流程数据
        this.$refs.flowTask && this.$refs.flowTask.initFlowData();
        businessFormMap.requestMap[this.processKey]({processInstanceId: this.processInstanceId}).then(res=>{
          this.data = res.data;
        })
      }
    }
  },
  methods:{
    completeTask(){
      console.log("complete")
      this.adviceVisible = true;
      this.processOperationType = 'complete';
    },
    rejectTask(){
      console.log("reject")
      this.adviceVisible = true;
      this.processOperationType = 'reject';
    },
    stopProcess(){
      console.log("stop")
      this.adviceVisible = true;
      this.processOperationType = 'stop';
    },
    handleFormSubmit(data){
      if(this.processOperationType==='complete'){
        completeTask(this.taskId, data, this.commentForm.comment).then(res=>{
          this.commentForm.taskRejectKey = '';
          this.commentForm.comment = '';
          this.$message.success("成功通过当前流程！");
        }).finally(()=>{
          this.adviceVisible = false
          this.detailVisible = false
          // this.getList();
          this.$emit("taskCompleteOperation", 'complete');
        })
      }else if(this.processOperationType==='reject'){
        this.$refs['taskOperationForm'].validate((valid) => {
          if (valid) {
            rejectProcess(this.taskId, data, this.commentForm.comment, this.commentForm.rejectTaskKey).then(res=>{
              this.commentForm.taskRejectKey = '';
              this.commentForm.comment = '';
              this.$message.success("成功驳回当前流程！");
            }).finally(()=>{
              this.adviceVisible = false
              this.detailVisible = false
              // this.getList();
              this.$emit("taskCompleteOperation", 'reject');
            })
          } else {
            this.$message.error("请选择驳回节点！");
            return false;
          }
        });
      }else if(this.processOperationType==='stop'){
        stopProcess(this.taskId, data, this.commentForm.comment).then(res=>{
          this.commentForm.taskRejectKey = '';
          this.commentForm.comment = '';
          this.$message.success("成功拒绝当前流程！");
        }).finally(()=>{
          this.adviceVisible = false
          this.detailVisible = false
          // this.getList();
          this.$emit("taskCompleteOperation", 'stop');
        })

      }
    },
    handleProcessOperation(){
      this.$refs.flowTask && this.$refs.flowTask.submitForm();
    },
    listRejecttableTaskOfProcess(){
      listRejecttableTaskOfProcess(this.processInstanceId).then(res=>{
        this.rejectTableTaskNodes = res.data;
      })
    },
  },

}
</script>

<style scoped>
>>>.el-dialog__headerbtn .el-dialog__close {
  font-size: 30px;
}
</style>
