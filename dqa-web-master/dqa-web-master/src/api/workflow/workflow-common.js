import request from '@/utils/request'

export function listTask(current, pageSize){
  return request({
    url: "/workflow/listTask",
    method: "get",
    params: {current, pageSize}
  })
}

export function listTaskByQueryCondition(current, pageSize, name){
  return request({
    url: "/workflow/listTaskByQueryCondition",
    method: "get",
    params: {current, pageSize, name}
  })
}

export function listDoneTask(current, pageSize){
  return request({
    url: "/workflow/listDoneTask",
    method: "get",
    params: {current, pageSize}
  })
}

export function listDoneTaskByQueryCondition(current, pageSize, name){
  return request({
    url: "/workflow/listDoneTaskByQueryCondition",
    method: "get",
    params: {current, pageSize, name}
  })
}

export function listProcessInstance(current, pageSize){
  return request({
    url: "/workflow/listProcessInstance",
    method: "get",
    params: {current, pageSize}
  })
}

export function listProcessInstanceByQueryCondition(current, pageSize, name){
  return request({
    url: "/workflow/listProcessInstanceByQueryCondition",
    method: "get",
    params: {current, pageSize, name}
  })
}

/**
 * 启动流程
 * @param businessData 业务数据
 * @param processKey 流程键
 * @returns 启动流程
 */
export function startProcess(businessData, processKey){
  return request({
    url: "/workflow/startProcess",
    method: "post",
    data: {businessData, processKey}
  })
}

export function getProcessXmlDataByKey(key){
  return request({
    url: "/workflow/getProcessXmlDataByKey",
    method: "get",
    params: {key}
  })
}

export function getProcessDetailById(processInstanceId){
  return request({
    url: "/workflow/getProcessDetailById",
    method: "get",
    params: {processInstanceId}
  })
}


export function listRejecttableTaskOfProcess(processInstanceId){
  return request({
    url: "/workflow/listRejecttableTaskOfProcess",
    method: "get",
    params: {processInstanceId}
  })
}

/**
 * 流程通过
 * @param taskId 任务id
 * @param businessData 业务数据
 * @param comment 评论
 * @returns 流程通过
 */
export function completeTask(taskId, businessData, comment){
  return request({
    url: "/workflow/completeTask",
    method: "post",
    data: {taskId, businessData, comment}
  })
}

/**
 * 流程终止
 * @param taskId 任务id
 * @param businessData 业务数据
 * @param comment 评论
 * @returns 流程终止结果
 */
export function stopProcess(taskId, businessData, comment){
  return request({
    url: "/workflow/stopProcess",
    method: "post",
    data: {taskId, businessData, comment}
  })
}

/**
 * 流程驳回
 * @param taskId 流程任务id
 * @param businessData 业务数据
 * @param comment 评论
 * @param rejectTaskKey 驳回节点key
 * @returns 驳回结果
 */
export function rejectProcess(taskId, businessData, comment, rejectTaskKey){
  return request({
    url: "/workflow/rejectProcess",
    method: "post",
    data: {taskId, businessData, comment, rejectTaskKey}
  })
}

/**
 * 流程转办
 * @param taskId 流程任务id
 * @param businessData 业务数据
 * @param comment 流程评论
 * @param assignee 转办人
 * @returns 流程转办结果
 */
export function assigneeTask(taskId, businessData, comment, assignee){
  return request({
    url: "/workflow/assigneeTask",
    method: "post",
    data: {taskId, businessData, comment, assignee}
  })
}


export function listProcessStatistic(){
  return request({
    url: "/workflow/listProcessStatistic",
    method: "get",
  })
}



