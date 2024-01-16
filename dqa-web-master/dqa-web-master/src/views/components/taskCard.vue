<template>
  <div class="task-card">
    <!--左-->
    <div class="task-tooltip">
      <div class="task-hover" :style="'background-color:'+statusColor(status)">
      </div>
    </div>
    <!--右-->
    <el-popover placement="top-start" width="200" trigger="hover">
      类别：{{category}}
      <br>
      紧急程度：{{urgencyText(urgency)}}
      <br>
      发布时间：{{creatTime}}
      <div class="task-content" slot="reference">
        <div class="task-description" style="width: 150px">
          <div class="task-name">
            <div class="task-name-text" :title="taskTitle">
              {{taskTitle}}
            </div>
            <div class="task-status-text" :style="'color:'+statusColor(status)">{{statusText(status)}}</div>
          </div>

          <div class="task-create-by">
            <i class="el-icon-user"></i>
            {{createBy}}
          </div>

        </div>
      </div>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: 'taskCard',
  props: {
    status: {
      type: String,
      default: ''
    },
    creatTime: {
      type: String,
      default: ''
    },
    createBy: {
      type: String,
      default: ''
    },
    category: {
      type: String,
      default: ''
    },
    urgency: {
      type: String,
      default: ''
    },
    task: {
      type: Object,
      default: {}
    },
    taskTitle:{
      type: String,
      default: "title"
    },
  },
  data(){
    return{
    }
  },
  methods:{
    statusColor(status){
      if(status==='0'){
        return '#F56C6C'
      }else if(status==='1'){
        return '#E6A23C'
      }else {
        return '#67C23A'
      }
    },

    statusText(status){
      if(status==='0'){
        return '未读'
      }else if(status==='1'){
        return '待处理'
      }else {
        return '已完成'
      }
    },

    urgencyText(urgency){
      if(urgency==='0'){
        return '低'
      }
      else if (urgency==='1'){
        return '中'
      }
      else return '高'
    }

  }
}
</script>

<style scoped>
.task-card {
  width: 180px;
  /*height: 158px;*/
  height: 55px;
  /*border-left: #1890ff 5px solid;*/
  border-radius: 4px;
  background-color: white;
  /*transition: border-left-width 300ms linear;*/
  margin: 5px auto;
}

.task-hover {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 5px;
  height: 55px;
  border-bottom-left-radius: 4px;
  border-top-left-radius: 4px;
  cursor: pointer;
  transition: width 218ms ease-in;
  background-color: orangered;
}

.task-card:hover {
  cursor: pointer;
  /*border-left: #1890ff 10px solid;*/
  box-shadow: 0 1px 1px 0 rgba(9, 30, 66, .25), 0 0 1px 0 rgba(9, 30, 66, .31);
  background-color: #f5f6f8;
}

.task-content {
  margin-left: 7px;
}

.task-tooltip {
  position: absolute;
  width: 4px;
  /*height: 158px;*/
  height: 126px;
}

.task-card:hover .task-hover {
  width: 12px;
}

.task-description{
  margin-left: 20px;
  padding-top: 5px;
  width: 260px;
}

.task-name-text{
  line-height: 25px;
  font-size: 13px;
  text-align: left;
  /*margin-left: 30px;*/
  /*margin-top: 5px;*/
  /*width: 260px;*/
  /*white-space: nowrap;*/
  /*overflow: hidden;*/
  /*text-overflow: ellipsis;*/
  font-weight: 550;
}
.task-create-by{
  margin-top: 2px;
  font-size: 13px;
  text-align: left;
}
.task-status-text{
  font-size: 14px;
  float: right
}
</style>
