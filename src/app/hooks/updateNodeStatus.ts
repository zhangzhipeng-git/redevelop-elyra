import { PipelineService } from '@src/app/pipeline-editor/PipelineService';
import PipelineController from '../base-pipeline-editor/PipelineController';
import { StatusRequest } from '../model';

const colorMap: any = {
  no_status: '#F1F3F4',
  scheduled: '#D2B48C',
  queued: '#808080',
  running: '#00FF00',
  success: '#008000',
  failed: '#FF0000',
  up_for_retry: '#FFD700',
  up_for_rescheduled: '#40E0D0',
  upstream_failed: '#FFA500',
  skipped: '#FFC0CB',
  waiting: '#0066bb'
};

function getStateRichText(oldLabel: string, state: string) {
  if (!state) state = 'waiting';
  return (
    limitLength(oldLabel, 25 - state.length) +
    `<div style="display:inline-flex;align-items:center;float:right;" title="${state}"><span style="display:inline-block;height: 14px;width:14px;margin-right:4px;background:${colorMap[state]};border-radius:2px;"></span>${state}</div>`
  );
}

/**
 * 根据外部手动生成的节点id找出elyra内部生成的节点id
 * @param {string} id 外部手动生成的节点 id （taskId）
 * @param {any[]} nodes 节点
 */
export function getElyraNodeIdByTaskId(id: string, nodes: any) {
  if (!nodes || !nodes[0]) return;
  return nodes.find((n: any) => n?.app_data?.component_parameters?.taskId == id)
    .id;
}
function limitLength(str: string, maxLen = 10) {
  let count = 0;
  for (let i = 0, len = str.length; i < len; i++) {
    if (count >= maxLen) return str.substring(0, i) + '...';
    var code = str.charCodeAt(i);
    count += code > 128 ? 2 : 1;
  }
  return str;
}
async function getNodeStatus(
  controller: PipelineController & { timer: number; _payload: any },
  params: StatusRequest,
  doneFn: any,
  scheduleFn: any
) {
  const { dagId } = params;
  const res = await PipelineService.status(params).catch(() => {
    clearTimeout(controller?.timer);
    return { state: 'failed' } as any;
  });

  let { state, dagRunId } = res;

  state = state.toLocaleLowerCase();
  if (['success', 'failed'].includes(state)) {
    // 运行完毕
    clearTimeout(controller?.timer);
    doneFn(state.indexOf('success') > -1);
  } else if (typeof scheduleFn === 'function') {
    // 其他运行中状态
    scheduleFn(state === 'running' ? '运行中...' : state);
  }

  const showTask = res.showTask;
  if (!showTask) return;
  controller._payload = { dagRunId, showTask };

  const pipelineId = dagId.split('_')[1];
  const nodes = controller.getPipelineFlow()?.pipelines?.[0].nodes ?? [];
  showTask.forEach((t: any) => {
    const { taskId, state } = t;
    const id = getElyraNodeIdByTaskId(taskId, nodes);
    const node: any = controller.getNode(id, pipelineId);
    let oldLabel = node?.label?.split('<div')[0] ?? '';
    controller.setNodeLabel(id, getStateRichText(oldLabel, state), pipelineId);
  });
}

export function onUpdateNodeStatus(
  controller: any,
  params: StatusRequest,
  doneFn: any,
  scheduleFn: any
) {
  if (!params) return;
  clearTimeout(controller.timer);
  getNodeStatus(controller, params, doneFn, scheduleFn);
  controller.timer = setTimeout(() => {
    onUpdateNodeStatus(controller, params, doneFn, scheduleFn);
  }, 10000);
}
