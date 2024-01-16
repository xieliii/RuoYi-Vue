<template>
  <div style="width: 100%; ">
    <span style="color: white;">供应商管理流程统计数据</span>
    <div style="display: flex;justify-content: center;" :v-loading="loading">
      <div ref="graph" style="width: 100%;height: 360px;">
    </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { listProcessStatistic } from '@/api/workflow/workflow-common'

export default {
  name: 'index',
  data() {
    return {
      dataList: [],
      loading: false,
    }
  },
  methods: {
    init() {
      this.loading = true;
      listProcessStatistic().then(res => {
        this.dataList = res.data;
        this.initGraph();
      }).finally(()=>{
        this.loading = false;
      })
    },
    initGraph() {
      let graph = echarts.init(this.$refs['graph'])
      const source = this.dataList.map(item => {
        return [item.processName.slice(0, item.processName.length-2), item.runningCount, item.finishedCount]
      })
      const option = {
        legend: {
          textStyle: { color: "#FFFDFE" },
        },
        tooltip: {},
        dataset: {
          source: [['process', '运行中', '已完成'], ...source]
        },
        xAxis: {
          type: 'category',
          axisLabel: {
            rotate: 30,
            interval: 0,
            textStyle: {
              color: 'white',  //更改坐标轴文字颜色
              fontSize : 9      //更改坐标轴文字大小
            },
          },
          axisLine:{
            lineStyle:{
              color:'white' //更改坐标轴颜色
            }
          }
        },
        yAxis: {
          axisLabel: {
            textStyle: {
              color: 'white',
              fontSize: 14
            }
          },
          axisLine:{
            lineStyle:{
              color:'white' //更改坐标轴颜色
            }
          }
        },
        series: [
          {
            type: 'bar',
            itemStyle: {
              color: "rgb(145 204 117)"
            }
          },
          {
            type: 'bar',
            itemStyle: {
              color: "rgb(250 200 88)"
            }
          }
          ]
      }
      graph.setOption(option)
    }
  },
  mounted() {
    this.init();
  }
}
</script>

<style scoped>

</style>
