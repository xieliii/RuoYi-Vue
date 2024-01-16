<template>
  <div class="app-container home" style="width: 100%;margin-top: 20px">
    <div class="count-body">
      <!--统计-->
      <el-row>
        <el-col :span="8">
          <el-card class="count-card" shadow="hover" @click.native="goTo('./inventory-mgt/source')">
            <el-col :span="12">
              <div style="margin-bottom: 5px">
                <span class="head-text">货源供应商</span>
              </div>
              <div>
                <span class="count-text">总计：{{sourceSum}}</span>
              </div>
            </el-col>
            <el-col style="display: flex;justify-content: flex-end;margin-top: 5px" :span="12">
              <div class="source-icon">
                <i class="el-icon-setting" style="font-size: 28px; color: white"/>
              </div>
            </el-col>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="count-card" shadow="hover" @click.native="goTo('./inventory-mgt/potential')">
            <el-col :span="12">
              <div style="margin-bottom: 5px">
                <span class="head-text">潜在供应商</span>
              </div>
              <div>
                <span class="count-text">总计：{{ potentialSum }}</span>
              </div>
            </el-col>
            <el-col style="display: flex;justify-content: flex-end;margin-top: 5px" :span="12">
              <div class="potential-icon">
                <i class="el-icon-collection" style="font-size: 28px; color: white"/>
              </div>
            </el-col>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="count-card" shadow="hover" @click.native="goTo('./inventory-mgt/approved')">
            <el-col :span="12">
              <div style="margin-bottom: 5px">
                <span class="head-text">获批供应商</span>
              </div>
              <div>
                <span class="count-text">总计：{{ approvedSum }}</span>
              </div>
            </el-col>
            <el-col style="display: flex;justify-content: flex-end;margin-top: 5px" :span="12">
              <div class="approved-icon">
                <i class="el-icon-star-off" style="font-size: 28px; color: white;"/>
              </div>
            </el-col>
          </el-card>
        </el-col>
      </el-row>
      <el-row style="margin-top: 25px;margin-bottom: 20px">
        <el-col :span="4">
          <el-card class="entry-card" @click.native="goTo('./recordMgt/clearRecord')">
            <el-col :span="12">
              <div style="display: flex;
                        justify-content: space-evenly;
                        align-items: center;
                        background: linear-gradient(rgb(234,205,88,0.8)10%,rgb(225,150,22,0.8)90%);
                        width: 48px;
                        height: 48px;
                        border-radius: 50%;"
              >
                <i class="el-icon-document-delete" style="font-size: 28px;color: white"/>
              </div>
            </el-col>
            <el-col style="margin-top: 5px" :span="12">
              <div>
                <span class="entry-text">清退记录</span>
              </div>
            </el-col>
          </el-card>
        </el-col>
        <el-col :span="4">
          <el-card class="entry-card" @click.native="goTo('./recordMgt/changeRecord')">
            <el-col :span="12">
              <div style="display: flex;
                        justify-content: space-evenly;
                        align-items: center;
                        background: linear-gradient(rgb(234,205,88,0.8)10%,rgb(225,150,22,0.8)90%);
                        width: 48px;
                        height: 48px;
                        border-radius: 50%;"
              >
                <i class="el-icon-document-copy" style="font-size: 28px;color: white"/>
              </div>
            </el-col>
            <el-col style="margin-top: 5px" :span="12">
              <div>
                <span class="entry-text">变更记录</span>
              </div>
            </el-col>
          </el-card>
        </el-col>
        <el-col :span="4">
          <el-card class="entry-card" @click.native="goTo('./contractMgt/contractMgt')">
            <el-col :span="12">
              <div style="display: flex;
                        justify-content: space-evenly;
                        align-items: center;
                        background: linear-gradient(rgb(234,205,88,0.8)10%,rgb(225,150,22,0.8)90%);
                        width: 48px;
                        height: 48px;
                        border-radius: 50%;"
              >
                <i class="el-icon-search" style="font-size: 28px;color: white"/>
              </div>
            </el-col>
            <el-col style="margin-top: 5px" :span="12">
              <div>
                <span class="entry-text">合同查询</span>
              </div>
            </el-col>
          </el-card>
        </el-col>
        <el-col :span="4">
          <el-card class="entry-card" @click.native="goTo('./workflow/process')">
            <el-col :span="12">
              <div style="display: flex;
                        justify-content: space-evenly;
                        align-items: center;
                        background: linear-gradient(rgb(234,205,88,0.8)10%,rgb(225,150,22,0.8)90%);
                        width: 48px;
                        height: 48px;
                        border-radius: 50%;"
              >
                <i class="el-icon-connection" style="font-size: 28px;color: white"/>
              </div>
            </el-col>
            <el-col style="margin-top: 5px" :span="12">
              <div>
                <span class="entry-text">我的流程</span>
              </div>
            </el-col>
          </el-card>
        </el-col>
        <el-col :span="4">
          <el-card class="entry-card" @click.native="goTo('./workflow/todoTask')">
            <el-col :span="12">
              <div style="display: flex;
                        justify-content: space-evenly;
                        align-items: center;
                        background: linear-gradient(rgb(234,205,88,0.8)10%,rgb(225,150,22,0.8)90%);
                        width: 48px;
                        height: 48px;
                        border-radius: 50%;"
              >
                <i class="el-icon-message" style="font-size: 28px;color: white"/>
              </div>
            </el-col>
            <el-col style="margin-top: 5px" :span="12">
              <div>
                <span class="entry-text">待办流程</span>
              </div>
            </el-col>
          </el-card>
        </el-col>
        <el-col :span="4">
          <el-card class="entry-card" @click.native="goTo('./workflow/finishTask')">
            <el-col :span="12">
              <div style="display: flex;
                        justify-content: space-evenly;
                        align-items: center;
                        background: linear-gradient(rgb(234,205,88,0.8)10%,rgb(225,150,22,0.8)90%);
                        width: 48px;
                        height: 48px;
                        border-radius: 50%;"
              >
                <i class="el-icon-paperclip" style="font-size: 28px;color: white"/>
              </div>
            </el-col>
            <el-col style="margin-top: 5px" :span="12">
              <div>
                <span class="entry-text">已办流程</span>
              </div>
            </el-col>
          </el-card>
        </el-col>
      </el-row>


      <el-row>
        <!--表格-->
        <el-col :span="10">
          <el-card class="chart" >
