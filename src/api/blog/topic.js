import request from '@/utils/request'

// 查询文章列表
export function listTopic(query) {
  return request({
    url: '/blog/topic/list',
    method: 'get',
    params: query
  })
}

// 查询文章详细
export function getTopic(topicId) {
  return request({
    url: '/blog/topic/' + topicId,
    method: 'get'
  })
}

// 新增文章
export function addTopic(data) {
  return request({
    url: '/blog/topic',
    method: 'post',
    data: data
  })
}

// 修改专题
export function updateTopic(data) {
  return request({
    url: '/blog/topic',
    method: 'put',
    data: data
  })
}

// 删除文章
export function delTopic(topicId) {
  return request({
    url: '/blog/topic/' + topicId,
    method: 'delete'
  })
}

// 同步文章
export function syncTopic() {
  return request({
    url: '/blog/topic/sync',
    method: 'get',
    timeout: 1000 * 60
  })
}


