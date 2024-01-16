import request from '@/utils/request'

const PREFIX = "/contract-mgt";


/**
 * 合同分页
 * @param data 查询参数和分页
 * @returns {*}
 */
export function getContractByPage(data){
  return request({
    url: PREFIX + "/getContractByPage",
    method: 'post',
    data:data
  });
}

/**
 * 新增合同
 * @param data 合同
 * @returns {*}
 */
export function addContract(data){
  return request({
    url: PREFIX + "/addContract",
    method: 'post',
    data:data
  });
}

/**
 * 修改合同
 * @param data 合同
 * @returns {*}
 */
export function updateContract(data){
  return request({
    url: PREFIX + "/updateContract",
    method: 'post',
    data: data
  });
}

/**
 * 合同详情
 * @param id 合同id
 * @returns {*}
 */
export function getContractById(id){
  return request({
    url: PREFIX + "/getContractById",
    method: 'post',
    params:{id}
  });
}
