import request from '@/utils/request'

const PREFIX = "/supplier-clear";

export function getClearList(pageNum,pageSize,clearRecordQuery){
  return request({
    url: PREFIX + "/getClearList",
    method: 'post',
    params:{pageNum,pageSize},
    data: clearRecordQuery
  });
}

export function getClearByProcessInstanceId(processInstanceId){
  return request({
    url: PREFIX + "/getClearByProcessInstanceId",
    method: 'post',
    params:{processInstanceId},
  });
}

export function addClearRecords(data){
  return request({
    url: PREFIX + "/addClearRecords",
    method: 'post',
    data: data
  });
}