<!--            <span style="font-size: 80px;color: #ccb1ea">AVICAS</span>-->
<!--            <br/>-->
<!--            <span style="font-size: 80px;color: #ccb1ea">AVICAS</span>-->
<!--            <br/>-->
<!--            <span style="font-size: 80px;color: #ccb1ea">AVICAS</span>-->
            <flow-statictis-display />
          </el-card>
        </el-col>
        <!--task-->
        <el-col :span="14">
          <div style="position: relative;float: right;right: 70px;top: 60px;z-index: 100;width: 40px;display: flex;justify-content: space-between;">
            <i class="el-icon-refresh" @click="handleProcessRefresh" style="cursor: pointer;"/>
            <i class="el-icon-s-grid" @click="handleToDetail" style="cursor: pointer;"/>
          </div>
          <el-card style="border-radius: 20px;margin: 30px 40px 0 5px;height: 420px" shadow="always">
            <div class="task-div">
              <el-tabs v-model="activeName"  @tab-click="handleClick">
                <el-tab-pane :label="toDoTaskLabel" name="toDoTask">
                  <task-tab :task-list="todoTaskList" :active-name="activeName" @refresh="handleRefresh" />
                </el-tab-pane>
                <el-tab-pane :label="myProcessLabel" name="process">
                  <task-tab :task-list="processList" :active-name="activeName" :loading="loading"/>
                </el-tab-pane>
                <el-tab-pane :label="completeTaskLabel" name="completeTask">
                  <task-tab :task-list="completeTaskList" :active-name="activeName" :loading="loading"/>
                </el-tab-pane>
              </el-tabs>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

  </div>
</template>

