import { SvgRequestUrl, svgMap } from '@src/assets/svgs';
import Utils from '@src/app/util';

enum NodeSvgKey {
  SparkKubernetesOperator = 'execute-SparkKubernetesOperator-node',
  KubernetesPodOperator = 'execute-KubernetesPodOperator-node',
  Error = 'error'
}

const base64Map = new Map();
base64Map.set(
  NodeSvgKey.KubernetesPodOperator,
  Utils.svgToBase64(svgMap.get(SvgRequestUrl.Airflow))
);
base64Map.set(
  NodeSvgKey.KubernetesPodOperator,
  Utils.svgToBase64(svgMap.get(SvgRequestUrl.Airflow))
);
base64Map.set(
  NodeSvgKey.Error,
  Utils.svgToBase64(svgMap.get(SvgRequestUrl.Error))
);
/**
 * 在编辑器解析渲染pipeline数据时需要将 image 赋值为节点图标 base64
 * @param {any} pipeline
 */
export function onRenderPipeline(pipeline: any) {
  pipeline?.pipelines?.forEach((p: any) => {
    p?.nodes?.forEach((n: any) => {
      const ui_data = n?.app_data?.ui_data;
      if (typeof ui_data !== 'object') return;
      ui_data.image = base64Map.get(n.op);
      ui_data.decorations?.forEach((d: any) => {
        if (!d || d.id !== 'error') return;
        d.image = base64Map.get(NodeSvgKey.Error);
      });
    });
  });
}

/**
 * 在编辑器保存pipeline数据时，删除节点的 image
 * @param {any} pipeline
 */
export function onChangePipeline(pipeline: any) {
  pipeline?.pipelines?.forEach((p: any) => {
    p?.nodes?.forEach((n: any) => {
      const ui_data = n?.app_data?.ui_data;
      if (typeof ui_data !== 'object') return;
      delete n.app_data.ui_data.image;
      ui_data.decorations?.forEach((d: any) => {
        if (!d || d.id !== 'error') return;
        delete d.image;
      });
    });
  });
}

/**
 * 在运行或提交pipeline时，需要获取转化的pipeline
 * @param {any} pipeline
 */
export function onRunOrSubmit(pipeline: any, operator = 'run') {
  console.log(pipeline);
  if (!pipeline) return;

  let newPipeline;
  const pipelineObj = pipeline?.pipelines?.[0] ?? {};
  const dag = pipelineObj.app_data?.properties ?? {};
  const task: any[] = [];
  const taskDependency: any[] = [];
  pipelineObj.nodes?.forEach((n: any) => {
    const id = n?.id;
    const operatorType = n.op?.split('-')[1];
    task.push({
      taskId: id,
      operatorType,
      ...n?.app_data?.component_parameters
    });
    n?.inputs?.[0]?.links?.forEach((link: any) => {
      taskDependency.push({
        source: link?.node_id_ref,
        target: id
      });
    });
  });

  newPipeline = {
    dagFileUuid: `${pipeline.uuid}-${pipelineObj.id}`,
    operator,
    caller: 'elyra',
    dag,
    task,
    taskDependency
  };

  console.log(newPipeline, `${operator} newPipeline`);
  return newPipeline;
}
