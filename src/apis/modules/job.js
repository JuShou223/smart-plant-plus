/*
 * @Date: 2024-09-24 10:53:20
 * @LastEditors: 徐一鸣
 * @LastEditTime: 2025-12-10 16:08:38
 * @Description:
 */

// 查询定时任务调度列表
export function getJobList(query) {
  return uni.$u.http.request({
    url: "/iot/job/list",
    method: "get",
    data: query,
  });
}

// 定时任务立即执行一次
export function runJob(data) {
  return uni.$u.http.request({
    url: "/iot/job/run",
    method: "put",
    data: data,
  });
}

// 任务状态修改
export function changeJobStatus(data) {
  return uni.$u.http.request({
    url: "/iot/job/changeStatus",
    method: "put",
    data: data,
  });
}

// 新增定时任务调度
export function addJob(data) {
  return uni.$u.http.request({
    url: "/iot/job",
    method: "post",
    data: data,
  });
}

// 查询定时任务调度详细
export function getJob(jobId) {
  return uni.$u.http.request({
    url: "/iot/job/" + jobId,
    method: "get",
  });
}

// 修改定时任务调度
export function updateJob(data) {
  return uni.$u.http.request({
    url: "/iot/job",
    method: "put",
    data: data,
  });
}

// 删除定时任务调度
export function delJob(jobId) {
  return uni.$u.http.request({
    url: "/iot/job/" + jobId,
    method: "delete",
  });
}
