<template>
  <div v-loading="loading">
    <div style="margin: 15px 35px 35px 35px">
      <el-card shadow="always">
        <component :is="businessForm"
                   ref="businessForm"
                   :processInstanceId="processInstanceId"
                   type="flowTask"
                   :process-key="processKey"
                   :flow-detail="flowDetail"
                   :data="data"
                   :disabled="disabled"
                   :active-task-key="activeTaskKey"
                   :selector-list="selectorList"
                   @submitForm="handleFormSubmit"
                   @close="close"
                   :show-title="false"
        />
      </el-card>
    </div>
    <approval-form :approval-list="approvalList"/>
    <flowchart :flow-data="flowData"/>
  </div>
</template>

<script>
import approvalForm from '@/views/asgt/workflow/components/approvalTable'
import flowchart from '@/views/asgt/workflow/components/flowchart'
import { getProcessDetailById } from '@/api/workflow/workflow-common'
import { deepClone } from '@/utils'
export default {
  name: 'index',
  props:{
    processInstanceId:{
      type: String,
      default: ''
    },
    businessForm:{
      type: Object,
      default: ()=>{},
    },
    disabled:{
      type: Boolean,
      default: false
    },
    data:{
      type: Object,
      default: () => ({})
    },
    selectorList:{
      type: Array,
      default: ()=>[]
    }
  },
  components:{
    approvalForm,
    flowchart,
  },
  watch:{
    processInstanceId:{
      handler(){
        this.initFlowData();
      },
      immediate: true,
    }
  },
  data(){
    return {
      approvalList: [],
      flowData: {},
      loading: false,
      flowDetail: {},
      processKey: '',
      activeTaskKey: ''
    }
  },
  methods:{
    initFlowData(){
      this.loading = true;
      getProcessDetailById(this.processInstanceId).then(res=>{
        this.approvalList = deepClone(res.data?.historyList);
        this.flowData = {xmlData: res.data?.xmlData, nodeData: res.data?.nodes, activeTaskKey: res.data?.activeTaskKey};
        this.flowDetail = res.data;
        this.processKey = res.data?.processKey;
        this.activeTaskKey = res.data.activeTaskKey
      }).finally(()=>{
        this.loading = false;
      })
    },
    submitForm(){
      // 提交业数据
      this.$refs.businessForm && this.$refs.businessForm.submitForm();
    },
    handleFormSubmit(data){
      this.$emit("formSubmit", data);
    },
    close(visible){
      this.$emit("closeDialog",visible)
    }
  },
}
</script>

<style scoped>

</style>
