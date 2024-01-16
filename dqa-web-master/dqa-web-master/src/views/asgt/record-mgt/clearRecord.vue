<template>
  <div class="app-container">
    <el-form :model="clearRecordQuery" ref="queryForm" size="small" :inline="true" >
      <el-form-item label="清退时间">
        <el-date-picker v-model="clearRecordQuery.startDate" placeholder="请选择起始时间" style="width: 47%" type="date"
                        format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"/>-
        <el-date-picker v-model="clearRecordQuery.endDate" placeholder="请选择结束时间" style="width: 47%" type="date"
                        format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"/>
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
      <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
    </el-form>
    <!--表-->
    <el-table v-loading="loading" :data="clearRecord" height="calc(100vh - 270px)" @row-click="clickRow">
      <el-table-column label="序号" type="index" align="center" min-width="35" />
      <el-table-column label="供应商" align="center" prop="supplierNames" min-width="150" :show-overflow-tooltip="true"/>
      <el-table-column label="清退发起人" align="center" prop="creatorUser" min-width="100"/>
      <el-table-column label="清退发起时间" align="center" prop="creatorTime" min-width="120" />
      <el-table-column label="清退完成时间" align="center" prop="completeTime" min-width="120" />
    </el-table>
    <pagination
      style="position: fixed; bottom: 15px; right: 15px;"
      :total="total"
      :page.sync="pageNum"
      :limit.sync="pageSize"
      :page-sizes="[10,15,20,30]"
      @pagination="init"
    />
    <el-dialog :visible.sync="showTable" append-to-body style="height: calc(100vh - 0px);" :fullscreen="true">
      <clear-table :table-data="rowInfo.supplierList"/>
    </el-dialog>
  </div>
</template>

<script>
import clearTable from './components/clearTable'
import { deepClone } from '../../../utils'
import { getClearList } from '../../../api/asgt/recordMgt/clearRecord'

export default {
  name: 'clearRecord',
  components: {
    clearTable
  },
  data(){
    return{
      loading: true,
      showTable: false,
      rowInfo: {},
      clearRecord: [],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      clearRecordQuery:{
        startDate: '',
        endDate: '',
      },
    }
  },
  created() {
    this.init()
  },
  methods: {
    init(){
      this.loading = true
      getClearList(this.pageNum,this.pageSize,this.clearRecordQuery).then(res=>{
        this.clearRecord = res.rows
        this.total = res.total
        this.loading = false
      })
    },
    clickRow(row, column, event){
      this.showTable = true
      this.rowInfo = deepClone(row)
    },
    // 搜索
    handleQuery(){
      this.init()
    },
    // 重置
    resetQuery(){
      this.clearRecordQuery = {
        creatorUserId: ''
      }
    },
  },
}
</script>

<style scoped>

</style>
