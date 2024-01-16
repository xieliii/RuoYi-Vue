import request from '@/utils/request'

const PREFIX = "/supplier";

/**
 * 根据流程实例id获取变更实体列表
 * @returns {*}
 * @param processInstanceId 流程实例id
 */
export function getChangeByProcessInstanceId(processInstanceId){
  return request({
    url: PREFIX + "/getChangeByProcessInstanceId",
    method: 'post',
    params:{processInstanceId},
  });
}
/**
 * 根据流程实例id获取货源供应商实体列表
 * @returns {*}
 * @param processInstanceId 流程实例id
 */
export function getSupplierByProcessInstanceId(processInstanceId){
  return request({
    url: PREFIX + "/getSupplierByProcessInstanceId",
    method: 'post',
    params:{processInstanceId},
  });
}

/**
 * 获取变更实体列表
 * @returns {*}
 * @param pageNum 当前页数
 * @param pageSize 页面大小
 */
export function getChangeLogByPage(pageNum,pageSize,changeRecordQuery){
  return request({
    url: PREFIX + "/getChangeLogByPage",
    method: 'post',
    params:{pageNum,pageSize},
    data: changeRecordQuery
  });
}

/**
 * 新增变更实体
 * @param data 变更记录实体
 * @returns {*}
 */
export function addChangeLog(data){
  return request({
    url: PREFIX + "/addChangeLog",
    method: 'post',
    data: data
  });
}
