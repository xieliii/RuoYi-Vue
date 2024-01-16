<template>
  <div>
    <el-form ref="potentialForm" :model="potentialForm" label-width="120px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="需求编号" prop="reqCode">
            <el-input v-model="potentialForm.reqCode" placeholder="请输入需求编号" style="width: 75%" :disabled="formDisabled"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="供应商部门主管" prop="managerId">
            <el-input v-model="potentialForm.managerId" placeholder="请选择供应商主管" style="width: 75%" :disabled="formDisabled"/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="需求名称" prop="reqName">
            <el-input v-model="potentialForm.reqName" placeholder="请输入需求名称" style="width: 75%" :disabled="formDisabled"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
<!--        <el-col :span="8">-->
<!--          <el-form-item label="供应商类别" prop="category">-->
<!--            <el-select v-model="potentialForm.category" placeholder="请选择供应商类别" style="width: 75%" :disabled="formDisabled">-->
<!--              <el-option v-for="item in supplierType" :key="item.value" :value="item.value" :label="item.label" /></el-select>-->
<!--          </el-form-item>-->
<!--        </el-col>-->
        <el-col :span="8">
          <el-form-item label="论证材料附件" prop="argumentationFileId">
            <oss-file-upload v-model="potentialForm.argumentationFileId" :disabled="formDisabled"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="需求来源说明" prop="sourceDescription">
        <el-input v-model="potentialForm.sourceDescription" type="textarea" placeholder="请输入需求来源说明" style="width: 93%" :autosize="{ minRows: 3 }" :disabled="formDisabled"/>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import constant from '../constant/constant'

export default {
  name: 'potentialBaseForm',
  props:{
    formDisabled: {
      type: Boolean,
      default: false
    },
    potentialForm:{
      type: Object,
      default: ()=>({
        reqCode:null, managerId: null,reqName: null, category: null, argumentationFileId: null, sourceDescription: null
      })
    }
  },
  data(){
    return{
      supplierType: constant.supplierType,
    }
  },
  methods:{
  }
}
</script>

<style scoped>

</style>
