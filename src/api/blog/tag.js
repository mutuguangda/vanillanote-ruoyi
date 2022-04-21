import request from '@/utils/request'

// 查询文章列表
export function listTag(query) {
  return request({
    url: '/blog/tag/list',
    method: 'get',
    params: query
  })
}

// 查询文章详细
export function getTag(tagId) {
  return request({
    url: '/blog/tag/' + tagId,
    method: 'get'
  })
}

// 新增文章
export function addTag(data) {
  return request({
    url: '/blog/tag',
    method: 'post',
    data: data
  })
}

// 修改文章
export function updateTag(data) {
  return request({
    url: '/blog/tag',
    method: 'put',
    data: data
  })
}

// 删除文章
export function delTag(tagId) {
  return request({
    url: '/blog/tag/' + tagId,
    method: 'delete'
  })
}

// 同步文章
export function syncTag() {
  return request({
    url: '/blog/tag/sync',
    method: 'get',
    timeout: 1000 * 60
  })
}


