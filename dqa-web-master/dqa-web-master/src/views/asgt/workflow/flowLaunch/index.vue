<template>
  <div>
    <div style="margin: 15px 35px 35px 35px">
      <el-card shadow="always">
        <component :is="businessForm" :selector-list="selectorList" :flow-data="flowData" :process-key="processKey" type="flowLaunch" @close="close" />
      </el-card>
    </div>
    <flowchart :flow-data="flowData" v-loading="flowLoading"/>
  </div>
</template>

<script>
import flowchart from '@/views/asgt/workflow/components/flowchart'
import { getProcessXmlDataByKey } from '@/api/workflow/workflow-common'
import { listAllSupplierByKind } from '../../../../api/asgt/supplier/supplierBase'
import  processConstant from '../constant/constant'

export default {
  name: 'index',
  components: {
    flowchart
  },
  props: {
    processKey: {
      type: String,
      default: ''
    },
    businessForm:{
      type: Object,
      default: ()=>{},
    },
    selectorList:{
      type: Array,
      default: ()=>[],
    }
  },
  watch:{
    processKey:{
      handler(){
        this.initFLow();
      },
      immediate: true,
    }
  },
  data(){
    return {
      flowData: {},
      flowLoading: false,
      flowchart,
      processConstant,
    }
  },
  methods: {
    initFLow(){
      this.flowLoading = true;
      getProcessXmlDataByKey(this.processKey).then(res=>{
        this.flowData = {xmlData: res.data};
      }).finally(()=>{
        this.flowLoading = false;
      })
    },
    close(visible){
      this.$emit("close",visible)
    }
  },
}
</script>

<style scoped>
>>>.el-dialog__headerbtn .el-dialog__close {
  font-size: 30px;
}
</style>
