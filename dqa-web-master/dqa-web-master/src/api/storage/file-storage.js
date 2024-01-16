import request from '@/utils/request'

/**
 * 文件上传接口
 * @param file 文件
 * @param path 上传逻辑路径，已办按照业务域划分
 * @returns 文件上传的详细信息
 */
export function uploadFile(file, path){
  let formData = new FormData();
  formData.append("file", file);
  formData.append("path", path);
  return request({
    url: "/fileStorage/uploadFile",
    method: "post",
    headers:{
      "Content-Type": "multipart/form-data"
    },
    data: formData,
  })
}

export function uploadImageFile(file, path){
  let formData = new FormData();
  formData.append("file", file);
  formData.append("path", path);
  return request({
    url: "/fileStorage/uploadImageFile",
    method: "post",
    headers:{
      "Content-Type": "multipart/form-data"
    },
    data: formData,
  })
}

/**
 * 文件批量上传接口
 * @param fileList 文件列表
 * @param path 文件上传的逻辑路径，一般按照业务域进行划分
 * @returns 批量上传接口
 */
export function batchUploadFile(fileList, path){
  let formData = new FormData();
  fileList.forEach(item=>{
    formData.append("file", item);
  })
  formData.append("path", path);
  return request({
    url: "/fileStorage/batchUploadFile",
    method: "post",
    headers:{
      "Content-Type": "multipart/form-data"
    },
    data: formData,
  })
}

/**
 * 根据文件路径下载文件
 * @param url 文件路径
 * @returns 文件下载流
 */
export function downloadFileByUrl(url){
  return request({
    url: "/fileStorage/downloadFileByUrl",
    method: "get",
    params:{ url }
  })
}

/**
 * 根据文件id获取文件输出流
 * @param id 文件id
 * @returns 下载文件流
 */
export function downloadFileById(id){
  return request({
    url: "/fileStorage/downloadFileById",
    method: "get",
    params:{ id }
  })
}

/**
 * 根据文件id删除文件
 * @param id 文件id
 * @returns 文件删除结果
 */
export function deleteFileById(id){
  return request({
    url: "/fileStorage/deleteFileById",
    method: "get",
    params:{ id }
  })
}

/**
 * 根据文件路径删除文件
 * @param url 文件路径
 * @returns 文件删除结果
 */
export function deleteFileByUrl(url){
  return request({
    url: "/fileStorage/deleteFileByUrl",
    method: "get",
    params:{ url }
  })
}
