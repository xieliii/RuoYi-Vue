<template>
  <div>
    <div @click="openDialog">
      <el-input placeholder="请选择供应商" v-model="supplierName" readonly :disabled="disabled" :style="inputStyle" >
        <i slot="suffix" class="el-input__icon el-icon-circle-close" @click.stop="clear"
           v-if="clearable && !disabled"></i>
      </el-input>
    </div>
    <el-dialog :close-on-click-modal="false" :visible.sync="visible" lock-scroll
               append-to-body width="60%" :modal-append-to-body="false">
      <h2 align="center" style="padding-bottom: 20px">请选择供应商
        <el-tooltip class="item" effect="dark" content="点击行选择供应商" placement="right">
          <i class="el-icon-warning-outline"></i>
        </el-tooltip>
      </h2>
      <!--搜索-->
      <el-form ref="queryForm">
        <el-row>
          <el-col :span="10">
            <el-form-item label="关键字">
              <el-input v-model="keyword" style="width: 80%;margin-right: 8px" placeholder="供应商名称或者编号的关键字" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-button icon="el-icon-refresh-right" circle @click="getList"/>
          </el-col>
        </el-row>
      </el-form>
      <!--表-->
      <el-table v-loading="loading" :data="supplierList" height="550px" @row-click="clickRow">
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
    value:{
      type:String,
      default: ''
    },
    listIndex: {
      type: Number,
      default: 0
    },
    kind:{
      type: Number,
      default: 0
    },
    disabled: {
      type: Boolean,
      default: false
    },
    inputStyle: {
      type: String,
      default: ''
    },
    clearable: {
      type: Boolean,
      default: true
    },
  },
  data(){
    return{
      keyword: '',
      supplierList: [],

      supplierName: '',
      selectedData: {},

      loading: false,
      visible: false,
      companyNatureMap: constant.companyNatureMap,
      companyNatureOptions: constant.companyNatureOptions,
      supplierCategoryMap: constant.supplierCategoryMap,
    }
  },
  watch:{
    keyword:{
      handler(newName,oldName){
        if (newName !== ''){
          this.supplierList = this.supplierList.filter(function(item){
            return item.supplierName.includes(newName)||item.code.includes(newName)
          })
        }
      }
    },
    value(val) {
      this.setDefault()
    },
  },
  created() {
    this.init()
    this.setDefault()
  },
  methods: {
    init(){
      this.loading = true
      listAllSupplierByKind(this.kind).then(res=>{
        this.supplierList = res.data
        this.loading = false
      })
    },
    setDefault() {
      if (!this.value) return this.supplierName = ''
      this.selectedData = this.supplierList.find(item=>item.id===this.value)
      let txt = ''
      if(this.selectedData){
        txt = this.selectedData.supplierName
      }
      this.supplierName = txt
      // getSupplierInfo(this.value).then(res=>{
      //   this.selectedData = deepClone(res.data)
      //   let txt = ''
      //   if(this.selectedData){
      //     txt = this.selectedData.supplierName
      //   }
      //   this.supplierName = txt
      // })
    },
    getList(){
      listAllSupplierByKind(this.kind).then(res=>{
        this.supplierList = res.data
      })
    },
    clickRow(row, column, event){
      this.supplierName = row.supplierName
      this.selectedData = deepClone(row)
      getSupplierInfo(this.selectedData.id).then(res=>{
        this.selectedData.productsInfo = res.data.productsInfo
        this.$emit('change',this.selectedData.id, this.selectedData)
      })
      this.$emit('input', this.value)
      this.$emit('getInfo', this.selectedData.id, this.selectedData,this.listIndex)
      this.visible = false
    },
    clear() {
      if (this.disabled) return
      this.supplierName = ''
      this.$emit('input', '')
      this.$emit('change', '', {})
    },
    openDialog(){
      if(!this.disabled){
        this.visible = true
      }
    }
  }
}
</script>

<style scoped>

</style>
