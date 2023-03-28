import { PipelineService } from '@src/app/pipeline-editor/PipelineService';
import PipelineController from '../base-pipeline-editor/PipelineController';
import { StatusRequest } from '../model';

const statusMap: any = {
  success: '运行成功',
  fail: '运行失败',
  running: '运行中',
  undefined: '待运行',
  null: '待运行',
  '': '待运行'
};

function getStateRichText(text: string, state: string) {
  let html = '';
  switch (state) {
    case statusMap.success:
      html = `<div style="float:right;color:green;">${state}</div>`;
      break;
    case statusMap.fail:
      html = `<div style="float:right;color:red;">${state}</div>`;
      break;
    case statusMap.running:
      html = `<div style="float:right;color:#06b;">${state}...</div>`;
      break;
    default:
      html = `<div style="float:right;color:orange;">${state}</div>`;
  }
  return text + html;
}

/**
 * 根据外部手动生成的节点id找出elyra对应的id
 * @param {string} id 外部手动生成的节点 id （taskId）
 * @param {any[]} nodes 节点
 */
function getElyraNodeIdByTaskId(id: string, nodes: any) {
  if (!nodes || !nodes[0]) return;
  return nodes.find((n: any) => n?.app_data?.component_parameters?.taskId == id)
    .id;
}

async function getNodeStatus(
  controller: PipelineController,
  params: StatusRequest,
  doneFn: any
) {
  const { dagId } = params;
  const res = await PipelineService.status(params);
  const task = res.task;

  const limitLength = (str: string, maxLen = 10) => {
    let count = 0;
    for (let i = 0, len = str.length; i < len; i++) {
      if (count >= maxLen) return str.substring(0, i) + '...';
      var code = str.charCodeAt(i);
      count += code > 128 ? 2 : 1;
    }
    return str;
  };

  const pipelineId = dagId.split('-')[1];
  let done = true;
  let arr: string[] = [];
  const nodes = controller.getPipelineFlow()?.pipelines?.[0].nodes ?? [];
  task.forEach((t: any) => {
    const { taskId, state } = t;
    const id = getElyraNodeIdByTaskId(taskId, nodes);
    done = done && ['success', 'fail'].includes(state);
    const node: any = controller.getNode(id, pipelineId);
    let oldLabel = node?.label?.split('<div')[0] ?? '';
    controller.setNodeLabel(
      id,
      getStateRichText(limitLength(oldLabel), statusMap[state]),
      pipelineId
    );
    arr.push(t.state);
  });
  if (!done) return;
  // @ts-ignore
  clearTimeout(controller?.timer);
  if (typeof doneFn !== 'function') return;
  doneFn(!arr.includes('fail'));
}

export function onUpdateNodeStatus(
  controller: any,
  params: StatusRequest,
  doneFn: any
) {
  if (!params) return;
  clearTimeout(controller.timer);
  getNodeStatus(controller, params, doneFn);
  controller.timer = setTimeout(() => {
    onUpdateNodeStatus(controller, params, doneFn);
  }, 10000);
}
