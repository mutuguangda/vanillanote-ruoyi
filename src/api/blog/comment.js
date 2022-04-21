import request from '@/utils/request'

// 查询评论列表
export function listComment(query) {
  return request({
    url: '/blog/comment/list',
    method: 'get',
    params: query
  })
}

// 查询评论详细
export function getComment(commentId) {
  return request({
    url: '/blog/comment/' + commentId,
    method: 'get'
  })
}

// 新增评论
export function addComment(data) {
  return request({
    url: '/blog/comment',
    method: 'post',
    data: data
  })
}

// 修改专题
export function updateComment(data) {
  return request({
    url: '/blog/comment',
    method: 'put',
    data: data
  })
}

// 删除评论
export function delComment(commentId) {
  return request({
    url: '/blog/comment/' + commentId,
    method: 'delete'
  })
}

// 同步评论
export function syncComment() {
  return request({
    url: '/blog/comment/sync',
    method: 'get',
    timeout: 1000 * 60 * 5,
  })
}

// 强制同步评论
export function forcedSyncComment() {
  return request({
    url: '/blog/comment/forcedSync',
    method: 'get',
    timeout: 1000 * 60 * 5,
  })
}


