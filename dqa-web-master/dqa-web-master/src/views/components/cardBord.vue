<template>
  <div id="timeBoard" style="display: inline-block">
    <div class="task-column">
      <div class="task-column-header">
        <span class="task-column-header-text" style="font-size: 15px">
         待办事项
        </span>
        <el-link type="primary" href="../asgt/inventory-mgt/source" :underline="false"
                 style="float:right;display:inline-block;margin:10px 15px 0 0;
        font-weight: 450;line-height: 18px;font-size: 10px">更多详情>></el-link>
      </div>

      <div class="task-list" :style="{height:boardHeight-45 + 'px'}">
        <task-card
          v-for="item in taskList"
          :key="item.id"
          :status="item.status"
          :task-title="item.title"
          :create-by="item.createBy"
          :creat-time="item.createTime"
          :category="item.category"
          :urgency="item.urgency"
          :task="item"
        />
      </div>
    </div>
  </div>
</template>

<script>
import taskCard from './taskCard'
export default {
  name: 'cardBord',
  components: {
    taskCard,
  },
  data(){
    return{
      boardHeight:600,
      taskList:[
        { id: 1, title:'文字内容', category:'分类1', urgency:'0', status:'0', createBy: 'lsh', createTime:'2020-2-17' },
        { id: 2, title:'test2', category:'分类2', urgency:'1', status:'1', createBy: 'admin', createTime:'2020-2-17' },
        { id: 3, title:'test3', category:'分类3', urgency:'2', status:'2', createBy: 'admin', createTime:'2020-2-17' }
      ],
    }
  }
}
</script>

<style scoped>
.task-column {
  width: 185px;
  /*height: 735px;*/
  margin-right: 1rem;
  min-width: 12.5rem;
  max-width: 24rem;
  display: inline-flex;
  flex-direction: column;
  vertical-align: top;
  border: 1px solid #dcdcdc;
  border-radius: 4px;
  min-height: 24rem;
  box-sizing: border-box;
  background-color: #f5f6f8;
}

.task-column-header {
  height: 39px;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  background-color: #fafafa;
  border-bottom: 1px solid #dcdcdc;
}

.task-column-header-text {
  display: inline-block;
  margin-top: 10px;
  font-weight: 600;
  line-height: 20px;
  overflow:hidden;
  white-space:nowrap;
  text-overflow: ellipsis;
}

.more-detail-link{
  display: inline-block;
  margin-left: 17px;
  margin-top: 10px;
  font-weight: 600;
  line-height: 20px;
  overflow:hidden;
  white-space:nowrap;
  text-overflow: ellipsis;
}
.task-count {
  display: inline-block;
  margin-left: 80px;
}

.task-count-date {
  display: inline-block;
  /*margin-left: 16px;*/
  margin-left: 6px;
  margin-right: 6px;
  margin-top: 10px;
}

.task-count-date-svg {
  /*position: relative;*/
  /*left: 185px;*/
  /*top: -37px;*/
  /*width: 15px;*/
}

.task-count-svg {
  position: relative;
  left: 210px;
  top: -37px;
  width: 10px;
}

.task-list {
  position: relative;
  height: 735px;
  overflow-y: auto;
}

.column-bottom-text {
  color: #909aaa;
  margin: 10px auto;
  text-align: center;
}

::v-deep .data-picker input {
  cursor: pointer;
}

.task-header-item {
  margin-right: 20px;
}

.task-views {
  float: right;
  margin-right: 130px;
}
</style>
