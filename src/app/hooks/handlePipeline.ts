import { SvgRequestUrl, svgMap } from '@src/assets/svgs';
import { AirflowOperatorEnum } from '@src/app/enums';
import { UPLOAD_VIEW_FIELD_PREFIX } from '@src/app/const';
import Topology from '@src/app/util/topology';
import Utils from '@src/app/util';

enum SvgKeyEnum {
  ERROR = 'error'
}

const base64Map = new Map();
base64Map.set(
  AirflowOperatorEnum.K8S,
  Utils.svgToBase64(svgMap.get(SvgRequestUrl.K8s))
);
base64Map.set(
  AirflowOperatorEnum.SPARK,
  Utils.svgToBase64(svgMap.get(SvgRequestUrl.Spark))
);
base64Map.set(
  SvgKeyEnum.ERROR,
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
        d.image = base64Map.get(SvgKeyEnum.ERROR);
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
 * 获取dag依赖关系
 * @param pipelineObj pipeline
 */
function getPipelineEdges(pipelineObj: any) {
  const taskDependency: any[] = [];
  const nodes = pipelineObj.nodes ?? [];
  nodes.forEach((n: any) => {
    const target = n.app_data?.component_parameters?.taskId;
    n?.inputs?.[0]?.links?.forEach((link: any) => {
      taskDependency.push({
        source: getTaskIdByElyraNodeId(link?.node_id_ref, nodes),
        target
      });
    });
  });
  return taskDependency;
}

/**
 * 根据elyra的id找出手动生成的节点id （taskId）
 * @param {string} id redevelop-elyra 内部生成的节点 id
 * @param {any[]} nodes 节点
 */
export function getTaskIdByElyraNodeId(id: string, nodes: any) {
  if (!nodes || !nodes[0]) return;
  return nodes.find((n: any) => n.id == id)?.app_data?.component_parameters
    .taskId;
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
  pipelineObj.nodes?.forEach((n: any) => {
    const operatorType = n.op;
    const nodeParams = n?.app_data?.component_parameters ?? {};
    // 删除只用于前端展示文件路径的字段，因为后端用不到这些字段
    Object.keys(nodeParams).forEach((k: string) => {
      if (k[0] !== UPLOAD_VIEW_FIELD_PREFIX) return;
      delete nodeParams[k];
    });
    task.push({
      operatorType,
      ...nodeParams
    });
  });
  const taskDependency = getPipelineEdges(pipelineObj);

  // 调度周期清除用户自定义输入标志
  if (dag.scheduleInterval?.indexOf('custom') > -1)
    dag.scheduleInterval = dag.scheduleInterval.replace(/custom/g, '');

  // 回填时间按照后端格式进行格式化处理
  let startTime = dag.startTime?.replace(/\/|:| /g, ',');
  startTime =
    startTime
      ?.split(',')
      ?.map((t: string) => parseInt(t))
      ?.join(',') ?? '';

  newPipeline = {
    dagFileUuid: `${pipeline.uuid}_${pipelineObj.id}`,
    operator,
    caller: 'redevelop-elyra',
    dag: {
      ...dag,
      isStream: +dag.isStream,
      whetherRetry: +dag.whetherRetry,
      startTime
    },
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
    errors.push({ message: '工作流存在环路' });
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
      n.op === AirflowOperatorEnum.SPARK &&
      !nodeProperties?.['mainClass']
    ) {
      errors.push({
        message: `请填写节点${nodeLabel}的属性"${nodeSchemaProperties?.['mainClass'].title}"`
      });
    }
  });
  return errors;
}
