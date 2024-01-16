<template>
  <div style="margin: 20px">
    <!--搜索栏-->
    <el-form :model="changeRecordQuery" ref="queryForm" size="small" :inline="true">
      <el-form-item label="名称" prop="changeLogName">
        <el-input v-model="changeRecordQuery.supplierName" placeholder="请输入供应商名称关键字" clearable />
      </el-form-item>
      <el-form-item label="公司性质" prop="companyNature">
        <el-select v-model="changeRecordQuery.companyNature" placeholder="请选择公司性质" clearable>
          <el-option v-for="item in companyNatureOptions" :key="item.value" :value="item.value" :label="item.label"/>
        </el-select>
      </el-form-item>
      <el-form-item label="发起时间">
        <el-date-picker v-model="changeRecordQuery.startDate" placeholder="请选择起始日期" style="width: 45%" type="date"
                        format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"/>-
        <el-date-picker v-model="changeRecordQuery.endDate" placeholder="请选择结束日期" style="width: 45%" type="date"
                        format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!--表-->
    <el-table v-loading="loading" :data="clearRecord" height="calc(100vh - 270px)" @row-click="clickRow">
      <el-table-column label="序号" type="index" align="center" min-width="35" />
      <el-table-column label="供应商" align="center" prop="supplierName" min-width="100" />
      <el-table-column label="公司性质" align="center" prop="companyNature" min-width="100">
        <template slot-scope="scope">
          <span>{{companyNatureMap[scope.row.companyNature]}}</span>
        </template>
      </el-table-column>
      <el-table-column label="变更发起人" align="center" prop="creatorUser" min-width="100" />
      <el-table-column label="变更申请时间" align="center" prop="creatorTime" min-width="100" />
      <el-table-column label="变更记录状态" align="center" prop="approveFlag" min-width="75">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.approveFlag===0" type="primary">进行中</el-tag>
          <el-tag v-if="scope.row.approveFlag===1" type="success">通过</el-tag>
          <el-tag v-if="scope.row.approveFlag===2" type="danger">已拒绝</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="业务描述" align="center" prop="businessDescription" min-width="200" :show-overflow-tooltip="true" />
    </el-table>
    <pagination
      style="position: fixed; bottom: 15px; right: 15px;"
      :total="total"
      :page.sync="pageNum"
      :limit.sync="pageSize"
      :page-sizes="[10,15,20,30]"
      @pagination="getClearList"
    />
    <el-dialog :visible.sync="showForm" append-to-body style="height: calc(100vh - 0px);" :fullscreen="true">
      <change-form :data="rowInfo"/>
    </el-dialog>
  </div>
</template>

<script>
import constant from '../inventory-mgt/constant/constant'
import changeForm from './components/changeForm'
import { deepClone } from '../../../utils'
import { getChangeLogByPage } from '../../../api/asgt/recordMgt/changeRecord'

export default {
  name: 'changeRecord',
  components:{
    changeForm
  },
  data(){
    return{
      loading: true,
      showForm: false,
      rowInfo: {},
      clearRecord: [],
      total: 0,
      pageNum: 1,
      pageSize: 20,
      changeRecordQuery:{
        supplierName: '',
        companyNature: null,
        startDate: '',
        endDate: ''
      },
      companyNatureMap: constant.companyNatureMap,
      companyNatureOptions: constant.companyNatureOptions,
    }
  },
  created() {
    this.getClearList()
  },
  methods: {
    getClearList(){
      this.loading = true
      if (this.changeRecordQuery.endDate && this.changeRecordQuery.endDate!==''){
        this.changeRecordQuery.endDate = this.changeRecordQuery.endDate + ' 23:59:59'
      }
      getChangeLogByPage(this.pageNum,this.pageSize,this.changeRecordQuery).then(res=>{
        this.clearRecord = res.rows
        this.total = res.total
        this.loading = false
      })
    },
    clickRow(row, column, event){
      this.showForm = true
      this.rowInfo = deepClone(row)
    },
    // 搜索
    handleQuery(){
      this.getClearList()
    },
    // 重置
    resetQuery(){
      this.changeRecordQuery={
        supplierName: '',
        companyNature: null,
        startDate: '',
        endDate: ''
      }
      this.getClearList()
    },
  },
}
</script>

<style scoped>

</style>
