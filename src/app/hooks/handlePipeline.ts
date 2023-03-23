import { SvgRequestUrl, svgMap } from '@src/assets/svgs';
import Utils from '@src/app/util';
import Topology from '../util/topology';

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

function getPipelineEdges(pipelineObj: any) {
  const taskDependency: any[] = [];
  pipelineObj.nodes?.forEach((n: any) => {
    const id = n?.id;
    n?.inputs?.[0]?.links?.forEach((link: any) => {
      taskDependency.push({
        source: link?.node_id_ref,
        target: id
      });
    });
  });
  return taskDependency;
}

/**
 * 在运行或提交pipeline时，需要获取转化的pipeline
 * @param {any} pipeline
 */
export function onRunOrSubmit(pipeline: any, operator = 'run') {
  
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

  
  return newPipeline;
}

function isEmpty(v: null | string) {
  return v == null || (typeof v === 'string' && v.trim() === '');
}

/**
 * 校验pipeline数据
 * @param pipelineJson
 * @param schema
 */
export function validatePipeline(pipeline: any, palette: any) {
  if (!pipeline || !palette) return;
  const pipelineObj = pipeline?.pipelines?.[0] ?? {};
  let errors: any[] = [];
  // 1.先检验有没有环路
  const edges = getPipelineEdges(pipelineObj);
  if (new Topology().isLoop(edges)) {
    errors.push({ message: 'DAG存在环路' });
  }
  // 2.根据 palette 校验 pipeline属性和节点属性
  const pipelineProperties = pipelineObj.app_data?.properties ?? {};
  const pipelineNodes = pipelineObj.nodes ?? [];
  const pipelinePropertiesSchema = palette?.properties ?? {};
  // schema
  const pipelineRequired = pipelinePropertiesSchema.required ?? [];
  const pipelinePropertiesSchemaProperties =
    pipelinePropertiesSchema.properties ?? {};
  pipelineRequired.forEach((r: string) => {
    const p = pipelinePropertiesSchemaProperties[r];
    if (isEmpty(pipelineProperties[r]) && p.title) {
      errors.push({ message: `请求填写工作流基本信息"${p.title}"` });
    }
  });
  const getNodeSchema = (op: string) =>
    palette.categories?.[0]?.node_types?.find((n: any) => op === n.op)?.app_data
      ?.properties?.properties.component_parameters ?? {};

  pipelineNodes.forEach((n: any) => {
    const nodeProperties = n?.app_data?.component_parameters ?? {};
    const nodeLabel = n?.app_data?.ui_data?.label ?? nodeProperties.name ?? '';
    // schema
    const nodeSchema = getNodeSchema(n.op);
    const required = nodeSchema?.required ?? [];
    const nodeSchemaProperties = nodeSchema?.properties ?? {};
    required.forEach((r: string) => {
      const p = nodeSchemaProperties[r];
      if (isEmpty(nodeProperties[r]) && p.title) {
        errors.push({ message: `请填写节点${nodeLabel}的属性"${p.title}"` });
      }
    });

    // 动态字段校验(schema目前是写死的，暂时没有找到依赖校验的写法，这里手动判断。)
    if (
      nodeProperties?.type?.match(/java|scala/) &&
      !nodeProperties?.['mainClass']
    ) {
      errors.push({
        message: `请填写节点${nodeLabel}的属性"${nodeSchemaProperties?.['mainClass'].title}"`
      });
    }
  });
  return errors;
}
