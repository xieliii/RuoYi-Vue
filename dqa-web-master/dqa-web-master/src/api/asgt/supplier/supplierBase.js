// 用户当前使用空间操作接口
import request from '@/utils/request'

const PREFIX = "/supplier";

/**
 * 按照分类分页查询供应商列表
 */
export function listAllSupplierByPage(pageNum,pageSize,data){
  return request({
    url: PREFIX + "/listAllSupplierByPage",
    method: 'post',
    params:{
      pageNum,
      pageSize
    },
    data:data
  });
}
/**
 * 按照分类查询供应商列表
 */
export function listAllSupplierByKind(kind){
  return request({
    url: PREFIX + "/listAllSupplierByKind",
    method: 'post',
    params:{kind},
  });
}

/**
 * 测试用接口 添加供应商
 * @param data
 * @returns {*}
 */
export function addSupplier(data){
  return request({
    url: PREFIX + "/addSupplier",
    method: 'post',
    data:data
  });
}

/**
 * 供应商详情
 * @param id 供应商id
 * @returns {*}
 */
export function getSupplierInfo(id){
  return request({
    url: PREFIX + "/getSupplierInfo",
    method: 'post',
    params:{id}
  });
}

/**
 * 修改供应商数据
 * @param data 供应商实体
 * @returns {*}
 */
export function editSupplierInfo(data){
  return request({
    url: PREFIX + "/editSupplierInfo",
    method: 'post',
    data: data
  });
}

/**
 * 首页获取数量接口
 * @returns {*}
 */
export function getCategorySum(){
  return request({
    url: PREFIX + "/getCategorySum",
    method: 'post',
  });
}
