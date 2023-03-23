import { PipelineService } from '@src/app/pipeline-editor/PipelineService';

const statusMap: any = {
  success: '运行成功',
  fail: '运行失败',
  running: '运行中',
  undefined: '待运行',
  null: '待运行',
  '': '待运行'
};

export function changeNodeStyles(el: any) {
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
}

async function getNodeStatus(
  controller: any,
  dagId: string,
  doneFn: any,
  el?: HTMLElement
) {
  const res = await PipelineService.status({ dagId });
  const task = res.task;

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
  changeNodeStyles(el);
  if (!done) return;
  clearTimeout(controller?.timer);
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
  clearTimeout(controller.timer);
  getNodeStatus(controller, dagId, doneFn, el);
  controller.timer = setTimeout(() => {
    onUpdateNodeStatus(controller, dagId, doneFn, el);
  }, 10000);
}
