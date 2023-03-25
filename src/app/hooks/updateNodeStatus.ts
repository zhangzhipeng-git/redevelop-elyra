import { PipelineService } from '@src/app/pipeline-editor/PipelineService';

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

async function getNodeStatus(
  controller: any,
  dagId: string,
  doneFn: any,
  el?: HTMLElement
) {
  const res = await PipelineService.status({ dagId });
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
  task.forEach((t: any) => {
    done = done && ['success', 'fail'].includes(t.state);
    const node: any = controller.getNode(t.taskId, pipelineId);
    let oldLabel = node?.label?.split(' ')[0] ?? '';
    controller.setNodeLabel(
      t.taskId,
      getStateRichText(limitLength(oldLabel), statusMap[t.state]),
      pipelineId
    );
    arr.push(t.state);
  });
  // changeNodeStyles(el);
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
