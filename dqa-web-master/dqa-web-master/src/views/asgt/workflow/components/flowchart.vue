<template>
  <div style="margin: 0 35px 35px 35px">
    <el-card shadow="always">
      <h3 style="font-weight: bold">流程图</h3>
      <el-divider />
      <div>
        <flow :flowData="flowData"/>
      </div>
    </el-card>
  </div>
</template>

<script>
import flow from '../flowview/flow'
import FlowView from '../flowview/flowchart'
export default {
  name: 'flowchart',
  components:{
    FlowView,
    flow
  },
  props:{
    flowData: {
      type: Object,
      default: () => {}
    },
  },
  data(){
    return{
    }
  },
  created() {

  }
}
</script>

<style scoped>

</style>
