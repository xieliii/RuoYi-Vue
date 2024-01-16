<template>
  <div style="margin: 15px 35px 35px 35px">
    <el-card shadow="always">
      <h3 style="font-weight: bold">审批意见</h3>
      <div class="approval-table">
        <el-table :data="approvalList" border>
          <el-table-column label="序号" type="index" align="center" min-width="35" />
          <el-table-column label="节点名称" align="center" prop="nodeName" min-width="200" />
          <el-table-column label="处理人" align="center" prop="assigneeName" min-width="100" />
          <el-table-column label="接收时间" align="center" prop="receiveTime" min-width="150">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.operationType==='processStart'?"-":scope.row.receiveTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="完成时间" align="center" prop="completeTime" min-width="150">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.completeTime?scope.row.completeTime:"-" }}</span>
            </template>
          </el-table-column>
          <el-table-column label="处理耗时" align="center" prop="duration" min-width="150">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.operationType==='processStart'?"-":scope.row.duration }}</span>
            </template>
          </el-table-column>
          <el-table-column label="处理操作" align="center" prop="operationType" min-width="150">
            <template slot-scope="scope">
              <span style="margin-left: 10px">
                <el-tag :type="processOperationMap.tagMap[scope.row.operationType]">
                  {{ processOperationMap.nameMap[scope.row.operationType] }}
                </el-tag>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="处理意见" align="center" prop="comment" min-width="400" />
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import processOperationMap from '@/views/asgt/workflow/constant/process-operation-map'
export default {
  name: 'approvalForm',
  props:{
    approvalList:{
      type: Array,
      default:()=>[]
    }
  },
  data(){
    return{
      // approvalList: [],
      processOperationMap,
    }
  }
}
</script>

<style scoped>
.approval-table{
  margin: 30px 30px 20px 30px;
}
</style>
