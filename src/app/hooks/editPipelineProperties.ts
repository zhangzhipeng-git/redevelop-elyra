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
  const connIds = res.map(({ connId }) => connId);
  const connNames = res.map(({ connName }) => connName);
  node_types?.forEach((node: any) => {
    const properties =
      node.app_data.properties.properties.component_parameters.properties;
    properties.connection.enum = connIds;
    properties.namespace.enumValues = connNames;

    properties.connection.default = connIds[0];
    properties.namespace.default = connNames[0];
  });
  controller.setPalette(clonePalette);

  // 2. 重置节点的k8s集群连接信息
  const pipelineFlow = controller.getPipelineFlow();
  if (!pipelineFlow) return;
  const clonePipelineFlow = Utils.clone(pipelineFlow);
  clonePipelineFlow.pipelines.forEach((p: any) => {
    p?.nodes.forEach((n: any) => {
      const nodeProperties = n?.app_data?.component_parameters ?? {};
      nodeProperties.connection = connIds[0];
      nodeProperties.namespace = connNames[0];
    });
  });
  controller.setPipelineFlow(clonePipelineFlow);
}
