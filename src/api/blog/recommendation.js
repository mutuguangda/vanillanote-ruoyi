import request from '@/utils/request'

// 查询评论列表
export function listRecommendation(query) {
  return request({
    url: '/blog/recommendation/list',
    method: 'get',
    params: query
  })
}

// 查询评论详细
export function getRecommendation(recommendationId) {
  return request({
    url: '/blog/recommendation/' + recommendationId,
    method: 'get'
  })
}

// 新增评论
export function addRecommendation(data) {
  return request({
    url: '/blog/recommendation',
    method: 'post',
    data: data
  })
}

// 修改推荐
export function updateRecommendation(data) {
  return request({
    url: '/blog/recommendation',
    method: 'put',
    data: data
  })
}

// 删除评论
export function delRecommendation(recommendationId) {
  return request({
    url: '/blog/recommendation/' + recommendationId,
    method: 'delete'
  })
}

// 同步评论
export function syncRecommendation() {
  return request({
    url: '/blog/recommendation/sync',
    method: 'get',
    timeout: 1000 * 60
  })
}


