import PipelineController from '@src/app/base-pipeline-editor/PipelineController';
import { PipelineService } from '@src/app/pipeline-editor/PipelineService';

let timer: number = -999;

async function getNodeStatus(
  controller: PipelineController,
  dagId: string,
  doneFn: any
) {
  const res = await PipelineService.status({ dagId });
  const task = res.task;

  const statusMap: any = {
    success: '运行成功',
    fail: '运行失败',
    running: '运行中',
    undefined: '待运行',
    null: '待运行',
    '': '待运行'
  };
  const limitLength = (str: string, len = 10) =>
    !!str[len] ? str.substr(0, len) + '...' : str;

  const pipelineId = dagId.split('-')[1];
  let done = true;
  task.forEach((t: any) => {
    done = done && ['success', 'fail'].includes(t.state);
    const node: any = controller.getNode(t.taskId, pipelineId);
    let oldLabel = node.label.split(' ')[0];
    controller.setNodeLabel(
      t.taskId,
      `${limitLength(oldLabel)} ${statusMap[t.state]}`,
      pipelineId
    );
  });
  if (!done) return;
  clearTimeout(timer);
  if (typeof doneFn !== 'function') return;
  doneFn();
}

export function onUpdateNodeStatus(
  controller: any,
  dagId: string,
  doneFn: any
) {
  if (!dagId) return;
  clearTimeout(timer);
  getNodeStatus(controller, dagId, doneFn);
  timer = setTimeout(() => {
    onUpdateNodeStatus(controller, dagId, doneFn);
  }, 10000);
  return timer;
}