<script>
import taskTab from './components/taskTab'
import { getCategorySum } from '../api/asgt/supplier/supplierBase'
import { listDoneTask, listProcessInstance, listTask } from '../api/workflow/workflow-common'
import FlowStatictisDisplay from '@/views/asgt/workflow/flowStatisticDisplay/index.vue'
export default {
  name: "Index",
  components:{
    taskTab,
    FlowStatictisDisplay,
  },
  data() {
    return {
      taskList: [],
      todoTaskList: [],
      processList: [],
      completeTaskList: [],
      pageNum: 0,
      pageSize: 20,
      sourceSum: 0,
      potentialSum: 0,
      approvedSum: 0,
      activeName: 'toDoTask',
      loading: false,
      toDoTaskCount: 0,
      myProcessCount: 0,
      completeTaskCount: 0,
    };
  },
  created() {
    this.init()
  },
  computed:{
    toDoTaskLabel(){
      return `待办事项(${this.toDoTaskCount})`
    },
    myProcessLabel(){
      return `我的流程(${this.myProcessCount})`
    },
    completeTaskLabel(){
      return `已办事项(${this.completeTaskCount})`
    }
  },
  methods: {
    init(){
      listTask(this.pageNum,this.pageSize).then(res=>{
        this.todoTaskList = res.data.records;
        this.toDoTaskCount = res.data.total;
      })
      listProcessInstance().then(res=>{
        this.processList = res.data.records;
        this.myProcessCount = res.data.total;
      })
      listDoneTask(this.pageNum,this.pageSize).then(res=>{
        this.completeTaskList = res.data.records;
        this.completeTaskCount = res.data.total;
      })
      getCategorySum().then(res => {
        this.sourceSum = res.data.sourceSum
        this.potentialSum = res.data.potentialSum
        this.approvedSum = res.data.approvedSum
      })
    },
    // goTarget(href) {
    //   window.open(href, "_blank");
    // },
    handleClick(tab, event) {
    },
    goTo(path) {
      this.$router.push(path)
    },
    handleRefresh(){
      this.init();
    },
    handleProcessRefresh(){
      this.init();
    },
    handleToDetail(){
      if(this.activeName === 'toDoTask'){
        this.$router.push("/workflow/todoTask");
      }else if(this.activeName === 'process'){
        this.$router.push("/workflow/process");
      }else{
        this.$router.push("workflow/finishTask");
      }
    }
  }
}
</script>

<style scoped lang="scss">
.count-body {
  width: 100%;
  height: 15%;
}

.count-card {
  margin: 10px 10px 10px 10px;
  padding: 20px;
  width: 90%;
  height: 130px;
  border-radius: 20px;
  text-align: left;
}
.count-card:hover {
  cursor: pointer;
  -webkit-transform: translateY(-8px);
  -ms-transform: translateY(-8px);
  transform: translateY(-8px);
  -webkit-filter: grayscale(50%);
}
.entry-card {
  background-color: rgb(255,250,240,0.8);
  border: #DC6E60;
  margin: 10px 10px 10px 10px;
  width: 90%;
  height: 80px;
  border-radius: 20px;
  text-align: right;
}
.entry-card:hover{
  cursor: pointer;
  -webkit-transform: translateY(-5px);
  -ms-transform: translateY(-5px);
  transform: translateY(-5px);
  -webkit-filter: saturate(2);
}

.head-text {
  color: #909399;
  font-weight: 900;
  font-size: 17px;
  font-family: "Comic Sans MS", sans-serif;
}

.entry-text {
  margin-right: 8px;
  display: inline-block;
  color: #6E3E36;
  text-align: right;
  font-size: 19px;
  font-weight: 900;
  font-family: "Comic Sans MS", sans-serif;
}

.count-text {
  color: #303133;
  text-align: left;
  font-size: 19px;
  font-weight: 900;
  font-family: "Comic Sans MS", sans-serif;
}

.source-icon {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  background: linear-gradient(rgb(170, 155, 203, 0.8) 10%, rgb(88, 56, 124, 0.8) 90%);
  width: 48px;
  height: 48px;
  border-radius: 50%;
}

.potential-icon {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  background: linear-gradient(rgb(232, 108, 134, 0.8) 10%, rgb(179, 23, 34, 0.8) 90%);
  width: 48px;
  height: 48px;
  border-radius: 50%;
}

.approved-icon {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  background: linear-gradient(rgb(153, 184, 99, 0.8) 10%, rgb(51, 133, 80, 0.8) 90%);
  width: 48px;
  height: 48px;
  border-radius: 50%;
}

.chart {
  width: 95%;
  height: 420px;
  border-radius: 20px;
  margin: 30px 0 0 5px;
  background: linear-gradient(rgb(67, 68, 143, 0.8) 0%, rgb(147, 170, 220, 0.8) 100%);
}

.task-div {
  //width: 95%;
  height: 420px;
  padding: 0 0 0 20px;
  //box-shadow:0 0 5px 1px #999
}
</style>


