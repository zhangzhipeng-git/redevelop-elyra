import PipelineController from '@src/app/base-pipeline-editor/PipelineController';
import { PipelineService } from '@src/app/pipeline-editor/PipelineService';

let timer: number = -999;

async function getNodeStatus(controller: PipelineController, dagId: string) {
  const res = await PipelineService.status({ dagId });
  const task = res.task;
  console.log(controller, 'controller');
  const oldLabel = (
    controller.getNode('1c10b4a9-7232-4632-8dd5-797aa495884a', 'primary') as any
  ).label;
  console.log(oldLabel, 'node');
  controller.setNodeLabel(
    '1c10b4a9-7232-4632-8dd5-797aa495884a',
    `${oldLabel}xxxx`,
    'primary'
  );
  task.forEach((t: any) => {});
}

export function onUpdateNodeStatus(controller: any, dagId: string) {
  clearTimeout(timer);
  getNodeStatus(controller, dagId);
  timer = setTimeout(() => {
    onUpdateNodeStatus(controller, dagId);
  }, 10000);
  return timer;
}
