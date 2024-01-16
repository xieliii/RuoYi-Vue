<template>
  <div>
    <el-table v-loading="loading" :data="taskList" :show-header="false" height="calc(330px - 0px)" @row-click="clickRow">
      <el-table-column label="事项名称" prop="processName" min-width="150" />
      <el-table-column v-if="activeName!=='process'" label="创建时间" prop="processStartTime" min-width="80" />
      <el-table-column v-if="activeName==='process'" label="创建时间" prop="startTime" min-width="80" />
      <el-table-column label="创建者" align="center" prop="startUser" min-width="80" :show-overflow-tooltip="true"/>
    </el-table>

<!--    <el-dialog title="表单详情" :visible.sync="showDetail" :fullscreen="true">-->
<!--      <el-form>-->
<!--        <el-form-item label="11111">-->
<!--          <el-input placeholder="111111111111111111"></el-input>-->
<!--        </el-form-item>-->
<!--      </el-form>-->
<!--      <flow-task :process-instance-id="processInstanceId" :business-form="businessFormMap[processKey]" />-->
<!--    </el-dialog>-->

    <flow-task-operation :flow-task-visible.sync="showDetail"
                         :process-instance-id="processInstanceId"
                         :process-key="processKey" :process-name="processName" :task-id="taskId" @taskCompleteOperation="handleTaskComplete"/>
    <flow-display :flow-task-visible.sync="myProcessVisible"
                  :process-instance-id="processInstanceId"
                  :process-name="processName" :process-key="processKey"/>
  </div>
</template>

<script>
import FlowTaskOperation from '@/views/asgt/workflow/flowTask/FlowTaskOperation'
import FlowDisplay from '@/views/asgt/workflow/flowDisplay/FlowDisplay'
import { listTask } from '@/api/workflow/workflow-common'
export default {
  name: 'taskTab',
  props:{
    taskList:{
      type: Array,
      default: []
    },
    activeName:{
      type: String,
      default: 'toDoTask'
    },
  },
  components:{
    FlowTaskOperation,
    FlowDisplay,
  },
  data(){
    return{
      loading: false,
      showDetail: false,
      detailForm: {},
      processInstanceId:　"",
      processKey: "",
      processName: "",
      taskId: "",
      myProcessVisible: false,
    }
  },
  methods:{
    clickRow(row,col,event){
      if(this.activeName === 'toDoTask'){
        this.showDetail = true
      }else{
        this.myProcessVisible = true;
      }
      this.processInstanceId = row.processInstanceId;
      this.processKey = row.processKey;
      this.processName = row.processName;
      this.taskId = row.taskId;
    },
    handleTaskComplete(event){
      this.$emit("refresh");
    },
  },
}
</script>

<style scoped>

</style>
