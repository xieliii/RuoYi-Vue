<template>
  <div>
    <el-button icon="el-icon-plus" @click="openDialog" size="small" type="warning" :style="buttonStyle" plain>批量选择供应商</el-button>
<!--    <div @click="visible=true">-->
<!--      <el-input placeholder="请选择供应商" v-model="supplierNames" readonly :disabled="disabled" :style="inputStyle">-->
<!--        <i slot="suffix" class="el-input__icon el-icon-circle-close" @click.stop="clear"-->
<!--           v-if="clearable && !disabled"></i>-->
<!--      </el-input>-->
<!--    </div>-->
    <el-dialog :close-on-click-modal="false" :visible.sync="visible" lock-scroll
               append-to-body width="70%" :modal-append-to-body="false" destroy-on-close>
      <!--搜索-->
      <el-form ref="queryForm" v-model="queryParams">
        <el-row>
          <el-col :span="6">
            <el-form-item label="关键字">
              <el-input v-model="queryParams.keyword" style="width: 75.5%;margin-right: 8px" placeholder="请输入供应商名称的关键字" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="编号">
              <el-input v-model="queryParams.code" style="width: 78%;margin-right: 8px" placeholder="请输入编号的关键字" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="公司性质">
              <el-select v-model="queryParams.companyNature" style="width: 70%;margin-right: 8px" placeholder="请选择公司性质" clearable>
                <el-option v-for="item in companyNatureOptions" :key="item.value" :value="item.value" :label="item.label"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="search">搜索</el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!--表-->
      <el-table v-loading="loading" :data="supList" @selection-change="handleSelection" height="550px" :row-key="getRowKey" ref="supplierMultiSelector">
        <el-table-column type="selection" align="center" width="55" :reserve-selection="true"/>
        <el-table-column prop="supplierName" align="center" label="供应商名称" min-width="150px" />
        <el-table-column prop="code" align="center" label="供应商编号" min-width="150px" />
        <el-table-column label="公司性质" align="center" min-width="100px">
          <template slot-scope="scope">
            <span>{{companyNatureMap[scope.row.companyNature]}}</span>
          </template>
        </el-table-column>
        <el-table-column label="所在清册" align="center" min-width="100px">
          <template slot-scope="scope">
            <span>{{supplierCategoryMap[scope.row.category]}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">提 交</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listAllSupplierByKind,getSupplierInfo } from '../../../../api/asgt/supplier/supplierBase'
import { deepClone } from '../../../../utils'
import constant from '../constant/constant'

export default {
  name: 'supplierSelect',
  props:{
    supplierList: {
      type: Array,
      default: ()=>([])
    },
    existIds: {
      type: Array,
      default: ()=>([])
    },
    kind:{
      type: Number,
      default: 1
    },
    disabled: {
      type: Boolean,
      default: false
    },
    buttonStyle: {
      type: String,
      default: ''
    },
    clearable: {
      type: Boolean,
      default: true
    },
    category:{
      type: Number,
      default: 0
    }
  },
  watch: {
    supplierList: {
      handler(val){
        if (val){
          this.supList = val
        }
      },
      deep: true
    }
  },
  data(){
    return{
      queryParams:{
        companyNature: null,
        keyword: '',
        code: '',
      },
      supList: [],

      selectedIds: [],
      selectedData: [],

      loading: false,
      visible: false,
      companyNatureMap: constant.companyNatureMap,
      companyNatureOptions: constant.companyNatureOptions,
      supplierCategoryMap: constant.supplierCategoryMap,
    }
  },
  created() {
    setTimeout(this.resetQuery,2000)
    // this.resetQuery()
    // this.supList = this.supplierList
    this.setDefault()
  },
  methods: {
    init(){
      for (const key of this.existIds) {
        for (const row of this.supList) {
          if (row.id === key){
            this.$refs.supplierMultiSelector.toggleRowSelection(row,true);
          }
        }
      }
      // this.existIds.forEach(key => {
      //   this.supList.forEach(row => {
      //     if (row.id === key) {
      //       this.$refs.supplierMultiSelector.toggleRowSelection(row,true);
      //     }
      //   })
      // })
    },
    // init(){
    //   this.loading = true
    //   listAllSupplierByKind(this.kind).then(res=>{
    //     this.supList = res.data
    //     this.loading = false
    //   })
    // },
    setDefault() {
      this.selectedIds = []
      this.selectedData = []
    },
    // setDefault() {
    //   if (!this.id) return this.supplierNames = ''
    //   getSupplierInfo(this.id).then(res=>{
    //     this.selectedData = deepClone(res.data)
    //     let txt = ''
    //     if(this.selectedData){
    //       txt = this.selectedData.supplierName
    //     }
    //     this.supplierNames = txt
    //   })
    // },
    // 提交
    submit() {
      this.$emit('getSupplierInfo', this.selectedIds, this.selectedData)
      this.visible = false
    },
    // 搜索
    search() {
      if (this.queryParams.keyword && this.queryParams.keyword!==''){
        this.supList = this.supList.filter(item => item.supplierName.includes(this.queryParams.keyword))
      }
      if (this.queryParams.code && this.queryParams.code!==''){
        this.supList = this.supList.filter(item => item.code.includes(this.queryParams.code))
      }
      // this.supList = this.supList.filter(item => item.supplierName.includes(this.queryParams.keyword)).filter(item => item.code.includes(this.queryParams.code))
      if (this.queryParams.companyNature !== null) {
        this.supList = this.supList.filter(item => item.companyNature === this.queryParams.companyNature)
      }
    },
    resetQuery() {
      this.queryParams = {
        companyNature: null,
        keyword: '',
        code: '',
      }
      listAllSupplierByKind(this.category).then(res=>{
        this.supList = res.data
      })
    },
    // clickRow(row, column, event){
    //   this.projectInfo = row.supplierName
    //   this.selectedData = deepClone(row)
    //   this.$emit('input', this.selectedData.id)
    //   this.$emit('change', this.selectedData.id, this.selectedData)
    //   this.visible = false
    // },
    handleSelection(selection) {
      this.selectedIds = selection.map(item => item.id);
      this.selectedData = selection.map(item => item)
    },
    clear() {
      if (this.disabled) return
      this.selectedIds = []
      this.selectedData = []
      // this.$emit('input', '')
      // this.$emit('change', [], '')
    },
    getRowKey(row){
      return row.id;
    },
    cancel() {
      this.visible = false
      this.selectedIds = []
      this.selectedData = []
      this.queryParams = {
        companyNature: null,
        keyword: '',
        code: '',
      }
    },
    openDialog() {
      this.visible = true
      this.$nextTick(()=>{
        this.init()
      })
    },
  }
}
</script>

<style scoped>

</style>
