<template>
  <div>
    <flow-view :flowData="flowData"/>
  </div>
</template>
<script>
import FlowView from './flowchart'

export default {
  name: "Flow",
  components: {
    FlowView
  },
  props: {
    flowData: {
      type: Object,
      default: () => {}
    }
  },
  created() {
  },
  data() {
    return {};
  }
};
</script>
