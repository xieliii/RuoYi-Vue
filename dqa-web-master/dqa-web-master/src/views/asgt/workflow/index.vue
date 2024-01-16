<template>
  <div>
<!--    <file-upload />-->
<!--    <oss-file-upload :limit="5" v-model="fileList"/>-->
<!--    <image-upload />-->
<!--    <oss-image-upload v-model="fileList"/>-->
<!--    <el-button @click="startProcess"></el-button>-->
<!--    <flow-task process-instance-id="ac1e4d9c-0aa6-11ee-a0aa-00ff1cab5def" :business-form="approvedForm"/>-->
    <flow-launch process-key="poentialSupplierEntryProcess" :business-form="clearForm"/>
  </div>
</template>

<script>
import {
  listTask,
  listDoneTask,
  listProcessInstance,
  startProcess,
  getProcessXmlDataByKey,
  getProcessDetailById,
  listRejecttableTaskOfProcess,
  listProcessStatistic
} from '@/api/workflow/workflow-common'
import FlowTask from "@/views/asgt/workflow/flowTask"
import FlowLaunch from "@/views/asgt/workflow/flowLaunch"
import Flow from '@/views/asgt/workflow/flowview/flow'
import clearForm from '@/views/asgt/workflow/components/clearForm'
import potentialForm from './components/potentialForm'
import approvedForm from './components/approvedForm'
export default {
  name: 'index',
  potentialSelectSuppliername: 'index',
  components: {
    Flow,
    FlowTask,
    FlowLaunch,
    clearForm,
    potentialForm,
    approvedForm
  },
  data(){
    return {
      fileList: 'srm/demo/435084152438523141-SRM.bpmn20.xml,srm/demo/435399901866624261-职称申报人员操作手册和常见问题.pdf',
      clearForm,
      potentialForm,
      approvedForm
    }
  },
  methods:{
    startProcess(){
      const businessData ={
        businessData: "TEST",
        processKey: "srm-process"
      }
      startProcess(JSON.stringify(businessData), "srm-process");
    }
  },
  watch:{
    fileList(val){
      console.log("fileList变化了:", val);
    }
  },
  mounted() {
    // listProcessInstance(0, 20).then(res=>{
    //   console.log("processInstance:",res.data);
    // })
    // listTask(0, 20).then(res=>{
    //   console.log("task:", res.data);
    // })
    // listDoneTask(0, 20).then(res=>{
    //   console.log("donetask:",res.data);
    // })
    // const data = {"businessData":"test","processKey":"srm"}
    // console.log(JSON.stringify(data))
    // // getProcessXmlDataByKey("srm-process").then(res=>{
    // //   console.log(res.data);
    // // })
    // getProcessDetailById("ac1e4d9c-0aa6-11ee-a0aa-00ff1cab5def").then(res=>{
    //   console.log(res.data)
    // })
    // listRejecttableTaskOfProcess("ac1e4d9c-0aa6-11ee-a0aa-00ff1cab5def").then(res=>{
    //   console.log(res.data);
    // })
    // listProcessStatistic().then(res=>{
    //   console.log("统计数据：", res.data)
    // })
  }
}
</script>

<style scoped>

</style>

