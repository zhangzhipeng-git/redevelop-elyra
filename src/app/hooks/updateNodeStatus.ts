import PipelineController from '@src/app/base-pipeline-editor/PipelineController';
import { PipelineService } from '@src/app/pipeline-editor/PipelineService';

let timer: number = -999;
async function getNodeStatus(
  controller: PipelineController,
  dagId: string,
  doneFn: any,
  el?: HTMLElement
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
  let arr: string[] = [];
  task.forEach((t: any) => {
    done = done && ['success', 'fail'].includes(t.state);
    const node: any = controller.getNode(t.taskId, pipelineId);
    let oldLabel = node.label.split(' ')[0];
    controller.setNodeLabel(
      t.taskId,
      `${limitLength(oldLabel)} ${statusMap[t.state]}`,
      pipelineId
    );
    arr.push(t.state);
  });
  const labels = el?.querySelectorAll(
    '.d3-node-label > span'
  ) as unknown as HTMLElement[];

  labels?.forEach((n: HTMLElement) => {
    const text = n.textContent ?? '';
    const seg = text?.split(' ') ?? [];
    const name = seg[0];
    const sate = seg[1];
    let st = text;
    switch (sate) {
      case statusMap.success:
        st = `<div style="float:right;color:green;">${sate}</div>`;
        break;
      case statusMap.fail:
        st = `<div style="float:right;color:red;">${sate}</div>`;
        break;
      case statusMap.running:
        st = `<div style="float:right;color:#06b;">${sate}...</div>`;
        break;
      default:
        st = `<div style="float:right;color:orange;">${sate}</div>`;
    }
    n.style.display = 'block';
    n.innerHTML = `${name} ${st}`;
  });
  if (!done) return;
  clearTimeout(timer);
  if (typeof doneFn !== 'function') return;
  doneFn(!arr.includes('fail'));
}

export function onUpdateNodeStatus(
  controller: any,
  dagId: string,
  doneFn: any,
  el?: HTMLElement
) {
  if (!dagId) return;
  clearTimeout(timer);
  getNodeStatus(controller, dagId, doneFn, el);
  timer = setTimeout(() => {
    onUpdateNodeStatus(controller, dagId, doneFn, el);
  }, 10000);
  return timer;
}
