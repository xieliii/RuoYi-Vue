<template>
  <div style="height: 100%;margin: 40px 70px 0 70px">
    <h2 style="text-align: center;margin: 0 0 40px 0;font-weight: bold">供应商清退审批表</h2>
    <div style="text-align: right;font-size: 16px;margin: 0 0 40px 0;">
      <span>清退凭据材料：{{tableData.fileId}}</span>
    </div>
    <div style="margin: 30px 40px 0 40px">
      <el-table :data="tableData" border>
        <el-table-column label="序号" type="index" align="center"  width="50" />
        <el-table-column label="清退供应商名单" align="center" prop="supplierName" min-width="200px">
        </el-table-column>
        <el-table-column label="清退说明" align="center" prop="description" min-width="400px">
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark" min-width="280px"/>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'clearTable',
  props: {
    tableData:{
      type: Array,
      default:{
      }
    }
  },
  data(){
    return{
    }
  },
  methods: {

  }
}
</script>

<style scoped>

</style>
