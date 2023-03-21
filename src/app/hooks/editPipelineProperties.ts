import PipelineController from '@src/app/base-pipeline-editor/PipelineController';
import { PipelineService } from '@src/app/pipeline-editor/PipelineService';
import Utils from '@src/app/util';

export async function onAfterSelectApp({
  type,
  applicationId,
  controller
}: {
  type: string;
  applicationId: number;
  controller: PipelineController;
}) {
  console.log('onUpdateNodeProperties');

  // 1. 重新设置节点的k8s集群连接信息选项
  const palette = controller.getPalette();
  if (!palette) return;
  const clonePalette = Utils.clone(palette);
  const res = await PipelineService.conn({ type, applicationId });
  const node_types = clonePalette.categories?.[0]?.node_types;
  node_types?.forEach((node: any) => {
    const properties =
      node.app_data.properties.properties.component_parameters.properties;
    properties.connection.enum = res.map(({ connId }) => connId);
    properties.namespace.enumValues = res.map(({ connName }) => connName);
  });
  controller.setPalette(clonePalette);

  // 2. 重置节点的k8s集群连接信息
  const pipelineFlow = controller.getPipelineFlow();
  if (!pipelineFlow) return;
  const clonePipelineFlow = Utils.clone(pipelineFlow);
  clonePipelineFlow.pipelines.forEach((p: any) => {
    p?.nodes.forEach((n: any) => {
      const nodeProperties = n?.app_data?.component_parameters ?? {};
      delete nodeProperties.connection;
      delete nodeProperties.namespace;
    });
  });
  controller.setPipelineFlow(clonePipelineFlow);
}
