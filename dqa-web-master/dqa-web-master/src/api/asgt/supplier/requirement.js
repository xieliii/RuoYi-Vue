// 用户当前使用空间操作接口
import request from '@/utils/request'

const PREFIX = "/supplier-requirement";


/**
 * 测试用接口 新增潜在需求
 * @param data
 * @returns {*}
 */
export function addPotentialReq(data){
  return request({
    url: PREFIX + "/addPotentialReq",
    method: 'post',
    data:data
  });
}

/**
 * 测试用接口 新增获批需求
 * @param data
 * @returns {*}
 */
export function addApprovedReq(data){
  return request({
    url: PREFIX + "/addApprovedReq",
    method: 'post',
    data:data
  });
}

/**
 * 修改潜在需求数据
 * @param data 潜在需求实体
 * @returns {*}
 */
export function updatePotentialReq(data){
  return request({
    url: PREFIX + "/updatePotentialReq",
    method: 'post',
    data: data
  });
}

/**
 * 修改获批需求数据
 * @param data 获批需求实体
 * @returns {*}
 */
export function updateApprovedReq(data){
  return request({
    url: PREFIX + "/updateApprovedReq",
    method: 'post',
    data: data
  });
}

/**
 * 潜在需求详情
 * @param id 潜在需求id
 * @returns {*}
 */
export function getPotentialById(id){
  return request({
    url: PREFIX + "/getPotentialById",
    method: 'post',
    params:{id}
  });
}

/**
 * 根据流程实例id 潜在需求详情
 * @param dto 获批需求id
 * @returns {*}
 */
export function getPotentialByProcessInstanceId(dto){
  return request({
    url: PREFIX + "/getPotentialByProcessInstanceId",
    method: 'post',
    data: dto
  });
}

/**
 * 根据流程实例id 获批需求详情
 * @param dto 获批需求id
 * @returns {*}
 */
export function getApprovedByProcessInstanceId(dto){
  return request({
    url: PREFIX + "/getApprovedByProcessInstanceId",
    method: 'post',
    data: dto
  });
}


export function getApprovedReqByProcess(dto){
  return request({
    url: PREFIX + "/getApprovedReqByProcess",
    method: 'post',
    data: dto
  });
}


/**
 * 获批需求详情
 * @param id 获批需求id
 * @returns {*}
 */
export function getApprovedById(id){
  return request({
    url: PREFIX + "/getApprovedById",
    method: 'post',
    params:{id}
  });
}
